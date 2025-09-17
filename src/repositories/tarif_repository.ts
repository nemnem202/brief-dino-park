import Repository from "../libs/repository";
import { TarifDTO, TarifEntity } from "../types/models/tarif";
import { TablesNames } from "../types/tables_names";

export class TarifRepository extends Repository<TarifDTO, TarifEntity> {
  protected tableName: TablesNames = "Tarif";
}
