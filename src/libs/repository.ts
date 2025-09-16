import { Pool } from "pg";
import Database from "../validation/database";
import { TablesNames } from "../types/tables_names";

export default abstract class Repository<T extends Object> {
  protected pool: Pool;
  protected abstract tableName: TablesNames;
  protected abstract fromRow(row: unknown): T;

  constructor() {
    this.pool = Database.getPool();
  }

  findAll = async (): Promise<T[] | null> => {
    const query = {
      name: `fetch-all-${this.tableName}`,
      text: `select * from ${this.tableName}`,
    };

    try {
      const result = await this.pool.query(query);
      const data = result.rows.map(this.fromRow);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  };

  add_item = async (item: T): Promise<boolean> => {
    try {
      // Récupère toutes les clés et valeurs de l'objet
      const keys = Object.keys(item);
      const values = Object.values(item);

      // Crée les placeholders pour PostgreSQL ($1, $2, ...)
      const placeholders = keys.map((_, index) => `$${index + 1}`);

      const query = {
        text: `INSERT INTO ${this.tableName} (${keys.join(", ")})
             VALUES (${placeholders.join(", ")})`,
        values,
      };

      await this.pool.query(query);

      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      return false;
    }
  };
}
