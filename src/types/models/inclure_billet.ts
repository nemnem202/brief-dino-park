export type InclureBilletDTO = {
  code_reservation: string | number;
  code_billet: string | number;
  code_tarif: string | number;
  date_visite: Date;
  prix_a_l_achat: number;
};

export type InclureBilletEntity = InclureBilletDTO & { id: string | number };
