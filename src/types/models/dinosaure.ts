export type DinosaureDTO = {
  nom_dinosaure: string;
  regime_dinosaure: string;
  description_dinosaure: string;
  image_dinosaure: string;
  image_dinosaure_id: string;
};

export type DinosaureEntity = DinosaureDTO & { code_dinosaure: number };
