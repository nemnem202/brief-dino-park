import Repository from "../libs/repository";
import { Dinosaure } from "../types/models/dinosaure";
import { TablesNames } from "../types/tables_names";

export default class DinoRepository extends Repository<Dinosaure> {
  protected tableName: TablesNames = "Dinosaure";
  protected fromRow = (row: Dinosaure): Dinosaure => row;
}
