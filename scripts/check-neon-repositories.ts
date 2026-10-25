import "dotenv/config";
import prisma from "../src/lib/prisma";
import { createModel, toWhere } from "../src/lib/prismaModel";

async function main() {
  console.log("Field metadata:", prisma.product.fields.status.typeName);
  for (const model of ["User", "Category", "SubCategory", "Product", "Cart", "Order", "RechargeTransaction"]) {
    const rows = await createModel(model).find().limit(1).lean();
    console.log(`${model}: read passed (${rows.length} rows)`);
  }
  console.log("Enum filter:", JSON.stringify(toWhere("Product", { status: { $nin: ["Inactive"] } })));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
