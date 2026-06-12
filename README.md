# Multi-Tenant SaaS Boilerplate

A production-ready, full-stack multi-tenant SaaS boilerplate built with Next.js 15, TypeScript, PostgreSQL, and Drizzle ORM. Perfect for building B2B SaaS applications with complete tenant isolation, subscription management, and role-based access control.

## Preview

![App Screenshot](public/screenshot.png)

**Created by**: [Sudharsan GS](https://sudharsangs.in) 

## Features

### Core Multi-Tenancy
- **Company/Tenant Management** - Complete isolation between tenants
- **User Management** - Role-based access control (ADMIN, MANAGER, STAFF, VIEWER)
- **Subscription Management** - Multiple subscription tiers (FREE, BASIC, PRO, ENTERPRISE)
- **Payment Processing** - Built-in payment tracking and management

### Security & Compliance
- **JWT Authentication** - Secure token-based authentication
- **Two-Factor Authentication** - Optional 2FA support
- **Audit Logs** - Complete activity tracking per tenant
- **Role-Based Permissions** - Granular permission system

### Developer Experience
- **Type-Safe** - Full TypeScript support
- **Database ORM** - Drizzle ORM with PostgreSQL
- **API Routes** - RESTful API structure
- **Docker Support** - Containerized development and deployment

### Additional Features
- **Notifications System** - Multi-type notifications (SYSTEM, ALERT, TASK, UPDATE, BILLING)
- **API Key Management** - Secure API access with key/secret pairs
- **Integrations Framework** - Connect to external services (Payment Gateways, Email, SMS, ERP, CRM)
- **Integration Logs** - Track all integration requests and responses
- **Email Verification** - User email verification workflow
- **Dark Mode Ready** - Theme customization support per tenant
- **Report Generation** - Built-in reporting system
- **Excel Export** - Export data to Excel with ExcelJS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL 15+ with Drizzle ORM 0.41
- **Authentication**: JWT (jose library) with HTTP-only cookies
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm/yarn/pnpm

### Environment Setup

1. Clone the repository
2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:

```env
# Node Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/factostack
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=factostack

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# API Keys
# Dedicated secret to hash API key secrets (pepper for HMAC).
# Recommended to be different from JWT_SECRET.
API_KEY_SECRET=your-api-key-secret-pepper

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Database Setup

1. Run migrations:

```bash
npm run db:migrate
```

2. (Optional) Seed the database:

```bash
npm run db:seed
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Docker Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker Compose

Start the application and database:

```bash
docker-compose up -d
```

This will start:
- Next.js application on port 3000
- PostgreSQL database on port 5432

Stop all containers:

```bash
docker-compose down
```

### Database Migrations in Docker

```bash
docker-compose exec app npm run db:migrate
```

### Useful Docker Commands

View running containers:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f app
```

Access application container:
```bash
docker-compose exec app sh
```

Access PostgreSQL:
```bash
docker-compose exec db psql -U postgres -d saas_db
```

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── v1/             # API version 1
│   ├── auth/               # Authentication pages
│   ├── (protected)/        # Protected routes
│   └── layout.tsx          # Root layout
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── sidebar/            # Navigation components
│   └── shared/             # Shared components
├── db/                      # Database
│   └── schema.ts           # Drizzle schema
├── lib/                     # Utility functions
│   ├── auth.ts             # Authentication utilities
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
└── middleware.ts           # Next.js middleware
```

## Database Schema

The boilerplate includes the following core tables:

- **companies** - Tenant organizations with settings, theme, and configuration
- **users** - User accounts with role-based access (ADMIN, MANAGER, STAFF, VIEWER)
- **subscriptions** - Subscription plans (FREE, BASIC, PRO, ENTERPRISE) with billing durations
- **payments** - Payment history with transaction tracking
- **notifications** - User notifications (SYSTEM, ALERT, TASK, UPDATE, BILLING)
- **auditLogs** - Activity tracking (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT)
- **apiKeys** - API authentication with key/secret pairs and permissions
- **integrations** - External service connections (PAYMENT_GATEWAY, EMAIL, SMS, ERP, CRM, CUSTOM)
- **integrationLogs** - Integration request/response logs

### Subscription Features
- **Billing Durations**: Monthly, Quarterly, Half-Yearly, Annual
- **Trial Period**: Configurable trial days per subscription
- **Auto-Renewal**: Automatic subscription renewal support
- **Coupon Codes**: Promotional code support
- **Feature Flags**: Per-plan feature access control

## API Routes

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/v1/users` - List users (admin only)
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Companies
- `GET /api/v1/companies` - List companies (super admin)
- `GET /api/v1/companies/:id` - Get company details
- `PUT /api/v1/companies/:id` - Update company

### Subscriptions
- `GET /api/v1/subscriptions` - Get company subscription
- `POST /api/v1/subscriptions` - Create subscription
- `PUT /api/v1/subscriptions` - Update subscription

### Dashboard
- `GET /api/v1/dashboard/overview` - Dashboard statistics
- `GET /api/v1/dashboard/activities` - Recent activities

### Audit Logs
- `GET /api/v1/audit-logs` - List audit logs (with pagination)
- `GET /api/v1/audit-logs/:id` - Get log details
- `GET /api/v1/audit-logs/entity/:entityType/:entityId` - Entity-specific logs
- `GET /api/v1/audit-logs/user/:userId` - User activity logs

### API Keys
- `GET /api/v1/api-keys` - List API keys
- `POST /api/v1/api-keys` - Create an API key (returns token once)
- `PATCH /api/v1/api-keys/:id` - Update name/permissions/expiresAt
- `DELETE /api/v1/api-keys/:id` - Revoke API key (soft disable)

### Reports
- `GET /api/v1/reports/dashboard` - Dashboard report

## Multi-Tenancy Architecture

This boilerplate implements row-level multi-tenancy with complete data isolation:

### How It Works

1. **Company Isolation**: Every request validates the authenticated user's `companyId`
2. **Middleware Protection**: JWT verification on all protected routes
3. **Database Queries**: All queries automatically filtered by `companyId`
4. **Subscription Enforcement**: Feature access controlled by subscription tier
5. **Role-Based Access**: Permissions validated at the route level

### Protected Routes Pattern

```typescript
// Middleware automatically adds user context to request headers
const { userId, companyId } = getAuthUser(request);

// Every API route validates company access
if (requestedCompanyId !== companyId) {
  return Response.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## Customization

### Adding New Features

1. **Database Schema**: Add tables in `db/schema.ts`
2. **API Routes**: Create routes in `app/api/v1/`
3. **Pages**: Add pages in `app/(protected)/`
4. **Components**: Create components in `components/`
5. **Navigation**: Update sidebar in `components/sidebar/sidebar-config.tsx`
6. **Types**: Define enums and types in `lib/types.ts`

### Subscription Tiers

Modify subscription tiers in `lib/types.ts`:

```typescript
export enum SubscriptionTierEnum {
    FREE = "FREE",
    BASIC = "BASIC",
    STANDARD = "PRO",
    PREMIUM = "ENTERPRISE"
}
```

### User Roles

Customize roles in `lib/types.ts`:

```typescript
export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    VIEWER = 'VIEWER',
}
```

## Deployment

### Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Docker Production

Build production image:

```bash
docker build -t saas-boilerplate .
docker run -p 3000:3000 saas-boilerplate
```

## Security Best Practices

- Keep `JWT_SECRET` secure and never commit to version control (use environment variables)
- Use HTTPS in production (required for HTTP-only cookies)
- Enable CORS properly for your domain
- Implement rate limiting on API routes (recommended: use middleware)
- Validate all inputs with Zod schemas
- Use HTTP-only cookies for token storage (protects against XSS)
- Implement Content Security Policy (CSP) headers
- Regular security audits and dependency updates
- Enable 2FA for sensitive accounts
- Audit logs for compliance and security monitoring
- API key rotation and expiration policies

### Authentication Security

- **JWT Tokens**: 7-day expiry with refresh token mechanism
- **Password Hashing**: bcryptjs with secure salt rounds
- **Token Storage**: HTTP-only, secure cookies (not localStorage)
- **Session Management**: Automatic token refresh on expiry
- **Middleware Protection**: Route-level authentication checks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this boilerplate for your projects.

## Support

For issues and questions, please open an issue on GitHub.

### Need Professional Help?

If you need help building your SaaS application, custom features, or want to accelerate your product development:

- Visit [FactoStack](https://factostack.com) for a Multi-tenant ERP built for manufacturers
- We specialize in rapid MVP development (4-8 weeks)
- AI-powered features and automation
- Full-stack web and mobile applications
- Codebase rescue and refactoring services

**Contact**: [FactoStack](https://factostack.com) | **Developer**: [Sudharsan GS](https://sudharsangs.in)

## Development Tips

### Database Management

```bash
# Push schema changes to database (for development)
npm run db:push

# Generate and run migrations (for production)
npm run db:migrate

# Open Drizzle Studio (visual database browser)
npm run db:studio
```

### API Testing

Use the built-in API client for consistent requests:

```typescript
import { api } from '@/lib/api-client';

// GET request
const users = await api.get('/api/v1/users');

// POST request
const newUser = await api.post('/api/v1/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'STAFF'
});
```

### Adding a New Page

1. Create page in `app/(protected)/your-feature/page.tsx`
2. Add route to sidebar config in `components/sidebar/sidebar-config.tsx`
3. Create API endpoint in `app/api/v1/your-feature/route.ts`
4. Update types in `lib/types.ts` if needed

## Performance Optimization

- **Database Indexing**: Add indexes on frequently queried columns (companyId, userId)
- **Query Optimization**: Use Drizzle's select() to fetch only needed columns
- **Pagination**: Implement limit/offset for large datasets
- **Caching**: Consider Redis for session and frequently accessed data
- **Image Optimization**: Use Next.js Image component for automatic optimization
- **API Response**: Use streaming responses for large datasets

## Roadmap

- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Email service integration (SendGrid, Resend)
- [ ] Stripe/Razorpay payment integration
- [ ] Webhook support for external events
- [ ] Enhanced admin dashboard with analytics
- [ ] Multi-language support (i18n)
- [ ] File upload system with S3/CloudStorage
- [ ] Real-time notifications (WebSocket/Pusher)
- [ ] Team collaboration features
- [ ] Advanced reporting and analytics
- [ ] Export data to PDF
- [ ] Bulk operations (import/export via Excel)
- [ ] Mobile responsive improvements

## FAQ

**Q: How do I add a new subscription tier?**
A: Add the tier to `SubscriptionTierEnum` in [lib/types.ts](lib/types.ts) and update the subscription plans endpoint.

**Q: How do I customize the authentication flow?**
A: Modify the JWT generation in [lib/jwt.ts](lib/jwt.ts) and the auth routes in [app/api/v1/auth/](app/api/v1/auth/).

**Q: Can I use MySQL instead of PostgreSQL?**
A: Yes, but you'll need to update the Drizzle configuration and adjust any PostgreSQL-specific queries.

**Q: How do I add permissions for a new feature?**
A: Define permissions in user schema, then check them in your API routes using the user's permissions field.

**Q: Is there a demo available?**
A: Yes, run `docker-compose up` and visit `http://localhost:3000` to see the boilerplate in action.

---

Built with ❤️ using Next.js 15, React 19, TypeScript, and Drizzle ORM
