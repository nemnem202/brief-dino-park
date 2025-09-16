import { Pool } from "pg";

export default class Database {
  private static pool: Pool | null = null;

  private constructor() {}

  static getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool();
    }

    return this.pool;
  }
}
