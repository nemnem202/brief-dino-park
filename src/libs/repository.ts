import { Pool } from "pg";
import Database from "../validation/database";
import { TablesNames } from "../types/tables_names";

export default abstract class Repository<DTO extends Object, Entity extends object> {
  protected pool: Pool;
  protected abstract tableName: TablesNames;
  protected fromRow = (row: Entity): Entity => row;

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

  add_item = async (item: DTO): Promise<Entity | null> => {
    try {
      const keys = Object.keys(item);
      const values = Object.values(item);

      const placeholders = keys.map((_, index) => `$${index + 1}`);

      const query = {
        text: `INSERT INTO ${this.tableName} (${keys.join(", ")})
         VALUES (${placeholders.join(", ")})
         RETURNING *`,
        values,
      };

      const query_result = await this.pool.query<Entity>(query);

      return query_result.rows[0] ?? null;
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      return null;
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

  get_prop_by_key = async (id: number, prop: keyof Entity): Promise<string | null> => {
    const query = {
      text: `SELECT ${String(prop)} FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };

    try {
      const result = await this.pool.query(query);
      if (result.rows.length > 0) {
        return result.rows[0][prop as string];
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la propriété ${String(prop)} :`, error);
      return null;
    }
  };
}
