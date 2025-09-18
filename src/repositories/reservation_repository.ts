import Repository from "../libs/repository";
import { ReservationDTO, ReservationENTITY } from "../types/models/reservation";
import { TablesNames } from "../types/tables_names";

export class ReservationRepository extends Repository<ReservationDTO, ReservationENTITY> {
  protected tableName: TablesNames = "Reservation";
}
