<<<<<<< HEAD
/**
 * Ashbury — School administration dashboard
 */
(function () {
  "use strict";

  const toastEl = document.getElementById("saToast");
  const toastBody = document.getElementById("saToastBody");
  const toast =
    toastEl && typeof bootstrap !== "undefined"
      ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2600 })
      : null;

  function showToast(message) {
    if (toastBody) toastBody.textContent = message;
    toast?.show();
  }

  const sidebar = document.getElementById("saSidebar");
  const overlay = document.getElementById("saOverlay");

  function setSidebar(open) {
    sidebar?.classList.toggle("is-open", open);
    overlay?.classList.toggle("is-visible", open);
    document.body.style.overflow = open && window.innerWidth < 992 ? "hidden" : "";
  }

  document.getElementById("saMenuBtn")?.addEventListener("click", () => setSidebar(true));
  document.getElementById("saSidebarClose")?.addEventListener("click", () => setSidebar(false));
  overlay?.addEventListener("click", () => setSidebar(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });
  document.querySelectorAll("#saSidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) setSidebar(false);
    });
  });

  const clock = document.getElementById("saClock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => {
      clock.textContent = fmt.format(new Date());
    };
    tick();
    window.setInterval(tick, 30000);
  }

  function setupFilter(searchId, gradeId, statusId, itemSelector, emptyId) {
    const search = document.getElementById(searchId);
    const grade = document.getElementById(gradeId);
    const status = document.getElementById(statusId);
    const empty = document.getElementById(emptyId);
    const items = Array.from(document.querySelectorAll(itemSelector));
    if (!items.length) return;

    function apply() {
      const q = (search?.value || "").trim().toLowerCase();
      const gradeVal = (grade?.value || "all").toLowerCase();
      const statusVal = (status?.value || "all").toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const itemGrade = (item.getAttribute("data-grade") || item.getAttribute("data-subject") || "").toLowerCase();
        const itemStatus = (item.getAttribute("data-status") || "").toLowerCase();
        const show =
          (!q || text.includes(q)) &&
          (gradeVal === "all" || itemGrade.includes(gradeVal)) &&
          (statusVal === "all" || itemStatus === statusVal);
        item.classList.toggle("d-none", !show);
        if (show) visible += 1;
      });
      empty?.classList.toggle("is-visible", visible === 0);
    }

    search?.addEventListener("input", apply);
    grade?.addEventListener("change", apply);
    status?.addEventListener("change", apply);
  }

  setupFilter("saStudentSearch", "saStudentGrade", "saStudentStatus", "[data-student-card]", "saStudentEmpty");
  setupFilter("saTeacherSearch", "saTeacherSubject", "saTeacherStatus", "[data-teacher-card]", "saTeacherEmpty");
  setupFilter("saClassSearch", "saClassSubject", "saClassPeriod", "[data-class-row]", "saClassEmpty");
  setupFilter("saAttendSearch", "saAttendClass", "saAttendStatus", "[data-attend-row]", "saAttendEmpty");

  document.getElementById("saAttendanceForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const klass = form.elements.namedItem("klass")?.value || "Class";
    const absent = form.querySelectorAll('input[name="absent"]:checked').length;
    showToast(`${klass}: attendance saved · ${absent} marked absent`);
    form.classList.remove("was-validated");
  });

  document.querySelectorAll("[data-student-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-student-action");
      const name = btn.getAttribute("data-student-name") || "Student";
      showToast(action === "note" ? `Counselor note added for ${name}` : `Homeroom opened for ${name}`);
    });
  });

  document.querySelectorAll("[data-class-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-class-action");
      const title = btn.getAttribute("data-class-name") || "Class";
      showToast(action === "roster" ? `${title} roster opened` : `${title} attendance started`);
    });
  });

  document.getElementById("saContactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    showToast("Message sent to the Ashbury front office");
    form.reset();
    form.classList.remove("was-validated");
  });

  document.getElementById("saReportExport")?.addEventListener("click", () => {
    showToast("Attendance report queued for Maya Poluru");
  });

  document.getElementById("saTopSearch")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const q = event.currentTarget.value.trim();
    if (q) showToast(`Search for “${q}” — open Students or Classes`);
  });

  const docsSections = document.querySelectorAll(".sa-docs-content section[id]");
  const docsLinks = document.querySelectorAll(".sa-docs-nav a[href^='#']");
  if (docsSections.length && docsLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    docsLinks.forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) map.set(id, link);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          docsLinks.forEach((link) => link.classList.remove("is-active"));
          map.get(entry.target.id)?.classList.add("is-active");
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    docsSections.forEach((section) => observer.observe(section));
  }
})();
=======
console.log("Hello, World!");
>>>>>>> ae95d6daa6479a622c1f245ca284ab3feb7027ca
