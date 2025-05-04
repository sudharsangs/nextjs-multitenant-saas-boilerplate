This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Setup

This application has been containerized for easy deployment and consistent development environments.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your specific configuration values.

### Running with Docker Compose

To start the application and its dependencies:

```bash
docker-compose up -d
```

This will start both the Next.js application and PostgreSQL database.

To stop all containers:

```bash
docker-compose down
```

### Building for Production

To build and run a production-optimized version:

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Database Migrations

To run database migrations inside the Docker container:

```bash
docker-compose exec app npm run db:migrate
```

### Useful Docker Commands

- View running containers:
  ```bash
  docker-compose ps
  ```

- View logs:
  ```bash
  docker-compose logs -f app
  ```

- Access the application container shell:
  ```bash
  docker-compose exec app sh
  ```

- Access the PostgreSQL database:
  ```bash
  docker-compose exec db psql -U postgres -d factostack
  ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
