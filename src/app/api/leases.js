import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { startDate, endDate, monthlyRent } = req.body;
    try {
      const lease = await prisma.lease.create({
        data: { startDate, endDate, monthlyRent },
      });
      res.status(200).json(lease);
    } catch (error) {
      res.status(500).json({ error: "Error creating lease" });
    }
  } else if (req.method === "GET") {
    try {
      const leases = await prisma.lease.findMany();
      res.status(200).json(leases);
    } catch (error) {
      res.status(500).json({ error: "Error fetching leases" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
