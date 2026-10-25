import prisma from "@/lib/prisma";

const models = { privacy: prisma.privacyPolicy, return: prisma.returnPolicy, shipping: prisma.shippingPolicy, terms: prisma.termsAndConditions };
const present = (value) => value && ({ ...value, _id: value.id });

export async function savePolicy(kind, content) {
  const model = models[kind]; const current = await model.findFirst({ orderBy: { createdAt: "asc" } });
  return present(current ? await model.update({ where: { id: current.id }, data: { content } }) : await model.create({ data: { content } }));
}
export async function getPolicy(kind) { return present(await models[kind].findFirst({ orderBy: { createdAt: "asc" } })); }
