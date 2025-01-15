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

    console.log(session.user.email, "SESSION USER EMAIL");

    const { leaseId, sharedWithEmail } = await request.json();
    const sharedByEMail = session.user.email;

    const sharedUser = await prisma.user.findUnique({
      where: { email: sharedWithEmail },
    });

    if (!sharedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (session.user.email === sharedWithEmail) {
      return NextResponse.json(
        { message: "Cannot share lease with yourself" },
        { status: 400 }
      );
    }
    console.log(leaseId, sharedWithEmail, sharedByEMail, "LEASE ID AND EMAIL");

    const sharedLease = await prisma.sharedLease.create({
      data: {
        leaseId,
        sharedWithEmail,
        sharedByEmail: sharedByEMail,
      },
    });
    console.log(sharedLease, "SHARED LEASE");

    return NextResponse.json(sharedLease, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to share lease" },
      { status: 500 }
    );
  }
}
