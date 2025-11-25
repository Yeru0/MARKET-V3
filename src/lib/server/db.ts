// A bit of gutting, but this makes intellisense possible
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../prisma/client";
import { DATABASE_URL } from "$env/static/private";

const adapter = new PrismaBetterSqlite3({
	url: DATABASE_URL
});

export const db = new PrismaClient({
	log: [{ level: "error", emit: "event" }],
	adapter
});
db.$on("error", (e) => {
	console.error(e);
});
