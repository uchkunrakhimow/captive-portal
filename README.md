# Captive portal in nodejs

to run the project on localhost
```bash
npm run dev
```

go to the project folder, and then install the project
```bash
npm install # I recommend pnpm or bun
```

initialize the prism
```bash
npx prisma generate && npx prisma migrate dev --name init
```

run docker compose
```bash
docker compose up -d
```