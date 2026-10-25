export async function findOrCreateOAuthUser({ name, email }) {
  if (!email) throw new Error("OAuth provider did not return an email address");

  if (process.env.AUTH_DATABASE === "postgresql") {
    const prisma = (await import("./prisma.js")).default;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { fullName: name || email, email, role: "USER", status: "ACTIVE" },
      });
    }
    return { id: user.id, email: user.email };
  }

  const connectDB = (await import("./dbConnect.js")).default;
  const User = (await import("../models/userModels.js")).default;
  await connectDB();
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ fullName: name, email });
  return { id: String(user._id), email: user.email };
}
