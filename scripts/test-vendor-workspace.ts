import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";

// Creates only uniquely named fixtures; cleans up its own records in finally.
const host = process.env.VENDOR_TEST_URL || "http://localhost:3000";
const tag = `vendor-test-${randomUUID()}`;
const ids: Record<string, string> = {};
const cookies: Record<string, string> = {};
async function request(
  path: string,
  who = "a",
  method = "GET",
  body?: unknown,
) {
  const res = await fetch(`${host}/api/vendor/workspace/${path}`, {
    method,
    headers: {
      Cookie: cookies[who] || "",
      "Content-Type": "application/json",
      Origin: host,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}
async function main() {
  for (const key of ["a", "b", "blocked", "customer"]) {
    const user = await prisma.user.create({
      data: {
        email: `${tag}-${key}@example.invalid`,
        fullName: `Test vendor ${key}`,
        passwordHash: await bcrypt.hash("Test-only-passphrase-123", 10),
        role: key === "customer" ? "USER" : "VENDOR",
        status: key === "blocked" ? "BLOCKED" : "ACTIVE",
      },
    });
    ids[key] = user.id;
    cookies[key] =
      `vendorAuthToken=${jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { algorithm: "HS256", expiresIn: "5m" })}`;
  }
  assert.equal((await request("products", "none")).status, 401);
  assert.equal((await request("products", "blocked")).status, 403);
  assert.equal((await request("products", "customer")).status, 403);
  cookies.forged = `vendorAuthToken=${jwt.sign({ id: ids.a, email: `${tag}-a@example.invalid` }, "wrong-secret")}`;
  assert.equal((await request("products", "forged")).status, 401);
  const cat = await prisma.category.create({
    data: { name: tag, subcategories: { create: { name: tag } } },
    include: { subcategories: true },
  });
  ids.category = cat.id;
  ids.subcategory = cat.subcategories[0].id;
  const productBody = {
    name: tag,
    description: "Workspace test fixture",
    categoryId: cat.id,
    subCategoryId: ids.subcategory,
    salePrice: "10.50",
    originalPrice: "12",
    stock: "5",
    weightValue: "1",
    weightUnit: "kg",
    featuredImageUrl: "https://example.invalid/product.png",
    images: [],
    tags: "test",
  };
  assert.equal(
    (
      await request("products", "a", "POST", {
        ...productBody,
        salePrice: "15",
      })
    ).status,
    400,
  );
  const created = await request("products", "a", "POST", productBody);
  assert.equal(created.status, 201);
  ids.product = created.data.id;
  assert.equal(created.data.status, "IN_REVIEW");
  assert.equal((await request(`products/${ids.product}`, "b")).status, 404);
  assert.equal(
    (
      await request(`products/${ids.product}`, "b", "PATCH", {
        action: "archive",
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await request(`products/${ids.product}`, "a", "PATCH", {
        ...productBody,
        name: `${tag} edited`,
      })
    ).status,
    200,
  );
  const productB = await request("products", "b", "POST", {
    ...productBody,
    name: `${tag} b`,
  });
  ids.productB = productB.data.id;
  const address = await prisma.address.create({
    data: {
      firstName: "Test",
      lastName: "Customer",
      addressLine1: "Test address",
      state: "Test state",
      city: "Test city",
      postalCode: "700001",
      email: `${tag}@example.invalid`,
      type: "HOME",
    },
  });
  ids.address = address.id;
  const cart = await prisma.cart.create({
    data: {
      items: {
        create: [
          { productId: ids.product, quantity: 2, unitPrice: "9.50" },
          { productId: ids.productB, quantity: 1, unitPrice: "10.50" },
        ],
      },
    },
  });
  ids.cart = cart.id;
  const order = await prisma.order.create({
    data: {
      cartId: cart.id,
      addressId: address.id,
      invoiceNo: tag,
      totalAmount: "29.50",
      paymentMethod: "CASH_ON_DELIVERY",
      status: "ORDER_PLACED",
    },
  });
  ids.order = order.id;
  const result = await request(`orders/${order.id}`);
  assert.equal(result.status, 200);
  assert.equal(result.data.items.length, 1);
  assert.equal(result.data.subtotal, 19);
  assert.equal(result.data.items[0].product.id, ids.product);
  assert.equal(
    (await request(`orders/${order.id}`, "a", "PATCH", { status: "DELIVERED" }))
      .status,
    409,
  );
  assert.equal(
    (
      await request(`orders/${order.id}`, "a", "PATCH", {
        status: "PROCESSING",
      })
    ).status,
    200,
  );
  assert.equal(
    (await request(`orders/${order.id}`, "b")).data.status,
    "ORDER_PLACED",
  );
  assert.equal(
    (await prisma.order.findUnique({ where: { id: order.id } }))!.status,
    "ORDER_PLACED",
  );
  assert.equal((await request(`orders/${order.id}`, "b", "PATCH", { status: "PROCESSING" })).status, 200);
  assert.equal((await prisma.order.findUnique({ where: { id: order.id } }))!.status, "PROCESSING");
  for (const endpoint of ["categories", "products", "orders", "reviews", "profile", "wallet", "tickets"]) {
    assert.equal((await request(endpoint)).status, 200, endpoint);
  }
  const ticket = await request("tickets", "a", "POST", {
    subject: tag,
    category: "Products",
    message: "Automated test message",
  });
  assert.equal(ticket.status, 201);
  ids.ticket = ticket.data.id;
  assert.equal((await request(`tickets/${ids.ticket}`, "b")).status, 404);
  assert.equal(
    (
      await request(`tickets/${ids.ticket}`, "a", "POST", {
        message: "Test reply",
      })
    ).data.messages.length,
    2,
  );
  assert.equal(
    (
      await request("profile", "a", "PATCH", {
        fullName: "Updated test vendor",
        businessName: "Test business",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request("password", "a", "POST", {
        currentPassword: "wrong",
        password: "Long-new-password",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("password", "a", "POST", {
        currentPassword: "Test-only-passphrase-123",
        password: "Long-new-password",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request("withdrawals", "a", "POST", {
        amount: 1,
        destination: "test@bank",
      })
    ).status,
    400,
  );
  await prisma.vendorLedgerEntry.create({
    data: {
      vendorId: ids.a,
      reference: tag,
      label: "Test settlement",
      amount: "100",
    },
  });
  const concurrent = await Promise.all([
    request("withdrawals", "a", "POST", {
      amount: 75,
      destination: "test@bank",
    }),
    request("withdrawals", "a", "POST", {
      amount: 75,
      destination: "test@bank",
    }),
  ]);
  assert.deepEqual(concurrent.map((r) => r.status).sort(), [201, 400]);
  assert.equal((await request("wallet")).data.available, 25);
  assert.equal((await request("wallet", "b")).data.available, 0);
  for (const route of ["", "/orders", `/orders/${ids.order}`, "/product/allProduct", "/product/addProduct", `/product/${ids.product}`, `/product/${ids.product}/edit`, "/review", "/profile", "/settings", "/tickets", "/tickets/new", `/tickets/${ids.ticket}`, "/wallet", "/wallet/transactions", "/wallet/withdrawals", "/search?q=test"]) {
    const response = await fetch(`${host}/vendor/dashboard${route}`, { headers: { Cookie: cookies.a } });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes("Vendor workspace"), route);
    assert.ok(!html.includes("NEXT_REDIRECT"), route);
  }
  const logout = await fetch(`${host}/api/vendor/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookies.a },
  });
  assert.ok(logout.headers.get("set-cookie")?.startsWith("vendorAuthToken="));
  console.log(
    "PASS: authentication, tenant isolation, product validation/editing, mixed-vendor orders, fulfillment transitions, tickets, profile, password, concurrent withdrawals, and logout.",
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    const vendorIds = [ids.a, ids.b, ids.blocked, ids.customer].filter(Boolean);
    await prisma.vendorFulfillment.deleteMany({
      where: { vendorId: { in: vendorIds } },
    });
    await prisma.vendorWithdrawal.deleteMany({
      where: { vendorId: { in: vendorIds } },
    });
    await prisma.vendorLedgerEntry.deleteMany({
      where: { vendorId: { in: vendorIds } },
    });
    await prisma.vendorTicket.deleteMany({
      where: { vendorId: { in: vendorIds } },
    });
    if (ids.order) await prisma.order.delete({ where: { id: ids.order } });
    if (ids.cart) await prisma.cart.delete({ where: { id: ids.cart } });
    if (ids.address)
      await prisma.address.delete({ where: { id: ids.address } });
    await prisma.product.deleteMany({
      where: { id: { in: [ids.product, ids.productB].filter(Boolean) } },
    });
    if (ids.category)
      await prisma.category.delete({ where: { id: ids.category } });
    await prisma.user.deleteMany({ where: { id: { in: vendorIds } } });
    await prisma.$disconnect();
  });
