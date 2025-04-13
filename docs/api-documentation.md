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
| `/api/auth/login` | POST | User login with email and password |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/refresh-token` | POST | Refresh authentication token |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/me` | GET | Get current user details |

### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | List all users |
| `/api/users` | POST | Create new user |
| `/api/users/:id` | GET | Get user details |
| `/api/users/:id` | PUT | Update user details |
| `/api/users/:id` | DELETE | Delete user |

### Role Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roles` | GET | List all roles |
| `/api/roles` | POST | Create new role |
| `/api/roles/:id` | GET | Get role details |
| `/api/roles/:id` | PUT | Update role details |
| `/api/roles/:id` | DELETE | Delete role |

### Department Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/departments` | GET | List all departments |
| `/api/departments` | POST | Create new department |
| `/api/departments/:id` | GET | Get department details |
| `/api/departments/:id` | PUT | Update department details |
| `/api/departments/:id` | DELETE | Delete department |


### Company Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/companies` | GET | List all companies |
| `/api/companies` | POST | Create new company |
| `/api/companies/:id` | GET | Get company details |
| `/api/companies/:id` | PUT | Update company details |
| `/api/companies/:id` | DELETE | Delete company |
| `/api/companies/:id/gst-details` | GET | Get company GST details |
| `/api/companies/:id/statutory-details` | GET | Get company statutory details |

## Subscription Management

### Subscription Plans
- `GET /api/subscriptions/plans`
  - List available subscription plans
  - Response includes plan features and pricing

### Company Subscriptions
- `GET /api/companies/:companyId/subscription`
  - Get current subscription details
  - Includes plan, status, usage limits

- `POST /api/companies/:companyId/subscription`
  - Create new subscription
  - Required fields: plan, startDate
  - Optional: trialEndDate

- `PUT /api/companies/:companyId/subscription`
  - Update subscription plan
  - Change plan, extend duration
  - Upgrade/downgrade features

- `DELETE /api/companies/:companyId/subscription`
  - Cancel subscription
  - Set end date

### Usage Tracking
- `GET /api/companies/:companyId/usage`
  - Get current usage metrics
  - Users, storage, features

- `GET /api/companies/:companyId/billing`
  - Get billing history
  - Invoices, payments

## Product Management

### Product Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products |
| `/api/products` | POST | Create new product |
| `/api/products/:id` | GET | Get product details |
| `/api/products/:id` | PUT | Update product details |
| `/api/products/:id` | DELETE | Delete product |
| `/api/products/:id/variants` | GET | Get product variants |
| `/api/products/:id/inventory` | GET | Get product inventory |
| `/api/products/:id/bom` | GET | Get product BOM |

### Category Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | List all categories |
| `/api/categories` | POST | Create new category |
| `/api/categories/:id` | GET | Get category details |
| `/api/categories/:id` | PUT | Update category details |
| `/api/categories/:id` | DELETE | Delete category |

### HSN & Tax Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tax-rates` | GET | List all tax rates |
| `/api/tax-rates` | POST | Create new tax rate |
| `/api/tax-rates/:id` | GET | Get tax rate details |
| `/api/tax-rates/:id` | PUT | Update tax rate details |
| `/api/tax-rates/:id` | DELETE | Delete tax rate |
| `/api/tax-rates/hsn/:hsnCode` | GET | Get tax rates by HSN code |

## Inventory Management

### Inventory Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/inventory` | GET | List all inventory |
| `/api/inventory` | POST | Create new inventory entry |
| `/api/inventory/:id` | GET | Get inventory details |
| `/api/inventory/:id` | PUT | Update inventory details |
| `/api/inventory/:id` | DELETE | Delete inventory entry |
| `/api/inventory/location/:locationId` | GET | Get inventory by location |
| `/api/inventory/product/:productId` | GET | Get inventory by product |
| `/api/inventory/transfer` | POST | Transfer inventory between locations |
| `/api/inventory/adjustment` | POST | Adjust inventory quantities |

