
// app/api/company/check-name/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const existingCompany = await prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json({
      available: !existingCompany,
    });
  } catch (error) {
    console.error("Check company name error:", error);
    return NextResponse.json(
      { error: "Failed to check company name" },
      { status: 500 }
    );
  }
}