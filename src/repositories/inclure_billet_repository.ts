import Repository from "../libs/repository";
import { InclureBilletDTO, InclureBilletEntity } from "../types/models/inclure_billet";
import { TablesNames } from "../types/tables_names";

export class InclureBilletRepository extends Repository<InclureBilletDTO, InclureBilletEntity> {
  protected tableName: TablesNames = "inclure_billet";
}
