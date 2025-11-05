// A bit of gutting, but this makes intelisense possible
import { PrismaClient } from "$lib/prisma/client";

export const db = new PrismaClient({
	log: [{ level: "error", emit: "event" }]
});
db.$on("error", (e) => {
	console.error(e);
});
