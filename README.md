# Multi-Tenant SaaS Boilerplate

A production-ready, full-stack multi-tenant SaaS boilerplate built with Next.js 15, TypeScript, PostgreSQL, and Drizzle ORM.

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
- **Notifications System** - Multi-channel notifications
- **API Key Management** - Secure API access
- **Integrations Framework** - Connect to external services
- **Email Verification** - User email verification
- **Dark Mode Ready** - Theme customization support

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

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
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/saas_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

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

- **companies** - Tenant organizations
- **users** - User accounts with role-based access
- **subscriptions** - Subscription plans and status
- **payments** - Payment history
- **notifications** - User notifications
- **audit_logs** - Activity tracking
- **api_keys** - API authentication
- **integrations** - External service connections

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
- `PUT /api/v1/subscriptions/:id` - Update subscription

### Audit Logs
- `GET /api/v1/audit-logs` - List audit logs
- `GET /api/v1/audit-logs/:id` - Get log details

## Customization

### Adding New Features

1. **Database Schema**: Add tables in `db/schema.ts`
2. **API Routes**: Create routes in `app/api/v1/`
3. **Pages**: Add pages in `app/(protected)/`
4. **Components**: Create components in `components/`
5. **Navigation**: Update sidebar in `components/sidebar/sidebar-config.tsx`

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

- Keep `JWT_SECRET` secure and never commit to version control
- Use HTTPS in production
- Enable CORS properly for your domain
- Implement rate limiting on API routes
- Regular security audits
- Keep dependencies updated

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this boilerplate for your projects.

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Email service integration
- [ ] Stripe payment integration
- [ ] Webhook support
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] File upload system
- [ ] Real-time notifications
- [ ] Team collaboration features

---

Built with ❤️ using Next.js and TypeScript
