export type BilletDTO = {
  titre_billet: string;
  description_billet: string;
  prix_billet: number;
  age_minimum: number;
  image_billet: string;
  image_billet_id: string;
};

export type BilletEntity = BilletDTO & { id: number | string };
