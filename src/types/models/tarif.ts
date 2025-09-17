export type TarifDTO = {
  coefficient_tarif: string;
  titre_tarif: string;
};

export type TarifEntity = TarifDTO & { id: number | string };
