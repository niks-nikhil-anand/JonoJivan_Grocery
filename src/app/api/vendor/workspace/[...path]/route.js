import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import uploadImage from "@/lib/uploadImages";
import { requireVendor, publicVendor, VendorError } from "@/lib/vendor/server";
import {
  transitions,
  moneyInput,
  productScope,
  orderScope,
} from "@/lib/vendor/rules";

export const dynamic = "force-dynamic";
const fail = (message, status = 400) => {
  throw new VendorError(message, status);
};
const text = (value, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const safeMoney = (value) => {
  try {
    return moneyInput(value);
  } catch (e) {
    fail(e.message);
  }
};
const categories = ["Orders", "Products", "Payments", "Account", "Other"];
const includeProduct = { category: true, subCategory: true };
async function ownedProduct(id, vendorId) {
  const product = await prisma.product.findFirst({
    where: { id, ...productScope(vendorId) },
    include: includeProduct,
  });
  if (!product) fail("Product not found.", 404);
  return product;
}
async function ordersFor(vendorId, id) {
  const rows = await prisma.order.findMany({
    where: { ...orderScope(vendorId), ...(id ? { id } : {}) },
    orderBy: { orderedAt: "desc" },
    select: {
      id: true,
      invoiceNo: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      orderedAt: true,
      address: {
        select: {
          firstName: true,
          lastName: true,
          addressLine1: true,
          apartment: true,
          city: true,
          state: true,
          postalCode: true,
          mobileNumber: true,
        },
      },
      cart: {
        select: {
          items: {
            where: { product: productScope(vendorId) },
            select: {
              id: true,
              quantity: true,
              unitPrice: true,
              product: {
                select: { id: true, name: true, featuredImageUrl: true },
              },
            },
          },
        },
      },
    },
  });
  const fulfillment = await prisma.vendorFulfillment.findMany({
    where: { vendorId, orderId: { in: rows.map((row) => row.id) } },
  });
  return rows.map(({ cart, ...row }) => {
    const record = fulfillment.find((item) => item.orderId === row.id);
    const status =
      row.status === "CANCELLED" ? "CANCELLED" : record?.status || row.status;
    return {
      ...row,
      status,
      items: cart?.items || [],
      subtotal:
        (cart?.items || []).reduce(
          (sum, item) =>
            sum + Math.round(Number(item.unitPrice) * 100) * item.quantity,
          0,
        ) / 100,
      history: record?.history || [],
      nextStatuses: transitions[status] || [],
    };
  });
}
async function walletFor(db, vendorId) {
  const [entries, withdrawals] = await Promise.all([
    db.vendorLedgerEntry.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    }),
    db.vendorWithdrawal.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const credit = entries.reduce(
    (sum, row) => sum + Math.round(Number(row.amount) * 100),
    0,
  );
  const pending = withdrawals
    .filter((row) => row.status === "PENDING")
    .reduce((sum, row) => sum + Math.round(Number(row.amount) * 100), 0);
  const paid = withdrawals
    .filter((row) => row.status === "PAID")
    .reduce((sum, row) => sum + Math.round(Number(row.amount) * 100), 0);
  return {
    entries,
    withdrawals,
    available: (credit - pending - paid) / 100,
    pending: pending / 100,
    paid: paid / 100,
  };
}
async function productData(body) {
  const name = text(body.name),
    categoryId = text(body.categoryId),
    subCategoryId = text(body.subCategoryId);
  if (!name || !text(body.description, 10000))
    fail("Product name and description are required.");
  const sub = await prisma.subCategory.findFirst({
    where: { id: subCategoryId, categoryId },
  });
  if (!sub) fail("Select a valid category and subcategory.");
  const salePrice = safeMoney(body.salePrice),
    originalPrice = safeMoney(body.originalPrice);
  if (salePrice > originalPrice)
    fail("Sale price cannot exceed original price.");
  const stock = Number(body.stock),
    weightValue = safeMoney(body.weightValue);
  if (
    body.stock === "" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 1000000 ||
    weightValue <= 0 ||
    weightValue > 99999999.99
  )
    fail("Enter valid stock and weight values.");
  if (!["kg", "g", "l", "ml", "piece", "pack"].includes(body.weightUnit))
    fail("Select a valid unit.");
  const images = Array.isArray(body.images) ? body.images : [];
  const validUrl = (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  };
  if (
    !validUrl(body.featuredImageUrl) ||
    images.length > 8 ||
    images.some((url) => !validUrl(url))
  )
    fail("Add a cover image and up to eight valid gallery images.");
  return {
    name,
    categoryId,
    subCategoryId,
    description: text(body.description, 10000),
    salePrice,
    originalPrice,
    stock,
    weightValue,
    weightUnit: body.weightUnit,
    featuredImageUrl: body.featuredImageUrl,
    images,
    tags: text(body.tags, 500)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20),
  };
}
async function handle(req, { params }) {
  try {
    const user = await requireVendor();
    if (req.method !== "GET") {
      const origin = req.headers.get("origin");
      if (origin && origin !== new URL(req.url).origin)
        fail("Invalid request origin.", 403);
    }
    const [resource, id] = params.path;
    const vendorId = user.id;
    if (req.method === "GET") {
      if (resource === "profile") return NextResponse.json(publicVendor(user));
      if (resource === "categories")
        return NextResponse.json(
          await prisma.category.findMany({
            include: { subcategories: true },
            orderBy: { name: "asc" },
          }),
        );
      if (resource === "products")
        return NextResponse.json(
          id
            ? await ownedProduct(id, vendorId)
            : await prisma.product.findMany({
                where: productScope(vendorId),
                include: includeProduct,
                orderBy: { createdAt: "desc" },
              }),
        );
      if (resource === "orders") {
        const rows = await ordersFor(vendorId, id);
        if (id && !rows.length) fail("Order not found.", 404);
        return NextResponse.json(id ? rows[0] : rows);
      }
      if (resource === "reviews")
        return NextResponse.json(
          await prisma.review.findMany({
            where: { product: productScope(vendorId) },
            select: {
              id: true,
              name: true,
              rating: true,
              title: true,
              body: true,
              createdAt: true,
              product: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
          }),
        );
      if (resource === "wallet")
        return NextResponse.json(await walletFor(prisma, vendorId));
      if (resource === "tickets") {
        if (id) {
          const ticket = await prisma.vendorTicket.findFirst({
            where: { id, vendorId },
          });
          if (!ticket) fail("Ticket not found.", 404);
          return NextResponse.json(ticket);
        }
        return NextResponse.json(
          await prisma.vendorTicket.findMany({
            where: { vendorId },
            orderBy: { updatedAt: "desc" },
          }),
        );
      }
    }
    if (resource === "uploads" && req.method === "POST") {
      const form = await req.formData();
      const file = form.get("file");
      if (
        !file ||
        typeof file.arrayBuffer !== "function" ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
      )
        fail("Choose a JPG, PNG, or WebP image under 5 MB.");
      const result = await uploadImage(file, `vendors/${vendorId}`);
      return NextResponse.json({ url: result.secure_url });
    }
    const body = await req.json().catch(() => fail("Invalid request body."));
    if (resource === "products") {
      if (req.method === "POST" && !id) {
        const data = await productData(body);
        return NextResponse.json(
          await prisma.product.create({
            data: {
              ...data,
              slug: `${data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .slice(0, 60)}-${randomUUID().slice(0, 8)}`,
              status: "IN_REVIEW",
              users: { connect: { id: vendorId } },
            },
          }),
          { status: 201 },
        );
      }
      if (req.method === "PATCH" && id) {
        await ownedProduct(id, vendorId);
        // A shared catalog entry must not be mutated by one of several sellers.
        const owners = await prisma.user.count({
          where: { products: { some: { id } } },
        });
        if (owners > 1)
          fail("This shared product must be updated by support.", 409);
        const data =
          body.action === "archive"
            ? { status: "INACTIVE" }
            : { ...(await productData(body)), status: "IN_REVIEW" };
        return NextResponse.json(
          await prisma.product.update({ where: { id }, data }),
        );
      }
    }
    if (resource === "orders" && id && req.method === "PATCH") {
      const result = await prisma.$transaction(
        async (tx) => {
          // Serialize fulfillment changes per order, including duplicate submissions.
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${"vendor-order:" + id}))`;
          const order = await tx.order.findFirst({
            where: { id, ...orderScope(vendorId) },
            select: {
              status: true,
              cart: {
                select: {
                  items: {
                    select: {
                      product: {
                        select: {
                          users: {
                            where: { role: "VENDOR" },
                            select: { id: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          if (!order) fail("Order not found.", 404);
          const current = await tx.vendorFulfillment.findUnique({
            where: { vendorId_orderId: { vendorId, orderId: id } },
          });
          const status =
            order.status === "CANCELLED"
              ? "CANCELLED"
              : current?.status || order.status;
          if (!(transitions[status] || []).includes(body.status))
            fail("This status transition is not allowed.", 409);
          const history = [
            ...(Array.isArray(current?.history) ? current.history : []),
            { status: body.status, at: new Date().toISOString() },
          ];
          const updated = await tx.vendorFulfillment.upsert({
            where: { vendorId_orderId: { vendorId, orderId: id } },
            create: { vendorId, orderId: id, status: body.status, history },
            update: { status: body.status, history },
          });
          const items = order.cart?.items || [];
          const ownerIds = [
            ...new Set(
              items.flatMap((item) =>
                item.product.users.map((owner) => owner.id),
              ),
            ),
          ];
          // Shared products and unassigned products need administrative fulfillment.
          if (
            items.length &&
            items.every((item) => item.product.users.length === 1)
          ) {
            const records = await tx.vendorFulfillment.findMany({
              where: { orderId: id, vendorId: { in: ownerIds } },
            });
            if (records.length === ownerIds.length) {
              const states = records.map((record) => record.status);
              const sequence = [
                "PENDING",
                "ORDER_PLACED",
                "PROCESSING",
                "PICKED_UP",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
              ];
              // A partial cancellation needs admin review; don't mark a mixed order delivered.
              const allCancelled = states.every(
                (state) => state === "CANCELLED",
              );
              if (allCancelled || !states.includes("CANCELLED")) {
                const next = allCancelled
                  ? "CANCELLED"
                  : sequence[
                      Math.min(
                        ...states.map((state) => sequence.indexOf(state)),
                      )
                    ];
                await tx.order.update({
                  where: { id },
                  data: {
                    status: next,
                    ...(next === "DELIVERED"
                      ? { deliveryDate: new Date() }
                      : {}),
                  },
                });
              }
            }
          }
          return updated;
        },
        { timeout: 15000 },
      );
      return NextResponse.json(result);
    }
    if (resource === "profile" && req.method === "PATCH") {
      if (!text(body.fullName)) fail("Your name is required.");
      if (body.mobileNumber && !/^\+?[0-9\s-]{10,16}$/.test(body.mobileNumber))
        fail("Enter a valid phone number.");
      if (
        body.shopPhotoUrl &&
        !/^https:\/\/res\.cloudinary\.com\//.test(body.shopPhotoUrl)
      )
        fail("Upload a valid shop photo.");
      const profile = {
        businessName: text(body.businessName),
        businessAddress: text(body.businessAddress, 1000),
        ...(body.shopPhotoUrl !== undefined
          ? { shopPhotoUrl: body.shopPhotoUrl || null }
          : {}),
      };
      return NextResponse.json(
        publicVendor(
          await prisma.user.update({
            where: { id: vendorId },
            data: {
              fullName: text(body.fullName),
              mobileNumber: text(body.mobileNumber, 20) || null,
              vendorProfile: { upsert: { create: profile, update: profile } },
            },
            include: { vendorProfile: true },
          }),
        ),
      );
    }
    if (resource === "password" && req.method === "POST") {
      if (
        !user.passwordHash ||
        !(await bcrypt.compare(
          String(body.currentPassword || ""),
          user.passwordHash,
        ))
      )
        fail("Current password is incorrect.");
      if (
        typeof body.password !== "string" ||
        body.password.length < 10 ||
        Buffer.byteLength(body.password) > 72
      )
        fail("Use a password of 10–72 bytes.");
      await prisma.user.update({
        where: { id: vendorId },
        data: {
          passwordHash: await bcrypt.hash(body.password, 12),
          resetPasswordToken: null,
          resetPasswordExpiresAt: null,
        },
      });
      return NextResponse.json({ message: "Password updated." });
    }
    if (resource === "tickets") {
      const message = text(body.message, 5000);
      if (!message) fail("Enter a message.");
      if (!id && req.method === "POST") {
        if (!text(body.subject) || !categories.includes(body.category))
          fail("Enter a subject and select a category.");
        return NextResponse.json(
          await prisma.vendorTicket.create({
            data: {
              vendorId,
              subject: text(body.subject),
              category: body.category,
              messages: [
                {
                  author: "Vendor",
                  body: message,
                  at: new Date().toISOString(),
                },
              ],
            },
          }),
          { status: 201 },
        );
      }
      if (id && req.method === "POST") {
        const ticket = await prisma.$transaction(async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${id}))`;
          const current = await tx.vendorTicket.findFirst({
            where: { id, vendorId },
          });
          if (!current) fail("Ticket not found.", 404);
          if (current.status === "CLOSED")
            fail("This ticket is closed. Please open a new ticket.", 409);
          return tx.vendorTicket.update({
            where: { id },
            data: {
              messages: [
                ...current.messages,
                {
                  author: "Vendor",
                  body: message,
                  at: new Date().toISOString(),
                },
              ],
            },
          });
        });
        return NextResponse.json(ticket);
      }
    }
    if (resource === "withdrawals" && req.method === "POST") {
      const amount = safeMoney(body.amount),
        destination = text(body.destination, 150);
      if (amount < 1 || !/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(destination))
        fail("Enter an amount of at least ₹1 and a valid UPI ID.");
      const withdrawal = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${vendorId}))`;
        const wallet = await walletFor(tx, vendorId);
        if (amount > wallet.available)
          fail("The amount exceeds your available balance.");
        return tx.vendorWithdrawal.create({
          data: { vendorId, amount, destination },
        });
      });
      return NextResponse.json(withdrawal, { status: 201 });
    }
    fail("Page not found.", 404);
  } catch (error) {
    if (!(error instanceof VendorError))
      console.error(
        "Vendor workspace request failed:",
        error.code || error.name,
      );
    return NextResponse.json(
      {
        message:
          error instanceof VendorError
            ? error.message
            : "We couldn’t complete this request. Please try again.",
      },
      { status: error instanceof VendorError ? error.status : 500 },
    );
  }
}
async function dispatch(req, context) {
  const response = await handle(req, context);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export { dispatch as GET, dispatch as POST, dispatch as PATCH };
