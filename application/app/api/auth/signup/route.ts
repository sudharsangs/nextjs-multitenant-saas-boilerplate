import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name: `${name}'s Company`,
        address: "",
        contactEmail: email,
        phone: "",
        taxId: "",
        settings: {},
        orderMatrixEnabled: true,
        inventoryAxisEnabled: true,
      },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await hash(password, 12),
        role: "ADMIN",
        companyId: company.id,
      },
      include: {
        company: true,
        permissions: true,
      },
    });

    // Create user permissions
    await prisma.userPermission.create({
      data: {
        userId: user.id,
        module: "ALL",
        permission: "FULL_ACCESS",
      },
    });

    // Create subscription
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await prisma.subscription.create({
      data: {
        companyId: company.id,
        plan: "TRIAL",
        status: "TRIAL",
        trialStartDate,
        trialEndDate,
        currentPeriodStart: trialStartDate,
        currentPeriodEnd: trialEndDate,
        features: {
          create: [
            { feature: "ORDER_MATRIX", enabled: true },
            { feature: "INVENTORY_AXIS", enabled: true },
            { feature: "ADVANCED_REPORTING", enabled: true },
            { feature: "MULTI_LOCATION", enabled: true },
          ],
        },
      },
    });

    // Generate token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        permissions: user.permissions,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 