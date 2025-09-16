import { Pool } from "pg";
import Database from "../validation/database";

export default abstract class Repository {
  protected pool: Pool;

  constructor() {
    this.pool = Database.getPool();
  }
}
