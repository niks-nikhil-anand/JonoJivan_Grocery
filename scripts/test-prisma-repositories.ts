import "dotenv/config";
import assert from "node:assert/strict";
import prisma from "../src/lib/prisma";
import { createModel, present, toWhere } from "../src/lib/prismaModel";

async function main() {
  assert.deepEqual(toWhere("Product", { category: "neon-category", status: { $nin: ["Inactive", "Out of stock"] } }), { categoryId: "neon-category", status: { notIn: ["INACTIVE", "OUT_OF_STOCK"] } });
  assert.deepEqual(toWhere("Order", { $or: [{ orderStatus: { $regex: "placed", $options: "i" } }, { invoiceNo: { $regex: "invoice", $options: "i" } }] }), { OR: [{ status: { in: ["ORDER_PLACED"] } }, { invoiceNo: { contains: "invoice", mode: "insensitive" } }] });
  assert.throws(() => toWhere("Product", { unknown: "must not match everything" }), /Unsupported/);
  const row = { id: "p1", name: "Rice", slug: "rice", categoryId: "c1", status: "ACTIVE", salePrice: "80", originalPrice: "100", featuredImageUrl: "rice.jpg", weightValue: "1", weightUnit: "kg", averageRating: "4.5", ratingCount: 2 };
  const product = present("Product", row);
  assert.equal(product._id, "p1"); assert.equal(product.category, "c1"); assert.equal(product.salePrice, 80);
  assert.deepEqual(product.weight, { value: 1, unit: "kg" }); assert.equal(product.status, "Active");

  const restorers: (() => void)[] = [];
  function stub(target: any, method: string, fn: any) { const original = target[method]; target[method] = fn; restorers.push(() => target[method] = original); }
  try {
    stub(prisma.product, "findMany", async (args: any) => {
      assert.equal(args.include.category !== undefined, true);
      return [{ ...row, category: { id: "c1", name: "Rice", imageUrl: "rice.jpg" } }];
    });
    const unmatched = await createModel("Product").find().populate({ path: "category", match: { name: "Other" }, select: "name" });
    assert.equal(unmatched[0].category, null);
    const matched = await createModel("Product").find().populate({ path: "category", match: { name: { $in: ["Rice"] } }, select: "name" });
    assert.deepEqual(matched[0].category, { _id: "c1", id: "c1", name: "Rice" });

    stub(prisma.product, "create", async ({ data }: any) => {
      assert.match(data.slug, /^rice-/); assert.equal(data.weightValue, 1); assert.equal(data.categoryId, "c1");
      assert.deepEqual(data.users, { connect: [{ id: "vendor1" }] });
      const { users, ...scalars } = data;
      return { ...row, ...scalars };
    });
    await createModel("Product").create({ name: "Rice", category: "c1", weight: { value: "1", unit: "kg" }, users: "vendor1" });

    stub(prisma.cart, "create", async ({ data }: any) => {
      assert.deepEqual(data.items, { create: [{ productId: "p1", quantity: 2, unitPrice: 80 }] });
      return { id: "cart1", items: [{ productId: "p1", quantity: 2, unitPrice: "80" }] };
    });
    const cart = await createModel("Cart").create({ items: [{ productId: "p1", quantity: 2, price: 80 }] });
    assert.equal(cart.items[0].price, 80);
    stub(prisma.cart, "update", async ({ data }: any) => {
      assert.deepEqual(data.items, { deleteMany: {}, create: [{ productId: "p1", quantity: 3, unitPrice: 80 }] });
      return { id: "cart1", items: [{ productId: "p1", quantity: 3, unitPrice: 80 }] };
    });
    cart.items[0].quantity = 3; await cart.save();
    await assert.rejects(createModel("Cart").create({ items: [{ productId: "p1", quantity: 0, price: 80 }] }), /positive integers/);

    let claimed = false;
    stub(prisma.rechargeTransaction, "updateManyAndReturn", async ({ where, data }: any) => {
      assert.deepEqual(where, { transactionId: "txn1", status: "PAID" });
      assert.equal(data.status, "PROCESSING");
      if (claimed) return [];
      claimed = true;
      return [{ id: "r1", transactionId: "txn1", type: "MOBILE", subscriberNumber: "9999999999", amount: "100", ...data }];
    });
    const Tx = createModel("RechargeTransaction");
    const results = await Promise.all([Tx.findOneAndUpdate({ txnId: "txn1", status: "PAID" }, { $set: { status: "PROCESSING" } }), Tx.findOneAndUpdate({ txnId: "txn1", status: "PAID" }, { $set: { status: "PROCESSING" } })]);
    assert.equal(results.filter(Boolean).length, 1); assert.equal(results.find(Boolean).type, "mobile");
    stub(prisma.rechargeTransaction, "updateMany", async ({ where, data }: any) => {
      assert.deepEqual(where, { transactionId: "txn1" }); assert.deepEqual(data, { checkCount: { increment: 1 } }); return { count: 1 };
    });
    assert.deepEqual(await Tx.updateOne({ txnId: "txn1" }, { $inc: { checkCount: 1 } }), { modifiedCount: 1 });

    stub(prisma.user, "findFirst", async () => ({ id: "u1", email: "test@example.invalid", passwordHash: "never-return", role: "USER", status: "ACTIVE" }));
    const user = await createModel("User").findById("u1");
    assert.equal(user.password, "never-return"); assert.equal(JSON.stringify(user).includes("never-return"), false);
    stub(prisma.user, "findMany", async () => [{ id: "u1", passwordHash: "never-return" }]);
    const projected = await createModel("User").find({}, { password: 0 });
    assert.equal(JSON.stringify(projected).includes("never-return"), false);
  } finally { restorers.reverse().forEach(restore => restore()); }
  console.log("PASS repository field/enum mappings, relation matching, product writes, guest cart saves, atomic recharge claims, increments, and password redaction (database mutations stubbed).");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
