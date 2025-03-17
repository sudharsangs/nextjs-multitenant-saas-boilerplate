# Pulse - Enterprise Resource Planning System

Pulse is a modern ERP system built with Next.js, Prisma, and Tailwind CSS. It provides comprehensive business management features including inventory management, order processing, customer relationship management, and supplier management.

## Features

- 🔐 Secure Authentication with NextAuth.js
- 📦 Inventory Management
- 📊 Order Matrix
- 👥 Customer Management
- 🏢 Supplier Management
- 📈 Reports and Analytics
- 🎨 Modern UI with Tailwind CSS and Shadcn UI
- 🔄 Real-time Updates
- 📱 Responsive Design

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pulse.git
   cd pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database connection string and other required variables.

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pulse"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Project Structure

```
app/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/           # Utility functions and shared logic
│   └── types/         # TypeScript type definitions
├── .env               # Environment variables
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to the database
- `npm run db:studio` - Open Prisma Studio

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
