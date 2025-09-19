interface TarifEntity {
  coefficient_tarif: string;
  titre_tarif: string;
  id: number | string;
}

interface BilletEntity {
  id: number | string;
  titre_billet: string;
  description_billet: string;
  prix_billet: number;
  age_minimum: number;
  image_billet: string;
  image_billet_id: string;
}

interface Achat {
  billet: BilletEntity;
  tarif_id: string | number | null;
  date_visite: Date;
}

let tarifs: TarifEntity[] = [];

const achats: Achat[] = [];

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

  setup_modal(modal, modal_container, b, tarifs);
}

function setup_modal(
  modal: HTMLDivElement,
  modal_container: HTMLDivElement,
  b: BilletEntity,
  tarifs: TarifEntity[]
) {
  const image = document.createElement("img");
  image.src = b.image_billet;
  image.alt = b.titre_billet;
  modal.appendChild(image);

  const title = document.createElement("h2");
  title.textContent = b.titre_billet;
  modal.appendChild(title);

  const description = document.createElement("p");
  description.textContent = b.description_billet;
  modal.appendChild(description);

  const prix = document.createElement("div");
  prix.textContent = `Prix : ${b.prix_billet} €`;
  modal.appendChild(prix);

  const age = document.createElement("div");
  age.textContent = b.age_minimum > 0 ? `Age minimum : ${b.age_minimum} ans` : "Tous les ages";
  modal.appendChild(age);

  const label = document.createElement("div");
  label.textContent = "Tarif : ";
  modal.appendChild(label);

  const select = document.createElement("select");
  if (tarifs.length > 0) {
    select.id = "tarif-select";

    tarifs.forEach((tarif) => {
      const option = document.createElement("option");
      option.value = String(tarif.id);
      option.textContent = tarif.titre_tarif;
      select.appendChild(option);
    });
    modal.appendChild(select);
  } else {
    const noTarifs = document.createElement("div");
    noTarifs.textContent = "Pas de tarifs disponibles";
    modal.appendChild(noTarifs);
  }

  const label_date = document.createElement("div");
  label.textContent = "Date de visite";
  modal.appendChild(label_date);

  const date = document.createElement("input");
  date.type = "date";
  modal.appendChild(date);

  const button = document.createElement("button");
  button.textContent = "Ajouter";
  modal.appendChild(button);

  button.addEventListener("click", () =>
    add_achat(modal_container, parseInt(select.value), b, new Date(date.value))
  );
}

function add_achat(
  modal_container: HTMLDivElement,
  tarif_id: number,
  billet: BilletEntity,
  date_visite: Date
) {
  const reservations_container = document.getElementById("reservation_column") as HTMLDivElement;
  if (!reservations_container) {
    console.log("nono");
    return;
  }
  achats.push({
    billet: billet,
    tarif_id: tarif_id,
    date_visite,
  });

  document.body.classList.remove("modal-open");
  modal_container.remove();

  reservations_container.innerHTML = `<h1>Votre réservation :</h1>`;
  achats.forEach((r) => create_reservation_card(reservations_container, r));
  add_total(reservations_container);
}
function create_reservation_card(container: HTMLDivElement, achat: Achat) {
  const reservation_card = document.createElement("div");
  reservation_card.className = "reservation-card";

  const tarif = tarifs.find((t) => String(t.id) === String(achat.tarif_id));

  // div infos
  const infos = document.createElement("div");
  infos.className = "infos";

  const title = document.createElement("h3");
  title.textContent = achat.billet.titre_billet;

  const tarifDiv = document.createElement("div");
  tarifDiv.textContent = tarif ? `Tarif : ${tarif.titre_tarif}` : "Tarif inconnu";

  const prixDiv = document.createElement("div");
  prixDiv.textContent = `Prix : ${achat.billet.prix_billet} €`;

  infos.appendChild(title);
  infos.appendChild(tarifDiv);
  infos.appendChild(prixDiv);

  // bouton supprimer
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Supprimer";
  deleteBtn.addEventListener("click", () => {
    const index = achats.indexOf(achat);
    if (index !== -1) {
      achats.splice(index, 1);
    }

    container.innerHTML = `<h1>Votre réservation :</h1>`;
    achats.forEach((r) => create_reservation_card(container, r));

    add_total(container);
  });

  // assembler la carte
  reservation_card.appendChild(infos);
  reservation_card.appendChild(deleteBtn);

  container.appendChild(reservation_card);
}

function add_total(container: HTMLDivElement) {
  if (achats.length > 0) {
    const total = achats.reduce((sum, r) => sum + Number(r.billet.prix_billet), 0);

    const totalBtn = document.createElement("button");
    totalBtn.textContent = `Payer : ${total} €`;

    container.appendChild(totalBtn);

    totalBtn.addEventListener("click", () => post_achat());
  }
}

async function post_achat() {
  if (achats.length <= 0) return;
  const achats_to_send = achats.map((a) => {
    return { billet_id: a.billet.id, tarif_id: a.tarif_id, date_visite: a.date_visite };
  });
  const response = await fetch("/user/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ achats: achats_to_send }),
  });

  if (response.redirected) {
    window.location.href = response.url;
    return;
  }

  const res = await response.json();
  console.log(res);
}
