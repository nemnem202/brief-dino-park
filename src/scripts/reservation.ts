interface TarifEntity {
  coefficient_tarif: string;
  titre_tarif: string;
  id: number | string;
}

interface BilletDTO {
  titre_billet: string;
  description_billet: string;
  prix_billet: number;
  age_minimum: number;
  image_billet: string;
  image_billet_id: string;
}

interface BilletEntity extends BilletDTO {
  id: number | string;
}

let tarifs: TarifEntity[] = [];

const reservation = async () => {
  const billet_importer = document.getElementById("billet-importer");
  if (!billet_importer || !billet_importer.innerText) return;
  try {
    const billets = JSON.parse(billet_importer.innerText) as BilletEntity[];
    console.log(billets);
    const res_tarifs = await fetch("/available-tarifs");
    const data = await res_tarifs.json();
    tarifs = data.tarifs;
    listen_buttons(billets, tarifs);
  } catch (err) {
    console.log(err);
  }
};

reservation();

function listen_buttons(billets: BilletEntity[], tarifs: TarifEntity[]) {
  for (const b of billets) {
    const button = document.getElementById(`ajouter_billet${b.id}`) as HTMLButtonElement;

    if (!button) {
      console.log("non trouvé");
      continue;
    }

    button.addEventListener("click", () => open_modal(b, tarifs));
  }
}

function open_modal(b: BilletEntity, tarifs: TarifEntity[]): void {
  const modal_container = document.createElement("div");
  modal_container.className = "modal-container";
  const modal = document.createElement("div");
  modal.className = "reservation-modal";
  modal_container.appendChild(modal);

  document.body.appendChild(modal_container);

  document.body.classList.add("modal-open");

  modal_container.addEventListener("click", () => {
    document.body.classList.remove("modal-open");
    modal_container.remove();
  });

  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  setup_modal(modal, b, tarifs);
}

function setup_modal(modal: HTMLDivElement, b: BilletEntity, tarifs: TarifEntity[]) {
  // Image
  const image = document.createElement("img");
  image.src = b.image_billet;
  image.alt = b.titre_billet;
  modal.appendChild(image);

  // Titre
  const title = document.createElement("h2");
  title.textContent = b.titre_billet;
  modal.appendChild(title);

  // Description
  const description = document.createElement("p");
  description.textContent = b.description_billet;
  modal.appendChild(description);

  // Prix
  const prix = document.createElement("div");
  prix.textContent = `Prix : ${b.prix_billet} €`;
  modal.appendChild(prix);

  // Age minimum
  const age = document.createElement("div");
  age.textContent = b.age_minimum > 0 ? `Age minimum : ${b.age_minimum} ans` : "Tous les ages";
  modal.appendChild(age);

  const select = document.createElement("select");
  tarifs.forEach((tarif) => {
    const option = document.createElement("option");
    option.value = String(tarif.id); // valeur = id du tarif
    option.textContent = tarif.titre_tarif; // texte affiché = titre du tarif
    select.appendChild(option);
  });
  modal.appendChild(select);

  // Bouton Ajouter
  const button = document.createElement("button");
  button.textContent = "Ajouter";
  button.addEventListener("click", () => {
    console.log("Billet ajouté :", b);
    // Ici tu peux ajouter la logique d'ajout
  });
  modal.appendChild(button);
}
