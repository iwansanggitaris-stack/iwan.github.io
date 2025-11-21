

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- elements ---------- */
  const welcomePopup = document.getElementById("welcomePopup");
  const enterBtn = document.getElementById("enterBtn");
  const usernameInput = document.getElementById("usernameInput");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");
  const logo = document.getElementById("logoHome");
  const form = document.getElementById("contactForm");
  const resultBox = document.getElementById("resultBox");
  const resultText = document.querySelector(".hasil");

  /* ---------- Dark mode  ---------- */
  const header = document.querySelector("header .container") || document.querySelector("header");
  const toggleWrap = document.createElement("div");
  toggleWrap.className = "dark-toggle";
  toggleWrap.setAttribute("title", "Toggle Dark Mode");
  toggleWrap.innerHTML = `<div class="knob"></div>`;
  // append at the end of header container
  if (header) header.appendChild(toggleWrap);

  // read saved
  const saved = localStorage.getItem("naweb_dark");
  if (saved === "on") document.body.classList.add("dark");

  toggleWrap.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("naweb_dark", document.body.classList.contains("dark") ? "on" : "off");
  });

  /* ---------- popup welcome ---------- */
  enterBtn?.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    welcomeTitle.textContent = name ? `Hi ${name}, Welcome To My Website` : `Hi Ges, Welcome To My Website`;
    welcomePopup.classList.add("hide");
    // brief focus to home
    document.getElementById("home")?.classList.add("active");
  });
  usernameInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enterBtn.click();
  });

  /* ---------- navigation ---------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      if (!target) return;
      sections.forEach((s) => {
        s.classList.add("hidden");
        s.classList.remove("active");
      });
      const section = document.getElementById(target);
      if (section) {
        section.classList.remove("hidden");
        section.classList.add("active");
      }
      // nav highlight
      navLinks.forEach(n => n.classList.remove("active"));
      link.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------- logo click -> home ---------- */
  logo?.addEventListener("click", () => {
    sections.forEach((s) => { s.classList.add("hidden"); s.classList.remove("active"); });
    const home = document.getElementById("home");
    if (home) { home.classList.remove("hidden"); home.classList.add("active"); }
    // highlight home nav
    navLinks.forEach(n => n.classList.remove("active"));
    const homeNav = document.querySelector('.nav-link[data-target="home"]');
    if (homeNav) homeNav.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- form interaksi + animasi ---------- */
  if (form) {
    // focus effects handled by CSS; here add keyboard enter navigation
    const inputs = Array.from(form.querySelectorAll("input, textarea, button"));
    form.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        const active = document.activeElement;
        if (active && active.tagName !== "TEXTAREA") {
          evt.preventDefault();
          const idx = inputs.indexOf(active);
          if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
        }
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("formName").value.trim();
      const email = document.getElementById("formEmail")?.value.trim() || "";
      const birth = document.getElementById("formBirth").value || "";
      const msg = document.getElementById("formMessage").value.trim() || "";
      const genderField = document.querySelector("input[name='gender']:checked");

      if (!name || !email || !msg) {
        // subtle error feedback
        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn?.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 220 });
        alert("Mohon isi Nama, Email, dan Pesan.");
        return;
      }
      if (!genderField) {
        alert("Pilih jenis kelamin!");
        return;
      }
      const gender = genderField.value;

      // populate result box
      resultText.innerHTML = `
        <div style="margin-bottom:8px;color:var(--muted)"><small>Pesan diterima pada: ${new Date().toLocaleString()}</small></div>
        <b>Nama:</b> ${escapeHtml(name)}<br>
        <b>Email:</b> ${escapeHtml(email)}<br>
        <b>Tanggal Lahir:</b> ${escapeHtml(birth)}<br>
        <b>Jenis Kelamin:</b> ${escapeHtml(gender)}<br>
        <b>Pesan:</b><br>${escapeHtml(msg).replace(/\n/g, "<br>")}
      `;

      // show result with micro animation
      resultBox.classList.add("show");
      resultBox.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 360, easing: "ease-out" });

      form.reset();
    });
  }

  /* ---------- small helpers ---------- */
  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
