import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

import { z } from "zod";

const prisma = new PrismaClient();

const leaseSchema = z.object({
  startDate: z.string().transform((date) => new Date(date).toISOString()),
  endDate: z.string().transform((date) => new Date(date).toISOString()),
  monthlyRent: z.number(),
  securityDeposit: z.number(),
  additionalCharges: z.number(),
  annualRentIncrease: z.number(),
  leaseType: z.string(),
  utilitiesIncluded: z.boolean(),
  maintenanceFees: z.number(),
  latePaymentPenalty: z.number(),
});

export async function PUT(request) {
  const session = await getServerSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { id, ...leaseData } = await request.json();

    console.log(id, "LEASE ID");
    const validatedData = leaseSchema.parse(leaseData);

    const lease = await prisma.lease.update({
      where: {
        id: id,
      },
      data: validatedData,
    });

    return new Response(JSON.stringify(lease), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error updating lease",
        details: error instanceof z.ZodError ? error.errors : error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Convert the ID to integer
    const leaseId = parseInt(params.id);

    // First delete any associated shared leases
    await prisma.sharedLease.deleteMany({
      where: {
        leaseId: leaseId,
      },
    });

    // Then delete the lease
    const deletedLease = await prisma.lease.delete({
      where: {
        id: leaseId,
      },
    });

    return new Response(JSON.stringify(deletedLease), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error deleting lease",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
