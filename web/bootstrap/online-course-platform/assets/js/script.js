/**
 * Helio — Online course platform
 * Catalog filters, path/plan enroll, draft save, newsletter, toasts
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DRAFT_KEY = "hl-enroll-draft";

  const toastEl = document.getElementById("hlToast");
  const toast =
    toastEl && typeof bootstrap !== "undefined"
      ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 })
      : null;

  function showToast(title, body) {
    const titleEl = document.getElementById("hlToastTitle");
    const bodyEl = document.getElementById("hlToastBody");
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    toast?.show();
  }

  const navbar = document.getElementById("hlNavbar");
  function updateNavbar() {
    navbar?.classList.toggle("hl-navbar-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  const navCollapseEl = document.getElementById("hlNav");
  const navCollapse = navCollapseEl
    ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
    : null;

  document.querySelectorAll('.hl-navbar a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navCollapse) navCollapse.hide();
    });
  });

  const sectionIds = [
    "home",
    "school",
    "courses",
    "paths",
    "instructors",
    "pricing",
    "enroll",
    "notes",
    "faq",
  ];
  const navLinks = Array.from(document.querySelectorAll(".hl-navbar .nav-link"));

  function setActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = "home";
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollY) current = id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", href === `#${current}`);
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  const backTop = document.getElementById("hlBackTop");
  function updateBackTop() {
    backTop?.classList.toggle("is-visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();
  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  function animateCounter(el) {
    const target = Number(el.getAttribute("data-target") || "0");
    const decimals = Number(el.getAttribute("data-decimals") || "0");
    const duration = 1400;
    const start = performance.now();

    if (reduceMotion) {
      el.textContent = target.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return;
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll(".hl-counter");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => observer.observe(el));
  } else {
    counters.forEach((el) => animateCounter(el));
  }

  const courseChips = document.querySelectorAll("[data-course-filter]");
  const courseItems = document.querySelectorAll(".hl-course-item");
  const courseCount = document.getElementById("hlCourseCount");
  const courseEmpty = document.getElementById("hlCourseEmpty");
  const searchQuery = document.getElementById("hlSearchQuery");
  const searchTopic = document.getElementById("hlSearchTopic");
  const searchLevel = document.getElementById("hlSearchLevel");
  const searchLength = document.getElementById("hlSearchLength");
  const searchNote = document.getElementById("hlSearchNote");

  let topicFilter = "all";
  let levelFilter = "all";
  let lengthFilter = "all";
  let queryFilter = "";

  function applyCourseFilters() {
    const query = queryFilter.trim().toLowerCase();
    let visible = 0;

    courseItems.forEach((item) => {
      const topic = item.getAttribute("data-topic") || "";
      const level = item.getAttribute("data-level") || "";
      const length = item.getAttribute("data-length") || "";
      const name = (item.getAttribute("data-name") || "").toLowerCase();
      const topicOk = topicFilter === "all" || topic === topicFilter;
      const levelOk = levelFilter === "all" || level === levelFilter;
      const lengthOk = lengthFilter === "all" || length === lengthFilter;
      const queryOk = !query || name.includes(query) || topic.includes(query);
      const show = topicOk && levelOk && lengthOk && queryOk;
      item.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (courseCount) {
      courseCount.textContent = `Showing ${visible} course${visible === 1 ? "" : "s"}`;
    }
    courseEmpty?.classList.toggle("d-none", visible !== 0);
  }

  courseChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      courseChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      topicFilter = chip.getAttribute("data-course-filter") || "all";
      if (searchTopic) searchTopic.value = topicFilter;
      applyCourseFilters();
    });
  });

  document.getElementById("hlSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    queryFilter = searchQuery?.value || "";
    topicFilter = searchTopic?.value || "all";
    levelFilter = searchLevel?.value || "all";
    lengthFilter = searchLength?.value || "all";
    courseChips.forEach((chip) => {
      chip.classList.toggle(
        "is-active",
        (chip.getAttribute("data-course-filter") || "all") === topicFilter
      );
    });
    applyCourseFilters();
    const parts = [];
    if (queryFilter.trim()) parts.push(`“${queryFilter.trim()}”`);
    if (topicFilter !== "all") parts.push(topicFilter);
    if (levelFilter !== "all") parts.push(levelFilter);
    if (lengthFilter !== "all") parts.push(lengthFilter);
    if (searchNote) {
      searchNote.textContent = parts.length
        ? `Filtered by ${parts.join(" · ")}. Catalog is below.`
        : "Showing the full catalog.";
    }
    document.getElementById("courses")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
    showToast("Catalog updated", "Matching studios are listed below.");
  });

  applyCourseFilters();

  function goEnroll({ course, path, instructor, plan }) {
    const coursePick = document.getElementById("hlCoursePick");
    const pathPick = document.getElementById("hlPathPick");
    const instructorPick = document.getElementById("hlInstructor");
    const planPick = document.getElementById("hlPlanPick");
    if (coursePick && course) coursePick.value = course;
    if (pathPick && path != null) pathPick.value = path;
    if (instructorPick && instructor) instructorPick.value = instructor;
    if (planPick && plan) planPick.value = plan;
    document.getElementById("enroll")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  document.querySelectorAll(".hl-enroll-course").forEach((btn) => {
    btn.addEventListener("click", () => {
      const course = btn.getAttribute("data-course") || "";
      goEnroll({ course, path: "", plan: "Studio" });
      showToast("Studio selected", `${course} is ready on the enrollment form.`);
    });
  });

  document.querySelectorAll(".hl-enroll-path").forEach((btn) => {
    btn.addEventListener("click", () => {
      const path = btn.getAttribute("data-path") || "";
      const course = btn.getAttribute("data-course") || "";
      goEnroll({ course, path, plan: "Studio" });
      showToast("Path selected", `${path} is ready on the enrollment form.`);
    });
  });

  document.querySelectorAll(".hl-ask-instructor").forEach((btn) => {
    btn.addEventListener("click", () => {
      const instructor = btn.getAttribute("data-instructor") || "";
      const course = btn.getAttribute("data-course") || "";
      goEnroll({ course, instructor, plan: "Studio" });
      showToast("Faculty noted", `${instructor} is listed on the form.`);
    });
  });

  document.querySelectorAll(".hl-pick-plan").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.getAttribute("data-plan") || "Studio";
      goEnroll({ plan });
      showToast("Plan selected", `${plan} is ready on the enrollment form.`);
    });
  });

  const billButtons = document.querySelectorAll("[data-billing]");
  const prices = document.querySelectorAll(".hl-plan-price");

  function setBilling(period) {
    billButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-billing") === period);
    });
    prices.forEach((el) => {
      const value = el.getAttribute(period === "year" ? "data-year" : "data-month") || "";
      const suffix = period === "year" ? "/ year" : "/ month";
      el.innerHTML = `${value} <span>${suffix}</span>`;
    });
  }

  billButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setBilling(btn.getAttribute("data-billing") || "month");
    });
  });

  const form = document.getElementById("hlEnrollForm");
  const note = document.getElementById("hlFormNote");

  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved && form) {
      const map = {
        hlName: saved.name,
        hlEmail: saved.email,
        hlCoursePick: saved.course,
        hlPathPick: saved.path,
        hlPlanPick: saved.plan,
        hlInstructor: saved.instructor,
        hlNotes: saved.notes,
      };
      Object.keys(map).forEach((id) => {
        const el = document.getElementById(id);
        if (el && map[id] != null && map[id] !== "") el.value = map[id];
      });
    }
  } catch (err) {
    /* ignore */
  }

  function formData() {
    return {
      name: document.getElementById("hlName")?.value || "",
      email: document.getElementById("hlEmail")?.value || "",
      course: document.getElementById("hlCoursePick")?.value || "",
      path: document.getElementById("hlPathPick")?.value || "",
      plan: document.getElementById("hlPlanPick")?.value || "",
      instructor: document.getElementById("hlInstructor")?.value || "",
      notes: document.getElementById("hlNotes")?.value || "",
    };
  }

  document.getElementById("hlSaveDraft")?.addEventListener("click", () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData()));
      showToast("Draft saved", "Your enrollment note is stored in this browser.");
      if (note) note.textContent = "Draft saved locally.";
    } catch (err) {
      showToast("Save failed", "Local storage is unavailable.");
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.reportValidity();
      if (note) note.textContent = "Please complete the required fields.";
      return;
    }
    const data = formData();
    const extra = data.path ? ` · ${data.path}` : "";
    if (note) {
      note.textContent = `Held for ${data.name} · ${data.course}${extra} · ${data.plan}.`;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      /* ignore */
    }
    form.reset();
    form.classList.remove("was-validated");
    const planPick = document.getElementById("hlPlanPick");
    if (planPick) planPick.value = "Studio";
    showToast("Enrollment sent", "Demo confirmation — connect this form to your campus desk.");
  });

  document.getElementById("hlNewsForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("hlNewsEmail");
    if (!email?.checkValidity()) {
      email?.reportValidity();
      return;
    }
    email.value = "";
    showToast("You’re on the list", "Syllabus notes will land in this inbox (demo).");
  });
})();
