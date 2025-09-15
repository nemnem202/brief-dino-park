"use strict";
const send_data = async (data) => {
    console.log(data);
    try {
        const res = await fetch("/admin/dino-upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const mssg = await res.json();
        console.log("datta recieved", mssg);
    }
    catch (e) {
        console.error("[ ERREUR DE L'ENVOI]", e);
    }
};
const on_submit = async (e, form) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        name: formData.get("dinosaure-name"),
        regime: formData.get("dinosaure-regime"),
        description: formData.get("dinosaure-description"),
        image: formData.get("dinosaure-img"),
    };
    send_data(data);
};
const listen_form = () => {
    const form = document.getElementById("dino-form");
    if (!form) {
        window.alert("an error occured, try reload the page");
        return;
    }
    form.addEventListener("submit", (e) => on_submit(e, form));
};
listen_form();
