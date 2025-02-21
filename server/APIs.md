# API Documentation

## Authentication & Authorization
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/reset-password` - Request password reset
- `PUT /api/v1/auth/reset-password` - Reset password with token

## User Management
### Users
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/{id}` - Get user details
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user (soft delete)
- `GET /api/v1/users/{id}/roles` - Get user's roles
- `PUT /api/v1/users/{id}/roles` - Update user's roles

### Roles
- `GET /api/v1/roles` - List all roles
- `GET /api/v1/roles/{id}` - Get role details
- `POST /api/v1/roles` - Create new role
- `PUT /api/v1/roles/{id}` - Update role
- `DELETE /api/v1/roles/{id}` - Delete role
- `GET /api/v1/roles/{id}/permissions` - Get role permissions
- `PUT /api/v1/roles/{id}/permissions` - Update role permissions

### Permissions
- `GET /api/v1/permissions` - List all permissions
- `GET /api/v1/permissions/{id}` - Get permission details
- `POST /api/v1/permissions` - Create new permission
- `PUT /api/v1/permissions/{id}` - Update permission
- `DELETE /api/v1/permissions/{id}` - Delete permission

## Customer Management
### Customers
- `GET /api/v1/customers` - List all customers
- `GET /api/v1/customers/{id}` - Get customer details
- `POST /api/v1/customers` - Create new customer
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer (soft delete)
- `GET /api/v1/customers/{id}/orders` - Get customer's orders
- `GET /api/v1/customers/{id}/addresses` - Get customer's addresses
- `GET /api/v1/customers/{id}/payment-methods` - Get customer's payment methods

### Addresses
- `GET /api/v1/addresses` - List all addresses
- `GET /api/v1/addresses/{id}` - Get address details
- `POST /api/v1/addresses` - Create new address
- `PUT /api/v1/addresses/{id}` - Update address
- `DELETE /api/v1/addresses/{id}` - Delete address
- `PUT /api/v1/addresses/{id}/make-default` - Set address as default

### Payment Methods
- `GET /api/v1/payment-methods` - List all payment methods
- `GET /api/v1/payment-methods/{id}` - Get payment method details
- `POST /api/v1/payment-methods` - Create new payment method
- `PUT /api/v1/payment-methods/{id}` - Update payment method
- `DELETE /api/v1/payment-methods/{id}` - Delete payment method
- `PUT /api/v1/payment-methods/{id}/make-default` - Set payment method as default

## Order Management
### Orders
- `GET /api/v1/orders` - List all orders
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/{id}` - Update order
- `PUT /api/v1/orders/{id}/status` - Update order status
- `GET /api/v1/orders/{id}/items` - Get order items
- `GET /api/v1/orders/{id}/invoices` - Get order invoices
- `GET /api/v1/orders/{id}/shipments` - Get order shipments

### Order Items
- `POST /api/v1/orders/{orderId}/items` - Add item to order
- `PUT /api/v1/orders/{orderId}/items/{id}` - Update order item
- `DELETE /api/v1/orders/{orderId}/items/{id}` - Remove item from order

### Invoices
- `GET /api/v1/invoices` - List all invoices
- `GET /api/v1/invoices/{id}` - Get invoice details
- `POST /api/v1/invoices` - Create new invoice
- `PUT /api/v1/invoices/{id}` - Update invoice
- `PUT /api/v1/invoices/{id}/status` - Update invoice status

## Product Management
### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product (soft delete)
- `GET /api/v1/products/{id}/inventory` - Get product inventory
- `GET /api/v1/products/categories/{categoryId}` - List products by category

### Product Categories
- `GET /api/v1/product-categories` - List all categories
- `GET /api/v1/product-categories/{id}` - Get category details
- `POST /api/v1/product-categories` - Create new category
- `PUT /api/v1/product-categories/{id}` - Update category
- `DELETE /api/v1/product-categories/{id}` - Delete category

### Inventory
- `GET /api/v1/inventory` - List all inventory items
- `GET /api/v1/inventory/{id}` - Get inventory item details
- `POST /api/v1/inventory` - Create inventory record
- `PUT /api/v1/inventory/{id}` - Update inventory
- `GET /api/v1/inventory/warehouse/{warehouseId}` - List inventory by warehouse

## Warehouse Management
### Warehouses
- `GET /api/v1/warehouses` - List all warehouses
- `GET /api/v1/warehouses/{id}` - Get warehouse details
- `POST /api/v1/warehouses` - Create new warehouse
- `PUT /api/v1/warehouses/{id}` - Update warehouse
- `DELETE /api/v1/warehouses/{id}` - Delete warehouse (soft delete)
- `GET /api/v1/warehouses/{id}/inventory` - Get warehouse inventory

## Supplier Management
### Suppliers
- `GET /api/v1/suppliers` - List all suppliers
- `GET /api/v1/suppliers/{id}` - Get supplier details
- `POST /api/v1/suppliers` - Create new supplier
- `PUT /api/v1/suppliers/{id}` - Update supplier
- `DELETE /api/v1/suppliers/{id}` - Delete supplier (soft delete)
- `GET /api/v1/suppliers/{id}/purchase-orders` - Get supplier purchase orders

### Purchase Orders
- `GET /api/v1/purchase-orders` - List all purchase orders
- `GET /api/v1/purchase-orders/{id}` - Get purchase order details
- `POST /api/v1/purchase-orders` - Create new purchase order
- `PUT /api/v1/purchase-orders/{id}` - Update purchase order
- `PUT /api/v1/purchase-orders/{id}/status` - Update purchase order status
- `GET /api/v1/purchase-orders/{id}/items` - Get purchase order items

## Shipping Management
### Shipments
- `GET /api/v1/shipments` - List all shipments
- `GET /api/v1/shipments/{id}` - Get shipment details
- `POST /api/v1/shipments` - Create new shipment
- `PUT /api/v1/shipments/{id}` - Update shipment
- `PUT /api/v1/shipments/{id}/status` - Update shipment status

### Returns
- `GET /api/v1/returns` - List all returns
- `GET /api/v1/returns/{id}` - Get return details
- `POST /api/v1/returns` - Create new return
- `PUT /api/v1/returns/{id}` - Update return
- `PUT /api/v1/returns/{id}/status` - Update return status

## Payment Management
### Transactions
- `GET /api/v1/transactions` - List all transactions
- `GET /api/v1/transactions/{id}` - Get transaction details
- `POST /api/v1/transactions` - Create new transaction
- `PUT /api/v1/transactions/{id}/status` - Update transaction status

## Audit Logs
- `GET /api/v1/audit-logs` - List all audit logs
- `GET /api/v1/audit-logs/{id}` - Get audit log details
- `GET /api/v1/audit-logs/user/{userId}` - Get audit logs by user
- `GET /api/v1/audit-logs/entity/{entityType}/{entityId}` - Get audit logs by entity

## Common Query Parameters
Most GET endpoints support the following query parameters:
- `page` - Page number for pagination
- `limit` - Number of items per page
- `sort` - Field to sort by
- `order` - Sort order (asc/desc)
- `search` - Search term
- `filters` - Additional filters specific to the endpoint
- `include` - Related data to include in the response

## API Versioning
All endpoints are prefixed with `/api/v1/` to support future versioning.

## Response Format
All endpoints follow a standard response format:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  },
  "error": null
}
```