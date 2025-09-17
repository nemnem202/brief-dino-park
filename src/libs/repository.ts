import { Pool } from "pg";
import Database from "../validation/database";
import { TablesNames } from "../types/tables_names";

export default abstract class Repository<DTO extends Object, Entity extends object> {
  protected pool: Pool;
  protected abstract tableName: TablesNames;
  protected abstract fromRow(row: unknown): Entity;

  constructor() {
    this.pool = Database.getPool();
  }

  findAll = async (): Promise<Entity[] | null> => {
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

  add_item = async (item: DTO): Promise<boolean> => {
    try {
      const keys = Object.keys(item);
      const values = Object.values(item);

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

  remove_item = async (id: number): Promise<boolean> => {
    try {
      const query = {
        text: `DELETE FROM ${this.tableName} WHERE id = $1`,
        values: [id],
      };

      const result = await this.pool.query(query);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      return false;
    }
  };
}
