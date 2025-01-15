# Suviet Mahjang Assistant

基于Nuxt的麻雀小助手。

## Dependencies

- Node >= 22

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Run migration of prisma:

```bash
export DATABASE_URL="file:${PWD}/prisma/prod.db"
npx prisma migrate deploy
```

Locally preview production build:

```bash
node .output/server/index.mjs
```

Deploy with PM2:
```bash
NUXT_SESSION_PASSWORD={your password}
NUXT_REGISTER_TOKEN={your token}
DATABASE_URL="file:${PWD}/prisma/prod.db"
pm2 start ecosystem.config.cjs
```