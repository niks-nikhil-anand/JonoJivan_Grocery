import prisma from "./prisma";

export async function findOrCreateOAuthUser({ name, email }) {
  if (!email) throw new Error("OAuth provider did not return an email address");
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { fullName: name || email, email, role: "USER", status: "ACTIVE" },
  });
  return { id: user.id, email: user.email };
}
