import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && credentials.password === user.password) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: "YOUR_SECRET_KEY",
});
