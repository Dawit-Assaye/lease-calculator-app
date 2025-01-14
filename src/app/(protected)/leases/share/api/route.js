import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { leaseId, sharedWithEmail } = await request.json();

    const sharedUser = await prisma.user.findUnique({
      where: { email: sharedWithEmail },
    });

    if (!sharedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const sharedLease = await prisma.sharedLease.create({
      data: {
        leaseId,
        userId: sharedUser.id,
      },
    });

    return NextResponse.json(sharedLease, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to share lease" },
      { status: 500 }
    );
  }
}
