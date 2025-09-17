export type VoirDinosaureDTO = {
  code_billet: string;
  code_dinosaure: string;
};

export type Voir_DinosaureEntity = VoirDinosaureDTO & { id: number | string };