### Batch Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/batches` | GET | List all batches |
| `/api/batches` | POST | Create new batch |
| `/api/batches/:id` | GET | Get batch details |
| `/api/batches/:id` | PUT | Update batch details |
| `/api/batches/:id` | DELETE | Delete batch |
| `/api/batches/product/:productId` | GET | Get batches by product |
| `/api/batches/quality-check` | POST | Perform quality check on batch |

## Manufacturing Management

### Manufacturing Unit Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/manufacturing-units` | GET | List all manufacturing units |
| `/api/manufacturing-units` | POST | Create new manufacturing unit |
| `/api/manufacturing-units/:id` | GET | Get manufacturing unit details |
| `/api/manufacturing-units/:id` | PUT | Update manufacturing unit details |
| `/api/manufacturing-units/:id` | DELETE | Delete manufacturing unit |

### Production Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/production-orders` | GET | List all production orders |
| `/api/production-orders` | POST | Create new production order |
| `/api/production-orders/:id` | GET | Get production order details |
| `/api/production-orders/:id` | PUT | Update production order details |
| `/api/production-orders/:id` | DELETE | Delete production order |
| `/api/production-orders/:id/start` | POST | Start production order |
| `/api/production-orders/:id/complete` | POST | Complete production order |
| `/api/production-orders/:id/items` | GET | Get production order items |

### Quality Control
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quality-checks` | GET | List all quality checks |
| `/api/quality-checks` | POST | Create new quality check |
| `/api/quality-checks/:id` | GET | Get quality check details |
| `/api/quality-checks/:id` | PUT | Update quality check details |
| `/api/quality-checks/:id` | DELETE | Delete quality check |
| `/api/quality-checks/batch/:batchId` | GET | Get quality checks by batch |

## Purchase Management

### Vendor Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vendors` | GET | List all vendors |
| `/api/vendors` | POST | Create new vendor |
| `/api/vendors/:id` | GET | Get vendor details |
| `/api/vendors/:id` | PUT | Update vendor details |
| `/api/vendors/:id` | DELETE | Delete vendor |
| `/api/vendors/:id/gst-details` | GET | Get vendor GST details |

### Purchase Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/purchase-orders` | GET | List all purchase orders |
| `/api/purchase-orders` | POST | Create new purchase order |
| `/api/purchase-orders/:id` | GET | Get purchase order details |
| `/api/purchase-orders/:id` | PUT | Update purchase order details |
| `/api/purchase-orders/:id` | DELETE | Delete purchase order |
| `/api/purchase-orders/:id/approve` | POST | Approve purchase order |
| `/api/purchase-orders/:id/receive` | POST | Receive purchase order items |
| `/api/purchase-orders/:id/items` | GET | Get purchase order items |

## Sales Management

### Customer Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/customers` | GET | List all customers |
| `/api/customers` | POST | Create new customer |
| `/api/customers/:id` | GET | Get customer details |
| `/api/customers/:id` | PUT | Update customer details |
| `/api/customers/:id` | DELETE | Delete customer |
| `/api/customers/:id/gst-details` | GET | Get customer GST details |

### Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | List all orders |
| `/api/orders` | POST | Create new order |
| `/api/orders/:id` | GET | Get order details |
| `/api/orders/:id` | PUT | Update order details |
| `/api/orders/:id` | DELETE | Delete order |
| `/api/orders/:id/confirm` | POST | Confirm order |
| `/api/orders/:id/ship` | POST | Ship order |
| `/api/orders/:id/deliver` | POST | Mark order as delivered |
| `/api/orders/:id/items` | GET | Get order items |

## Location Management

### Location Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/locations` | GET | List all locations |
| `/api/locations` | POST | Create new location |
| `/api/locations/:id` | GET | Get location details |
| `/api/locations/:id` | PUT | Update location details |
| `/api/locations/:id` | DELETE | Delete location |
| `/api/locations/type/:type` | GET | Get locations by type |
| `/api/locations/inventory/:locationId` | GET | Get inventory at location |

