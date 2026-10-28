window.addEventListener("DOMContentLoaded", () => {
  const i18n = window.__CONTACT_I18N__ || {};
  const tJS = (key) => i18n[key] || key;

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const copyBtn = document.getElementById("copy-email");

  function setStatus(text, kind) {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("text-red-400", "text-emerald-400");
    if (kind === "ok") status.classList.add("text-emerald-400");
    if (kind === "error") status.classList.add("text-red-400");
  }

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("angel@angelcalderon.dev");
      setStatus(tJS("copied"), "ok");
    } catch (e) {
      setStatus(tJS("copyError"), "error");
    }
  });

  if (!form) return;

  // --- Formulario por pasos (mejora progresiva: sin JS se ve completo) ---
  const steps = [...form.querySelectorAll(".contact-step")];
  const done = form.querySelector("[data-done]");
  const subject = form.querySelector("#subject");
  let current = 0;

  const show = (i, focus = true) => {
    current = Math.max(0, Math.min(i, steps.length - 1));
    steps.forEach((s, idx) => s.toggleAttribute("hidden", idx !== current));
    form.style.setProperty("--progress", String((current + 1) / steps.length));
    setStatus("");
    if (focus) {
      const target = steps[current].querySelector("textarea, input:not([type=radio]), input[type=radio]");
      target?.focus({ preventScroll: true });
    }
  };

  const valid = (step) => {
    const fields = [...step.querySelectorAll("input[required], textarea[required]")];
    const bad = fields.find((f) => !f.value.trim() || !f.checkValidity());
    if (bad) {
      setStatus(bad.type === "email" && bad.value ? tJS("invalidEmail") : tJS("contact_required"), "error");
      bad.focus();
      return false;
    }
    return true;
  };

  form.classList.add("is-stepped");
  show(0, false);

  // Paso 1: con ratón/táctil, elegir una intención avanza sola; con teclado
  // (flechas) solo se selecciona y se avanza con "Siguiente".
  let pointerPick = false;
  form.querySelectorAll(".contact-chip").forEach((chip) =>
    chip.addEventListener("pointerdown", () => (pointerPick = true)),
  );
  form.querySelectorAll("input[name=intent]").forEach((radio) => {
    radio.addEventListener("change", () => {
      if (subject) subject.value = radio.value;
      if (pointerPick) setTimeout(() => show(1), 180);
      pointerPick = false;
    });
  });

  form.querySelectorAll("[data-next]").forEach((b) =>
    b.addEventListener("click", () => valid(steps[current]) && show(current + 1)),
  );
  form.querySelectorAll("[data-prev]").forEach((b) => b.addEventListener("click", () => show(current - 1)));

  // Enter en el textarea no envía; Ctrl/Cmd+Enter avanza
  form.querySelector("textarea")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (valid(steps[current])) show(current + 1);
    }
  });

  form.querySelector("[data-restart]")?.addEventListener("click", () => {
    form.reset();
    if (subject) subject.value = "";
    done.hidden = true;
    show(0);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valid(steps[current])) return;

    submitBtn.disabled = true;
    setStatus(tJS("sending"));

    const field = (name) => (form.elements.namedItem(name)?.value || "").trim();
    const data = {
      name: field("name"),
      email: field("email"),
      subject: field("subject"),
      message: field("message"),
      website: field("website"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        // Ráfaga de flores desde el botón
        const r = submitBtn.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent("petals:burst", { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
        steps.forEach((s) => (s.hidden = true));
        done.hidden = false;
        form.style.setProperty("--progress", "1");
        setStatus("");
        done.querySelector("[data-restart]")?.focus({ preventScroll: true });
      } else {
        const json = await res.json().catch(() => ({}));
        const known = { rate_limited: "tooManyRequests", invalid_email: "invalidEmail" };
        setStatus(tJS(known[json?.error] || "sendError"), "error");
      }
    } catch (err) {
      setStatus(tJS("networkError"), "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
});
