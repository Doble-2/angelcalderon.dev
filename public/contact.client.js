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
    status.classList.remove("text-red-500", "text-green-600");
    if (kind === "ok") status.classList.add("text-green-600");
    if (kind === "error") status.classList.add("text-red-500");
  }

  function showTempCheck(iconEl) {
    if (!iconEl) return;
    const original = iconEl.innerHTML;
    iconEl.innerHTML =
      '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
    iconEl.classList.add("scale-95");
    setTimeout(() => {
      iconEl.innerHTML = original;
      iconEl.classList.remove("scale-95");
    }, 1500);
  }

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("hola@angelcalderon.dev");
      setStatus(tJS("copied"), "ok");
    } catch (e) {
      setStatus(tJS("copyError"), "error");
    }
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.classList.add("scale-95");
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
        setStatus(tJS("success"), "ok");
        form.reset();
        showTempCheck(document.getElementById("send-icon"));
      } else {
        const json = await res.json().catch(() => ({}));
        const known = { rate_limited: "tooManyRequests", invalid_email: "invalidEmail" };
        setStatus(tJS(known[json?.error] || "sendError"), "error");
      }
    } catch (err) {
      setStatus(tJS("networkError"), "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("scale-95");
    }
  });
});
