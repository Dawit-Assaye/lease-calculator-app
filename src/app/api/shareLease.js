import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { leaseId, sharedWithEmail } = req.body;
    try {
      const sharedLease = await prisma.sharedLease.create({
        data: {
          leaseId,
          sharedWithEmail,
        },
      });
      res.status(200).json(sharedLease);
    } catch (error) {
      res.status(500).json({ error: "Error sharing lease" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
