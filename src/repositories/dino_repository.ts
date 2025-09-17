import Repository from "../libs/repository";
import { DinosaureDTO, DinosaureEntity } from "../types/models/dinosaure";
import { TablesNames } from "../types/tables_names";

export default class DinoRepository extends Repository<DinosaureDTO, DinosaureEntity> {
  protected tableName: TablesNames = "Dinosaure";
}
