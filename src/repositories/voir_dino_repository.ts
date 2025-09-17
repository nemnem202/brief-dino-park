import Repository from "../libs/repository";
import { Voir_DinosaureEntity, VoirDinosaureDTO } from "../types/models/voir_dinosaure";
import { TablesNames } from "../types/tables_names";

export class VoirDinoRepository extends Repository<VoirDinosaureDTO, Voir_DinosaureEntity> {
  protected tableName: TablesNames = "voir_dinosaure";
}
