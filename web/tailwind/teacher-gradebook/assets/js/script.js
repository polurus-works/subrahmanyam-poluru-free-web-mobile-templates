/**
 * Ledger — Teacher gradebook
 * Hash views, section switcher, scores, attendance, report cards
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const titles = {
    dashboard: "Dashboard",
    classes: "Classes",
    scores: "Scores",
    attendance: "Attendance",
    reports: "Report cards",
  };

  const toastEl = document.getElementById("gbToast");
  let toastTimer;

  function showToast(title, body) {
    const titleEl = document.getElementById("gbToastTitle");
    const bodyEl = document.getElementById("gbToastBody");
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    toastEl?.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl?.classList.remove("is-visible"), 3200);
  }

  const sidebar = document.getElementById("gbSidebar");
  const overlay = document.getElementById("gbOverlay");

  function setSidebar(open) {
    sidebar?.classList.toggle("is-open", open);
    overlay?.classList.toggle("is-visible", open);
    document.body.style.overflow = open && window.innerWidth < 1024 ? "hidden" : "";
  }

  document.getElementById("gbMenuBtn")?.addEventListener("click", () => setSidebar(true));
  document.getElementById("gbSidebarClose")?.addEventListener("click", () => setSidebar(false));
  overlay?.addEventListener("click", () => setSidebar(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });

  const views = Array.from(document.querySelectorAll(".gb-view"));
  const navLinks = Array.from(document.querySelectorAll(".gb-nav-link[data-view]"));
  const crumb = document.getElementById("gbCrumb");

  function showView(name) {
    const id = titles[name] ? name : "dashboard";
    views.forEach((view) => {
      const active = view.id === `view-${id}`;
      view.classList.toggle("is-active", active);
      view.hidden = !active;
    });
    navLinks.forEach((link) => {
      const on = link.getAttribute("data-view") === id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (crumb) crumb.textContent = titles[id];
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
    if (window.innerWidth < 1024) setSidebar(false);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const name = el.getAttribute("data-view");
      if (!name || !titles[name]) return;
      event.preventDefault();
      showView(name);
    });
  });

  document.querySelectorAll("[data-view-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-view-jump");
      const section = btn.getAttribute("data-section");
      showView(name);
      if (section) setSection(section);
    });
  });

  window.addEventListener("hashchange", () => {
    showView(window.location.hash.replace("#", ""));
  });
  showView(window.location.hash.replace("#", "") || "dashboard");

  const clock = document.getElementById("gbClock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    clock.textContent = fmt.format(new Date());
  }

  let currentSection = "lit11a";
  const sectionLabel = document.getElementById("gbSectionLabel");
  const sectionNames = {
    lit11a: "Literature 11A",
    lit11b: "Literature 11B",
    homeroom: "Homeroom 11",
  };

  function setSection(id) {
    currentSection = sectionNames[id] ? id : "lit11a";
    document.querySelectorAll("[data-section-chip]").forEach((chip) => {
      chip.classList.toggle("is-active", chip.getAttribute("data-section-chip") === currentSection);
    });
    if (sectionLabel) sectionLabel.textContent = sectionNames[currentSection];
    document.querySelectorAll("[data-section-row]").forEach((block) => {
      block.classList.toggle("is-hidden", block.getAttribute("data-section-row") !== currentSection);
    });
    applyScoreFilter();
    applyAttendFilter();
  }

  document.querySelectorAll("[data-section-chip]").forEach((chip) => {
    chip.addEventListener("click", () => setSection(chip.getAttribute("data-section-chip")));
  });

  const scoreQuery = () => (document.getElementById("gbTopSearch")?.value || "").trim().toLowerCase();

  function applyScoreFilter() {
    const q = scoreQuery();
    let visible = 0;
    document.querySelectorAll("#gbScoreBody tr").forEach((row) => {
      const sectionOk = row.getAttribute("data-section") === currentSection;
      const queryOk = !q || row.textContent.toLowerCase().includes(q);
      const show = sectionOk && queryOk;
      row.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    const count = document.getElementById("gbScoreCount");
    if (count) count.textContent = `${visible} student${visible === 1 ? "" : "s"}`;
  }

  function applyAttendFilter() {
    const q = scoreQuery();
    document.querySelectorAll("#gbAttendBody tr").forEach((row) => {
      const sectionOk = row.getAttribute("data-section") === currentSection;
      const queryOk = !q || row.textContent.toLowerCase().includes(q);
      row.classList.toggle("is-hidden", !(sectionOk && queryOk));
    });
  }

  document.querySelectorAll(".gb-score").forEach((input) => {
    input.addEventListener("change", () => {
      const name = input.getAttribute("data-student") || "Student";
      const work = input.getAttribute("data-work") || "assignment";
      showToast("Score saved", `${name} · ${work} is ${input.value} (demo).`);
    });
  });

  document.querySelectorAll("[data-attend]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const status = btn.getAttribute("data-attend");
      const name = btn.getAttribute("data-student") || "Student";
      const cell = row?.querySelector(".gb-status");
      if (cell) {
        cell.className = `gb-status is-${status}`;
        cell.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      }
      showToast("Attendance", `${name} marked ${status}.`);
    });
  });

  document.getElementById("gbSaveAttend")?.addEventListener("click", () => {
    showToast("Roster saved", `${sectionNames[currentSection]} attendance posted for today.`);
  });

  document.querySelectorAll("[data-publish]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-publish");
      showToast("Report card queued", `${name}’s comment is with the registrar (demo).`);
    });
  });

  document.getElementById("gbTopSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = document.getElementById("gbTopSearch")?.value || "";
    showView("scores");
    applyScoreFilter();
    showToast("Search", q.trim() ? `Filtered for “${q.trim()}”.` : "Showing the current section.");
  });

  document.getElementById("gbBellBtn")?.addEventListener("click", () => {
    showView("scores");
    showToast("To grade", "Three essays still need a mark in Literature 11A.");
  });

  document.getElementById("gbExportBtn")?.addEventListener("click", () => {
    showToast("Export", "CSV queued for Maya Poluru at the registrar desk.");
  });

  setSection("lit11a");

  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
