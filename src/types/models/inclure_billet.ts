export type InclureBilletDTO = {
  code_reservation: string | number;
  code_billet: string | number;
  code_tarif: string | number;
  prix_a_l_achat: number;
};

export type InclureBilletEntity = InclureBilletDTO & { id: string | number };
