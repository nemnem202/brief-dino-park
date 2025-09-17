"use strict";
const user_upload = () => {
    const send_data = async (form) => {
        console.log("[FORM] : try to submit data...");
        try {
            const form_data = new FormData(form);
            const password = form_data.get("password");
            const confirm_password = form_data.get("confirm_password");
            if (password !== confirm_password)
                return console.error("passwords are different");
            const res = await fetch("/connexion/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: form_data.get("email"),
                    password: form_data.get("password"),
                }),
            });
            const response = await res.json();
            console.log("[FORM] : json received");
            console.log(response);
            if (response.redirect) {
                window.location.href = response.redirect;
            }
        }
        catch (e) {
            console.error("[FORM] : data submit failed...");
            console.error(e);
        }
    };
    const on_submit = async (e, form) => {
        e.preventDefault();
        send_data(form);
    };
    const listen_form = () => {
        const form = document.getElementById("sign-in-form");
        if (!form) {
            window.alert("an error occured, try reload the page");
            return;
        }
        form.addEventListener("submit", (e) => on_submit(e, form));
    };
    listen_form();
};
user_upload();
