import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sharedLeases = await prisma.sharedLease.findMany({
      where: {
        sharedByEmail: session.user.email,
      },
      include: {
        lease: true,
      },
    });

    return NextResponse.json(sharedLeases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch shared leases" },
      { status: 500 }
    );
  }
}
