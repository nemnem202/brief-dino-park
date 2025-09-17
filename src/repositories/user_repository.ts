import Repository from "../libs/repository";
import {
  Compte_utilisateur_Entity,
  Compte_utilisateurDTO,
} from "../types/models/compte_utilisateur";
import { TablesNames } from "../types/tables_names";

export class UseRepository extends Repository<Compte_utilisateurDTO, Compte_utilisateur_Entity> {
  protected tableName: TablesNames = "Compte_utilisateur";
}
