import { Pool } from "pg";
import dotenv from "dotenv";

export default class Database {
  private static pool: Pool | null = null;

  private constructor() {}

  static getPool(): Pool {
    if (!this.pool) {
      dotenv.config();
      const pool_config = {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
        database: process.env.PGDATABASE,
      };
      console.log("[POOL CONFIG] : ", pool_config);
      this.pool = new Pool(pool_config);
    }

    return this.pool;
  }
}
