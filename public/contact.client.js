window.addEventListener("DOMContentLoaded", () => {
  let i18n, lang;
  try {
    const raw = window.__I18N__;
    i18n = typeof raw === "string" ? JSON.parse(raw) : raw;
    lang = window.__LANG__;
  } catch {
    i18n = {};
    lang = "es";
  }
  if (!lang) lang = "es";
  function tJS(key) {
    if (i18n[lang] && i18n[lang][key]) return i18n[lang][key];
    if (i18n[lang] && i18n[lang].contact && i18n[lang].contact[key]) return i18n[lang].contact[key];
    return key;
  }
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const copyBtn = document.getElementById("copy-email");
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
      status.textContent = tJS('copied');
      status.classList.remove("text-red-500");
      status.classList.add("text-green-600");
      const copyIcon = document.getElementById("copy-icon");
      if (copyIcon) {
        copyIcon.classList.add("scale-90");
      }
    } catch (e) {
      status.textContent = tJS('copyError');
      status.classList.remove("text-green-600");
      status.classList.add("text-red-500");
    }
  });
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    status.textContent = tJS('sending');
    status.classList.remove("text-red-500", "text-green-600");
    const projectType = form.projectType?.value?.trim?.() || "";
    const timeline = form.timeline?.value?.trim?.() || "";
    const budget = form.budget?.value?.trim?.() || "";
    const goal = form.goal?.value?.trim?.() || "";
    const subject = form.subject?.value?.trim?.() || "";

    const briefLines = [];
    if (projectType) briefLines.push(`${tJS('briefProjectType')}: ${projectType}`);
    if (timeline) briefLines.push(`${tJS('briefTimeline')}: ${timeline}`);
    if (budget) briefLines.push(`${tJS('briefBudget')}: ${budget}`);
    if (goal) briefLines.push(`${tJS('briefGoal')}: ${goal}`);

    const baseMessage = (form.message?.value || "").trim();
    const fullMessage =
      briefLines.length > 0
        ? `${baseMessage}\n\n---\n${briefLines.join('\n')}`
        : baseMessage;

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject,
      message: fullMessage,
    };
    try {
      submitBtn.classList.add("scale-95");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        status.textContent = tJS('success');
        status.classList.add("text-green-600");
        form.reset();
        const sendIcon = document.getElementById("send-icon");
        showTempCheck(sendIcon);
      } else {
        const json = await res.json().catch(() => ({}));
        status.textContent = json?.error || tJS('sendError');
        status.classList.add("text-red-500");
      }
    } catch (err) {
      status.textContent = tJS('networkError');
      status.classList.add("text-red-500");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("scale-95");
    }
  });
});
