# TS Backend Production Setup

A production-ready TypeScript backend boilerplate with Docker, Nginx, and comprehensive tooling.
Whenever you need to set up a backend with TypeScript following standard industry practices, you can use this repository as a base or reference.

It’s structured in a clean, scalable, and production-ready way — including proper folder organization, TypeScript configuration, and best practices for maintainability and performance.

## 🚀 Features

- **TypeScript** - Type-safe backend development
- **Express.js** - Fast and minimal web framework
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and load balancing
- **Database Migrations** - Schema version control
- **Code Quality Tools** - ESLint, Prettier, Husky
- **Hot Reload** - Development with Nodemon

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [PostgreSQL](https://www.postgresql.org/) or your preferred database

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HardCoder404/TS-Backend-Production-Setup.git
cd TS-Backend-Production-Setup
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files based on your deployment environment:

#### For Development:
Create a `.env.development` file in the root directory:

```env
# General
ENV=development #production
PORT=3000
SERVER_URL=http://localhost:3000

# Database
DATABASE_URL=""

# Migration
MIGRATE_MONGO_URI="" # Same as database url
MIGRATE_AUTOSYNC="true" # false
```

#### For Production:
Create a `.env.production` file in the root directory:

```env
# General
ENV=development #production
PORT=3000
SERVER_URL=http://localhost:3000

# Database
DATABASE_URL=""

# Migration
MIGRATE_MONGO_URI="" # Same as database url
MIGRATE_AUTOSYNC="true" # false
```

> ⚠️ **Important:** Never commit `.env` files to version control. They are already in `.gitignore`.

## 🏃 Running the Application

### Development Mode
Start the development server with hot reload:

```bash
npm run dev
```

### Production Mode
Build and run the production server:

```bash
npm run build
npm start
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Run production build |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Fix linting errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted correctly |
| `npm run migrate` | Run database migrations |
| `npm run migrate:rollback` | Rollback last migration |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run type-check` | Check TypeScript types |

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker-compose build
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Stop Containers

```bash
docker-compose down
```

## 📁 Project Structure

```
.
├── .husky/              # Git hooks configuration
├── docker/              # Docker configuration files
├── logs/                # Application logs
├── migrations/          # Database migrations
├── nginx/               # Nginx configuration
├── public/              # Static files
├── script/              # Utility scripts
├── src/                 # Source code
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── test/                # Test files
├── .dockerignore        # Docker ignore file
├── .env.example         # Environment variables example
├── .gitignore           # Git ignore file
├── .prettierrc          # Prettier configuration
├── commitlint.config.js # Commit message linting
├── ecosystem.config.js  # PM2 configuration
├── eslint.config.mjs    # ESLint configuration
├── nodemon.json         # Nodemon configuration
├── package.json         # Dependencies and scripts
├── package-lock.json    # Lock file
├── README.md            # This file
└── tsconfig.json        # TypeScript configuration
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🔍 Code Quality

### Linting
This project uses ESLint for code linting:

```bash
npm run lint
```

### Formatting
Code formatting is handled by Prettier:

```bash
npm run format
```

### Pre-commit Hooks
Husky ensures code quality before commits:
- Runs linting
- Runs formatting checks
- Validates commit messages

## 📝 Database Migrations

### Create a New Migration

```bash
npm run migrate:create -- migration_name
```

### Run Migrations

```bash
npm run migrate
```

### Rollback Migrations

```bash
npm run migrate:rollback
```

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure proper database credentials
- [ ] Set up proper logging
- [ ] Enable CORS for specific domains
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Test all API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**HardCoder404**

## 🙏 Acknowledgments

- Express.js community
- TypeScript team
- All contributors

---

**Happy Coding! 🚀**