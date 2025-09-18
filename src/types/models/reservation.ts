export type ReservationDTO = {
  date_reservation: Date;
  code_utilisateur: string;
};

export type ReservationENTITY = ReservationDTO & { id: string | number };
