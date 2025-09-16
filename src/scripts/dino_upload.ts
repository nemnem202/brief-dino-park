const send_data = async (form: HTMLFormElement) => {
  console.log("[FORM] : try to submit data...");
  try {
    const form_data = new FormData(form);
    const res = await fetch("/admin/dino-upload", {
      method: "POST",
      body: form_data,
    });
    const response = await res.json();
    console.log("[FORM] : json received");
    console.log(response);
  } catch (e) {
    console.error("[FORM] : data submit failed...");
    console.error(e);
  }
};

const on_submit = async (e: SubmitEvent, form: HTMLFormElement) => {
  e.preventDefault();
  send_data(form);
};

const listen_form = () => {
  const form = document.getElementById("dino-form") as HTMLFormElement;
  if (!form) {
    window.alert("an error occured, try reload the page");
    return;
  }

  form.addEventListener("submit", (e) => on_submit(e, form));
};

listen_form();
