import "dotenv/config";
import { defineConfig } from "prisma/config";

// Usamos uma alternativa caso o process.env falhe no carregamento inicial
const databaseUrl = process.env.DATABASE_URL || "";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});