let dino_id_array: string[] = [];

const billet_upload = () => {
  const send_data = async (form: HTMLFormElement) => {
    console.log("[FORM] : try to submit data...");
    try {
      const form_data = new FormData(form);
      form_data.append("dino_id_array", JSON.stringify(dino_id_array));
      const res = await fetch("/admin/billet-upload", {
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
    const form = document.getElementById("billet-form") as HTMLFormElement;
    if (!form) {
      window.alert("an error occured, try reload the page");
      return;
    }

    form.addEventListener("submit", (e) => on_submit(e, form));

    const checkboxes = (
      document.querySelectorAll(".dino-checkbox") as NodeListOf<HTMLInputElement>
    ).forEach((d) => {
      d.addEventListener("change", (e) => {
        if (d.checked && !dino_id_array.includes(d.value)) {
          dino_id_array.push(d.value);
        } else {
          dino_id_array = dino_id_array.filter((e) => e !== d.value);
        }
        console.log(dino_id_array);
      });
    });
  };

  listen_form();
};

billet_upload();
