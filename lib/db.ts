import "win-ca"; // VERY IMPORTANT for Windows + Neon
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(process.env.DATABASE_URL, {
  insecureTLS: true, // still required until Node fully trusts the new CA store
});

export { sql };