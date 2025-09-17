import Repository from "../libs/repository";
import { BilletDTO, BilletEntity } from "../types/models/billet";
import { TablesNames } from "../types/tables_names";

export class BilletRepository extends Repository<BilletDTO, BilletEntity> {
  protected tableName: TablesNames = "Billet";
}
