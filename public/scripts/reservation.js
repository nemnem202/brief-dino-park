"use strict";
let tarifs = [];
const achats = [];
const reservation = async () => {
    const billet_importer = document.getElementById("billet-importer");
    if (!billet_importer || !billet_importer.innerText)
        return;
    try {
        const billets = JSON.parse(billet_importer.innerText);
        console.log(billets);
        const res_tarifs = await fetch("/available-tarifs");
        const data = await res_tarifs.json();
        tarifs = data.tarifs;
        listen_buttons(billets, tarifs);
    }
    catch (err) {
        console.log(err);
    }
};
reservation();
function listen_buttons(billets, tarifs) {
    for (const b of billets) {
        const button = document.getElementById(`ajouter_billet${b.id}`);
        if (!button) {
            console.log("non trouvé");
            continue;
        }
        button.addEventListener("click", () => open_modal(b, tarifs));
    }
}
function open_modal(b, tarifs) {
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
function setup_modal(modal, modal_container, b, tarifs) {
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
    }
    else {
        const noTarifs = document.createElement("div");
        noTarifs.textContent = "Pas de tarifs disponibles";
        modal.appendChild(noTarifs);
    }
    const button = document.createElement("button");
    button.textContent = "Ajouter";
    modal.appendChild(button);
    button.addEventListener("click", () => add_achat(modal_container, tarifs, parseInt(select.value), b));
}
function add_achat(modal_container, tarifs, tarif_id, billet) {
    const reservations_container = document.getElementById("reservation_column");
    if (!reservations_container) {
        console.log("nono");
        return;
    }
    achats.push({
        billet: billet,
        tarif_id: tarif_id,
    });
    document.body.classList.remove("modal-open");
    modal_container.remove();
    reservations_container.innerHTML = `<h1>Votre réservation :</h1>`;
    achats.forEach((r) => create_reservation_card(reservations_container, r));
    add_total(reservations_container);
}
function create_reservation_card(container, achat) {
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
function add_total(container) {
    if (achats.length > 0) {
        const total = achats.reduce((sum, r) => sum + Number(r.billet.prix_billet), 0);
        const totalBtn = document.createElement("button");
        totalBtn.textContent = `Payer : ${total} €`;
        container.appendChild(totalBtn);
    }
}
