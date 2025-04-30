# Inventory Management System API Documentation

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Subscription Management](#subscription-management)
3. [Tenant & Company Management](#tenant--company-management)
4. [Product Management](#product-management)
5. [Inventory Management](#inventory-management)
6. [Manufacturing Management](#manufacturing-management)
7. [Purchase Management](#purchase-management)
8. [Sales Management](#sales-management)
9. [Location Management](#location-management)
10. [BOM Management](#bom-management)
11. [Unit Management](#unit-management)
12. [Audit & Reporting](#audit--reporting)

## Authentication & Authorization

### Auth APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | User login with email and password |
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/refresh-token` | POST | Refresh authentication token |
| `/api/v1/auth/logout` | POST | Logout user |
| `/api/v1/auth/me` | GET | Get current user details |

### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users` | GET | List all users |
| `/api/v1/users` | POST | Create new user |
| `/api/v1/users/:id` | GET | Get user details |
| `/api/v1/users/:id` | PUT | Update user details |
| `/api/v1/users/:id` | DELETE | Delete user |

### Role Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/roles` | GET | List all roles |
| `/api/v1/roles` | POST | Create new role |
| `/api/v1/roles/:id` | GET | Get role details |
| `/api/v1/roles/:id` | PUT | Update role details |
| `/api/v1/roles/:id` | DELETE | Delete role |

### Department Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/departments` | GET | List all departments |
| `/api/v1/departments` | POST | Create new department |
| `/api/v1/departments/:id` | GET | Get department details |
| `/api/v1/departments/:id` | PUT | Update department details |
| `/api/v1/departments/:id` | DELETE | Delete department |


### Company Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/companies` | GET | List all companies |
| `/api/v1/companies` | POST | Create new company |
| `/api/v1/companies/:id` | GET | Get company details |
| `/api/v1/companies/:id` | PUT | Update company details |
| `/api/v1/companies/:id` | DELETE | Delete company |
| `/api/v1/companies/:id/gst-details` | GET | Get company GST details |
| `/api/v1/companies/:id/statutory-details` | GET | Get company statutory details |

## Subscription Management

### Subscription Plans
- `GET /api/v1/subscriptions/plans`
  - List available subscription plans
  - Response includes plan features and pricing

### Company Subscriptions
- `GET /api/v1/companies/:companyId/subscription`
  - Get current subscription details
  - Includes plan, status, usage limits

- `POST /api/v1/companies/:companyId/subscription`
  - Create new subscription
  - Required fields: plan, startDate
  - Optional: trialEndDate

- `PUT /api/v1/companies/:companyId/subscription`
  - Update subscription plan
  - Change plan, extend duration
  - Upgrade/downgrade features

- `DELETE /api/v1/companies/:companyId/subscription`
  - Cancel subscription
  - Set end date

### Usage Tracking
- `GET /api/v1/companies/:companyId/usage`
  - Get current usage metrics
  - Users, storage, features

- `GET /api/v1/companies/:companyId/billing`
  - Get billing history
  - Invoices, payments

## Product Management

### Product Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/products` | GET | List all products |
| `/api/v1/products` | POST | Create new product |
| `/api/v1/products/:id` | GET | Get product details |
| `/api/v1/products/:id` | PUT | Update product details |
| `/api/v1/products/:id` | DELETE | Delete product |
| `/api/v1/products/:id/variants` | GET | Get product variants |
| `/api/v1/products/:id/inventory` | GET | Get product inventory |
| `/api/v1/products/:id/bom` | GET | Get product BOM |

### Category Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/categories` | GET | List all categories |
| `/api/v1/categories` | POST | Create new category |
| `/api/v1/categories/:id` | GET | Get category details |
| `/api/v1/categories/:id` | PUT | Update category details |
| `/api/v1/categories/:id` | DELETE | Delete category |

### HSN & Tax Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tax-rates` | GET | List all tax rates |
| `/api/v1/tax-rates` | POST | Create new tax rate |
| `/api/v1/tax-rates/:id` | GET | Get tax rate details |
| `/api/v1/tax-rates/:id` | PUT | Update tax rate details |
| `/api/v1/tax-rates/:id` | DELETE | Delete tax rate |
| `/api/v1/tax-rates/hsn/:hsnCode` | GET | Get tax rates by HSN code |

## Inventory Management

### Inventory Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/inventory` | GET | List all inventory |
| `/api/v1/inventory` | POST | Create new inventory entry |
| `/api/v1/inventory/:id` | GET | Get inventory details |
| `/api/v1/inventory/:id` | PUT | Update inventory details |
| `/api/v1/inventory/:id` | DELETE | Delete inventory entry |
| `/api/v1/inventory/location/:locationId` | GET | Get inventory by location |
| `/api/v1/inventory/product/:productId` | GET | Get inventory by product |
| `/api/v1/inventory/transfer` | POST | Transfer inventory between locations |
| `/api/v1/inventory/adjustment` | POST | Adjust inventory quantities |

### Batch Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/batches` | GET | List all batches |
| `/api/v1/batches` | POST | Create new batch |
| `/api/v1/batches/:id` | GET | Get batch details |
| `/api/v1/batches/:id` | PUT | Update batch details |
| `/api/v1/batches/:id` | DELETE | Delete batch |
| `/api/v1/batches/product/:productId` | GET | Get batches by product |
| `/api/v1/batches/quality-check` | POST | Perform quality check on batch |

## Manufacturing Management

### Manufacturing Unit Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/manufacturing-units` | GET | List all manufacturing units |
| `/api/v1/manufacturing-units` | POST | Create new manufacturing unit |
| `/api/v1/manufacturing-units/:id` | GET | Get manufacturing unit details |
| `/api/v1/manufacturing-units/:id` | PUT | Update manufacturing unit details |
| `/api/v1/manufacturing-units/:id` | DELETE | Delete manufacturing unit |

### Production Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/production-orders` | GET | List all production orders |
| `/api/v1/production-orders` | POST | Create new production order |
| `/api/v1/production-orders/:id` | GET | Get production order details |
| `/api/v1/production-orders/:id` | PUT | Update production order details |
| `/api/v1/production-orders/:id` | DELETE | Delete production order |
| `/api/v1/production-orders/:id/start` | POST | Start production order |
| `/api/v1/production-orders/:id/complete` | POST | Complete production order |
| `/api/v1/production-orders/:id/items` | GET | Get production order items |

### Quality Control
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/quality-checks` | GET | List all quality checks |
| `/api/v1/quality-checks` | POST | Create new quality check |
| `/api/v1/quality-checks/:id` | GET | Get quality check details |
| `/api/v1/quality-checks/:id` | PUT | Update quality check details |
| `/api/v1/quality-checks/:id` | DELETE | Delete quality check |
| `/api/v1/quality-checks/batch/:batchId` | GET | Get quality checks by batch |

## Purchase Management

### Vendor Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/vendors` | GET | List all vendors |
| `/api/v1/vendors` | POST | Create new vendor |
| `/api/v1/vendors/:id` | GET | Get vendor details |
| `/api/v1/vendors/:id` | PUT | Update vendor details |
| `/api/v1/vendors/:id` | DELETE | Delete vendor |
| `/api/v1/vendors/:id/gst-details` | GET | Get vendor GST details |

### Purchase Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/purchase-orders` | GET | List all purchase orders |
| `/api/v1/purchase-orders` | POST | Create new purchase order |
| `/api/v1/purchase-orders/:id` | GET | Get purchase order details |
| `/api/v1/purchase-orders/:id` | PUT | Update purchase order details |
| `/api/v1/purchase-orders/:id` | DELETE | Delete purchase order |
| `/api/v1/purchase-orders/:id/approve` | POST | Approve purchase order |
| `/api/v1/purchase-orders/:id/receive` | POST | Receive purchase order items |
| `/api/v1/purchase-orders/:id/items` | GET | Get purchase order items |

## Sales Management

### Customer Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/customers` | GET | List all customers |
| `/api/v1/customers` | POST | Create new customer |
| `/api/v1/customers/:id` | GET | Get customer details |
| `/api/v1/customers/:id` | PUT | Update customer details |
| `/api/v1/customers/:id` | DELETE | Delete customer |
| `/api/v1/customers/:id/gst-details` | GET | Get customer GST details |

### Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/orders` | GET | List all orders |
| `/api/v1/orders` | POST | Create new order |
| `/api/v1/orders/:id` | GET | Get order details |
| `/api/v1/orders/:id` | PUT | Update order details |
| `/api/v1/orders/:id` | DELETE | Delete order |
| `/api/v1/orders/:id/confirm` | POST | Confirm order |
| `/api/v1/orders/:id/ship` | POST | Ship order |
| `/api/v1/orders/:id/deliver` | POST | Mark order as delivered |
| `/api/v1/orders/:id/items` | GET | Get order items |

## Location Management

### Location Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/locations` | GET | List all locations |
| `/api/v1/locations` | POST | Create new location |
| `/api/v1/locations/:id` | GET | Get location details |
| `/api/v1/locations/:id` | PUT | Update location details |
| `/api/v1/locations/:id` | DELETE | Delete location |
| `/api/v1/locations/type/:type` | GET | Get locations by type |
| `/api/v1/locations/inventory/:locationId` | GET | Get inventory at location |

## BOM Management

### BOM Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/boms` | GET | List all BOMs |
| `/api/v1/boms` | POST | Create new BOM |
| `/api/v1/boms/:id` | GET | Get BOM details |
| `/api/v1/boms/:id` | PUT | Update BOM details |
| `/api/v1/boms/:id` | DELETE | Delete BOM |
| `/api/v1/boms/product/:productId` | GET | Get BOM by product |
| `/api/v1/boms/:id/components` | GET | Get BOM components |

## Unit Management

### Unit Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/units` | GET | List all units |
| `/api/v1/units` | POST | Create new unit |
| `/api/v1/units/:id` | GET | Get unit details |
| `/api/v1/units/:id` | PUT | Update unit details |
| `/api/v1/units/:id` | DELETE | Delete unit |
| `/api/v1/units/type/:type` | GET | Get units by type |

## Audit & Reporting

### Audit Logs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/audit-logs` | GET | List all audit logs |
| `/api/v1/audit-logs/:id` | GET | Get audit log details |
| `/api/v1/audit-logs/user/:userId` | GET | Get audit logs by user |
| `/api/v1/audit-logs/entity/:entityType/:entityId` | GET | Get audit logs by entity |

### Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/reports/inventory` | GET | Generate inventory report |
| `/api/v1/reports/sales` | GET | Generate sales report |
| `/api/v1/reports/purchases` | GET | Generate purchases report |
| `/api/v1/reports/production` | GET | Generate production report |
| `/api/v1/reports/gst` | GET | Generate GST report |
| `/api/v1/reports/stock-movement` | GET | Generate stock movement report |

## API Features

### Common Features
- Multi-tenant architecture with company-specific data
- Indian GST compliance with HSN codes and tax rates
- Manufacturing process management
- Quality control and batch tracking
- Inventory management with multiple locations
- Purchase and sales order management
- BOM (Bill of Materials) management
- Unit conversion and management
- Audit logging for compliance
- Comprehensive reporting

### API Requirements
- All endpoints require proper authentication and authorization
- Include tenant and company context in requests
- Handle validation for Indian business rules
- Support proper error handling
- Include pagination for list endpoints
- Support filtering and sorting
- Include proper audit logging

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Format
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": [
    {
      "code": "ERROR_CODE",
      "message": "Error message",
      "field": "field_name"
    }
  ]
}
```

# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Companies](#companies)
- [Products](#products)
- [Inventory](#inventory)
- [Subscription Management](#subscription-management)

## Authentication

### Login
- **Endpoint**: `POST /api/v1/v1/auth`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "companyId": "string"
    },
    "token": "string"
  }
  ```

## Companies

### Get Company Details
- **Endpoint**: `GET /api/v1/v1/companies?companyId=string`
- **Description**: Get company details by ID
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "gstin": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "pincode": "string",
    "phone": "string",
    "email": "string",
    "website": "string",
    "billingAddress": "string",
    "logo": "string",
    "theme": "string",
    "settings": "object",
    "isActive": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Create Company
- **Endpoint**: `POST /api/v1/v1/companies`
- **Description**: Create a new company
- **Request Body**: Same as Get Company Details response
- **Response**: Created company details

### Update Company
- **Endpoint**: `PUT /api/v1/v1/companies?companyId=string`
- **Description**: Update company details
- **Request Body**: Fields to update
- **Response**: Updated company details

### Delete Company
- **Endpoint**: `DELETE /api/v1/v1/companies?companyId=string`
- **Description**: Delete a company
- **Response**: Success message

## Products

### Get Products
- **Endpoint**: `GET /api/v1/v1/products?companyId=string&categoryId=string`
- **Description**: Get all products for a company, optionally filtered by category
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "categoryId": "string",
      "hsnCode": "string",
      "unit": "string",
      "reorderPoint": "number",
      "safetyStock": "number",
      "leadTime": "number",
      "shelfLife": "number",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "category": {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    }
  ]
  ```

### Create Product
- **Endpoint**: `POST /api/v1/v1/products`
- **Description**: Create a new product
- **Request Body**: Same as Get Products response
- **Response**: Created product details

### Update Product
- **Endpoint**: `PUT /api/v1/v1/products?productId=string`
- **Description**: Update product details
- **Request Body**: Fields to update
- **Response**: Updated product details

### Delete Product
- **Endpoint**: `DELETE /api/v1/v1/products?productId=string`
- **Description**: Delete a product
- **Response**: Success message

## Inventory

### Get Inventory
- **Endpoint**: `GET /api/v1/v1/inventory?companyId=string&locationId=string&productId=string`
- **Description**: Get inventory details, optionally filtered by location and product
- **Response**:
  ```json
  [
    {
      "id": "string",
      "companyId": "string",
      "locationId": "string",
      "productId": "string",
      "quantity": "number",
      "status": "string",
      "lastCountedAt": "string",
      "lastMovedAt": "string",
      "costPrice": "number",
      "expiryDate": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "code": "string"
      },
      "location": {
        "id": "string",
        "name": "string",
        "type": "string"
      }
    }
  ]
  ```

### Create/Update Inventory
- **Endpoint**: `POST /api/v1/v1/inventory`
- **Description**: Create or update inventory
- **Request Body**:
  ```json
  {
    "companyId": "string",
    "locationId": "string",
    "productId": "string",
    "quantity": "number",
    "status": "string"
  }
  ```
- **Response**: Created/Updated inventory details

### Delete Inventory
- **Endpoint**: `DELETE /api/v1/v1/inventory?inventoryId=string`
- **Description**: Delete inventory
- **Response**: Success message

## Subscription Management

### Get Subscription Plans
- **Endpoint**: `GET /api/v1/v1/subscriptions/plans`
- **Description**: List available subscription plans
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "currency": "string",
      "billingCycle": "string",
      "features": "array",
      "maxUsers": "number",
      "maxStorage": "number"
    }
  ]
  ```

### Get Company Subscription
- **Endpoint**: `GET /api/v1/v1/companies/:companyId/subscription`
- **Description**: Get current subscription details
- **Response**:
  ```json
  {
    "id": "string",
    "companyId": "string",
    "plan": "string",
    "status": "string",
    "startDate": "string",
    "endDate": "string",
    "trialEndDate": "string",
    "maxUsers": "number",
    "maxStorage": "number",
    "features": "array",
    "paymentMethod": "string",
    "lastPaymentDate": "string",
    "nextPaymentDate": "string",
    "paymentStatus": "string",
    "isAutoRenew": "boolean",
    "isActive": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Create Subscription
- **Endpoint**: `POST /api/v1/v1/companies/:companyId/subscription`
- **Description**: Create a new subscription
- **Request Body**:
  ```json
  {
    "plan": "string",
    "paymentMethod": "string",
    "isAutoRenew": "boolean"
  }
  ```
- **Response**: Created subscription details

### Update Subscription
- **Endpoint**: `PUT /api/v1/v1/companies/:companyId/subscription`
- **Description**: Update subscription plan
- **Request Body**: Fields to update
- **Response**: Updated subscription details

### Cancel Subscription
- **Endpoint**: `DELETE /api/v1/v1/companies/:companyId/subscription`
- **Description**: Cancel subscription
- **Response**: Success message

### Track Usage
- **Endpoint**: `POST /api/v1/v1/companies/:companyId/subscription/usage`
- **Description**: Track subscription usage
- **Request Body**:
  ```json
  {
    "metric": "string",
    "value": "number"
  }
  ```
- **Response**: Updated usage details

### Get Billing History
- **Endpoint**: `GET /api/v1/v1/companies/:companyId/subscription/payments`
- **Description**: Get subscription payment history
- **Response**:
  ```json
  [
    {
      "id": "string",
      "subscriptionId": "string",
      "amount": "number",
      "currency": "string",
      "paymentMethod": "string",
      "paymentStatus": "string",
      "paymentDate": "string",
      "invoiceNumber": "string",
      "transactionId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ``` 