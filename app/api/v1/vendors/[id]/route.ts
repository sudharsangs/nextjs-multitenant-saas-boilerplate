import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const vendorUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  gstin: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  isActive: z.boolean().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const vendorId = params.id;

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.id, vendorId),
        eq(vendors.companyId, companyId)
      ))
      .limit(1);

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (err) {
    console.error('Error in GET vendor by ID:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const vendorId = params.id;
    const body = await request.json();
    const updateData = vendorUpdateSchema.parse(body);

    // Check if vendor exists and belongs to the company
    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.id, vendorId),
        eq(vendors.companyId, companyId)
      ))
      .limit(1);

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // If email is being updated, check if it already exists
    if (updateData.email && updateData.email !== existingVendor.email) {
      const [emailExists] = await db
        .select()
        .from(vendors)
        .where(and(
          eq(vendors.email, updateData.email),
          eq(vendors.companyId, companyId),
          eq(vendors.isActive, true)
        ))
        .limit(1);

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use by another vendor' },
          { status: 400 }
        );
      }
    }

    const [updatedVendor] = await db
      .update(vendors)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(and(
        eq(vendors.id, vendorId),
        eq(vendors.companyId, companyId)
      ))
      .returning();

    return NextResponse.json(updatedVendor);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT vendor:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const vendorId = params.id;

    // Check if vendor exists and belongs to the company
    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.id, vendorId),
        eq(vendors.companyId, companyId)
      ))
      .limit(1);

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Soft delete the vendor by setting isActive to false
    await db
      .update(vendors)
      .set({ 
        isActive: false,
        updatedAt: new Date() 
      })
      .where(and(
        eq(vendors.id, vendorId),
        eq(vendors.companyId, companyId)
      ));

    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE vendor:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}