## BOM Management

### BOM Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/boms` | GET | List all BOMs |
| `/api/boms` | POST | Create new BOM |
| `/api/boms/:id` | GET | Get BOM details |
| `/api/boms/:id` | PUT | Update BOM details |
| `/api/boms/:id` | DELETE | Delete BOM |
| `/api/boms/product/:productId` | GET | Get BOM by product |
| `/api/boms/:id/components` | GET | Get BOM components |

## Unit Management

### Unit Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/units` | GET | List all units |
| `/api/units` | POST | Create new unit |
| `/api/units/:id` | GET | Get unit details |
| `/api/units/:id` | PUT | Update unit details |
| `/api/units/:id` | DELETE | Delete unit |
| `/api/units/type/:type` | GET | Get units by type |

## Audit & Reporting

### Audit Logs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/audit-logs` | GET | List all audit logs |
| `/api/audit-logs/:id` | GET | Get audit log details |
| `/api/audit-logs/user/:userId` | GET | Get audit logs by user |
| `/api/audit-logs/entity/:entityType/:entityId` | GET | Get audit logs by entity |

### Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/inventory` | GET | Generate inventory report |
| `/api/reports/sales` | GET | Generate sales report |
| `/api/reports/purchases` | GET | Generate purchases report |
| `/api/reports/production` | GET | Generate production report |
| `/api/reports/gst` | GET | Generate GST report |
| `/api/reports/stock-movement` | GET | Generate stock movement report |

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
- **Endpoint**: `POST /api/v1/auth`
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
- **Endpoint**: `GET /api/v1/companies?companyId=string`
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
- **Endpoint**: `POST /api/v1/companies`
- **Description**: Create a new company
- **Request Body**: Same as Get Company Details response
- **Response**: Created company details

### Update Company
- **Endpoint**: `PUT /api/v1/companies?companyId=string`
- **Description**: Update company details
- **Request Body**: Fields to update
- **Response**: Updated company details

### Delete Company
- **Endpoint**: `DELETE /api/v1/companies?companyId=string`
- **Description**: Delete a company
- **Response**: Success message

## Products

### Get Products
- **Endpoint**: `GET /api/v1/products?companyId=string&categoryId=string`
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
- **Endpoint**: `POST /api/v1/products`
- **Description**: Create a new product
- **Request Body**: Same as Get Products response
- **Response**: Created product details

### Update Product
- **Endpoint**: `PUT /api/v1/products?productId=string`
- **Description**: Update product details
- **Request Body**: Fields to update
- **Response**: Updated product details

### Delete Product
- **Endpoint**: `DELETE /api/v1/products?productId=string`
- **Description**: Delete a product
- **Response**: Success message

## Inventory

### Get Inventory
- **Endpoint**: `GET /api/v1/inventory?companyId=string&locationId=string&productId=string`
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
- **Endpoint**: `POST /api/v1/inventory`
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
- **Endpoint**: `DELETE /api/v1/inventory?inventoryId=string`
- **Description**: Delete inventory
- **Response**: Success message

## Subscription Management

### Get Subscription Plans
- **Endpoint**: `GET /api/v1/subscriptions/plans`
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
- **Endpoint**: `GET /api/v1/companies/:companyId/subscription`
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
- **Endpoint**: `POST /api/v1/companies/:companyId/subscription`
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
- **Endpoint**: `PUT /api/v1/companies/:companyId/subscription`
- **Description**: Update subscription plan
- **Request Body**: Fields to update
- **Response**: Updated subscription details

### Cancel Subscription
- **Endpoint**: `DELETE /api/v1/companies/:companyId/subscription`
- **Description**: Cancel subscription
- **Response**: Success message

### Track Usage
- **Endpoint**: `POST /api/v1/companies/:companyId/subscription/usage`
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
- **Endpoint**: `GET /api/v1/companies/:companyId/subscription/payments`
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