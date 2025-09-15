"use strict";
const on_submit = async (e, form) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log("oeoe", e);
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
