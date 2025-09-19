import { Pool } from "pg";
import dotenv from "dotenv";

export default class Database {
  private static pool: Pool | null = null;

  private constructor() {}

  static getPool(): Pool {
    if (!this.pool) {
      dotenv.config();
      const pool_config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
        database: process.env.DB_DATABASE,
      };
      console.log("[POOL CONFIG] : ");
      console.table(pool_config);
      this.pool = new Pool(pool_config);
    }

    return this.pool;
  }
}
