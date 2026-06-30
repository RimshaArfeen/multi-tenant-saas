// app/api/company/setup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import type { Prisma } from "@prisma/client";
 
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, currency, country, logo } = await req.json();

    // Validate input
    if (!name || !currency) {
      return NextResponse.json(
        { error: "Company name and currency are required" },
        { status: 400 }
      );
    }

    // Get the user with their current company
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If user already has a company, return success
    if (user.companyId && user.company) {
      return NextResponse.json({
        success: true,
        company: user.company,
        message: "Company already exists",
      });
    }

    // Check if company name already exists (case insensitive check)
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive', // Case insensitive search
        },
      },
    });

    if (existingCompany) {
      // If company exists but user doesn't have it, we could connect the user to it
      // or show an error. Let's show an error for now.
      return NextResponse.json(
        { error: "A company with this name already exists. Please choose a different name." },
        { status: 400 }
      );
    }

    // Create the company with a transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the company
      const company = await tx.company.create({
        data: {
          name,
          currency: currency as any,
          country: country || null,
          logo: logo || null,
          settings: {
            create: {}, // Create default settings
          },
        },
        include: {
          settings: true,
        },
      });

      // Update user with company ID and role
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          role: "OWNER",
          companyId: company.id,
        },
        include: {
          company: true,
        },
      });

      return { company, user: updatedUser };
    });

    return NextResponse.json({
      success: true,
      company: result.company,
      user: result.user,
    });
  } catch (error) {
    console.error("Company setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup company" },
      { status: 500 }
    );
  }
}