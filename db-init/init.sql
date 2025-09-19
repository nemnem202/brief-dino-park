CREATE TABLE Dinosaure(
   id SERIAL PRIMARY KEY,
   nom_dinosaure VARCHAR(100) NOT NULL,
   regime_dinosaure VARCHAR(300) NOT NULL,
   description_dinosaure VARCHAR(1000),
   image_dinosaure VARCHAR(500) NOT NULL,
   image_dinosaure_id VARCHAR(500),
   UNIQUE(nom_dinosaure)
);

CREATE TABLE Billet(
   id SERIAL PRIMARY KEY,
   titre_billet VARCHAR(100) NOT NULL,
   description_billet VARCHAR(1000) NOT NULL,
   prix_billet NUMERIC(15,2) NOT NULL,
   age_minimum INTEGER NOT NULL,
   image_billet VARCHAR(500) NOT NULL,
   image_billet_id VARCHAR(500),
   UNIQUE(titre_billet)
);

CREATE TABLE Compte_utilisateur(
   id SERIAL PRIMARY KEY,
   email VARCHAR(100) NOT NULL,
   mot_de_passe VARCHAR(300) NOT NULL,
   est_administrateur BOOLEAN,
   UNIQUE(email)
);

CREATE TABLE Voir_dinosaure(
   id SERIAL PRIMARY KEY,
   code_billet INTEGER,
   code_dinosaure INTEGER,
   FOREIGN KEY(code_billet) REFERENCES Billet(id),
   FOREIGN KEY(code_dinosaure) REFERENCES Dinosaure(id)
);

CREATE TABLE Tarif(
   id SERIAL PRIMARY KEY,
   coefficient_tarif NUMERIC(15,2) NOT NULL,
   titre_tarif VARCHAR(50) NOT NULL
);

CREATE TABLE Reservation(
   id SERIAL PRIMARY KEY,
   date_reservation DATE NOT NULL,
   code_utilisateur INTEGER NOT NULL,
   FOREIGN KEY(code_utilisateur) REFERENCES Compte_utilisateur(id)
);

CREATE TABLE inclure_billet(
   id SERIAL PRIMARY KEY,
   prix_a_l_achat NUMERIC(15,2),
   code_reservation INTEGER NOT NULL,
   code_billet INTEGER NOT NULL,
   code_tarif INTEGER NOT NULL,
   date_visite DATE NOT NULL,
   FOREIGN KEY (code_reservation) REFERENCES Reservation(id),
   FOREIGN KEY (code_billet) REFERENCES Billet(id),
   FOREIGN KEY (code_tarif) REFERENCES Tarif(id)
);