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

export async function POST(request) {
  const session = await getServerSession();
  console.log("Session Data:", session);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const leaseData = await request.json();
    const validatedData = leaseSchema.parse(leaseData);

    const lease = await prisma.lease.create({
      data: {
        ...validatedData,
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return new Response(JSON.stringify(lease), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error saving lease data",
        details: error instanceof z.ZodError ? error.errors : error.message,
      }),
      { status: 500 }
    );
  }
}
