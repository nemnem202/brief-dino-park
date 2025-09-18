export type Compte_utilisateurDTO = {
  email: string;
  mot_de_passe: string;
  est_administrateur: boolean;
};

export type Compte_utilisateur_Entity = Compte_utilisateurDTO & { id: string };
