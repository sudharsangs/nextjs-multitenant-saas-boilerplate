const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

enum Plan {
  TRIAL = "TRIAL",
  FREE = "FREE",
  BASIC = "BASIC",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

enum Feature {
  ORDER_MATRIX = "ORDER_MATRIX",
  INVENTORY_AXIS = "INVENTORY_AXIS",
  ADVANCED_REPORTING = "ADVANCED_REPORTING",
  API_ACCESS = "API_ACCESS",
  MULTI_LOCATION = "MULTI_LOCATION",
  BATCH_TRACKING = "BATCH_TRACKING",
  SERIAL_TRACKING = "SERIAL_TRACKING",
}

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  UNPAID = "UNPAID",
  TRIAL = "TRIAL",
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  try {
    // Create a company
    const company = await prisma.company.create({
      data: {
        name: "Demo Company",
        address: "123 Main St, Bengaluru, India",
        contactEmail: "contact@democompany.com",
        phone: "+1234567890",
        taxId: "TAX123456",
        settings: {},
        orderMatrixEnabled: true,
        inventoryAxisEnabled: true,
      },
    });

    // Create an admin user
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        passwordHash: await hash("password123", 12),
        role: "ADMIN",
        companyId: company.id,
      },
    });

    // Create user permissions
    await prisma.userPermission.create({
      data: {
        userId: adminUser.id,
        module: "ALL",
        permission: "FULL_ACCESS",
      },
    });

    // Create a subscription for the company
    const trialStartDate = new Date();
    const trialEndDate = addDays(trialStartDate, 30);

    await prisma.subscription.create({
      data: {
        companyId: company.id,
        plan: Plan.TRIAL,
        status: SubscriptionStatus.TRIAL,
        trialStartDate,
        trialEndDate,
        currentPeriodStart: trialStartDate,
        currentPeriodEnd: trialEndDate,
        features: {
          create: [
            { feature: Feature.ORDER_MATRIX, enabled: true },
            { feature: Feature.INVENTORY_AXIS, enabled: true },
            { feature: Feature.ADVANCED_REPORTING, enabled: true },
            { feature: Feature.MULTI_LOCATION, enabled: true },
          ],
        },
      },
    });

    // Create a location
    const warehouse = await prisma.location.create({
      data: {
        companyId: company.id,
        name: "Main Warehouse",
        address: "456 Storage Ave, City, Country",
        type: "WAREHOUSE",
      },
    });

    // Create a customer
    await prisma.customer.create({
      data: {
        companyId: company.id,
        name: "Sample Customer",
        contactPerson: "John Doe",
        email: "john@customer.com",
        phone: "+1234567891",
        address: "789 Customer St, City, Country",
        creditLimit: 10000,
        status: "ACTIVE",
      },
    });

    // Create a supplier
    await prisma.supplier.create({
      data: {
        companyId: company.id,
        name: "Sample Supplier",
        contactPerson: "Jane Smith",
        email: "jane@supplier.com",
        phone: "+1234567892",
        address: "321 Supplier Ave, City, Country",
        paymentTerms: "NET30",
        status: "ACTIVE",
      },
    });

    // Create a product
    const product = await prisma.product.create({
      data: {
        companyId: company.id,
        sku: "PROD001",
        name: "Sample Product",
        description: "A sample product description",
        category: "GENERAL",
        costPrice: 50,
        sellingPrice: 100,
        unitOfMeasure: "PCS",
        weight: 1,
        attributes: {},
      },
    });

    // Create inventory for the product
    await prisma.inventory.create({
      data: {
        productId: product.id,
        locationId: warehouse.id,
        quantityOnHand: 100,
        quantityAllocated: 0,
        quantityAvailable: 100,
        reorderPoint: 20,
        reorderQuantity: 50,
      },
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 