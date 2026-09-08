/**
 * Quill — Student LMS portal
 * View routing, filters, assignment submit, messages, toasts
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const titles = {
    dashboard: "Dashboard",
    courses: "Courses",
    assignments: "Assignments",
    grades: "Grades",
    progress: "Progress",
    schedule: "Schedule",
    messages: "Messages",
  };

  const toastEl = document.getElementById("qlToast");
  let toastTimer;

  function showToast(title, body) {
    const titleEl = document.getElementById("qlToastTitle");
    const bodyEl = document.getElementById("qlToastBody");
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    toastEl?.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl?.classList.remove("is-visible"), 3200);
  }

  const sidebar = document.getElementById("qlSidebar");
  const overlay = document.getElementById("qlOverlay");

  function setSidebar(open) {
    sidebar?.classList.toggle("is-open", open);
    overlay?.classList.toggle("is-visible", open);
    document.body.style.overflow = open && window.innerWidth < 1024 ? "hidden" : "";
  }

  document.getElementById("qlMenuBtn")?.addEventListener("click", () => setSidebar(true));
  document.getElementById("qlSidebarClose")?.addEventListener("click", () => setSidebar(false));
  overlay?.addEventListener("click", () => setSidebar(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebar(false);
  });

  const views = Array.from(document.querySelectorAll(".ql-view"));
  const navLinks = Array.from(document.querySelectorAll(".ql-nav-link[data-view]"));
  const crumb = document.getElementById("qlCrumb");

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
      const course = btn.getAttribute("data-assign-course");
      showView(name);
      if (name === "assignments" && course) {
        assignCourse = course;
        assignFilter = "all";
        document.querySelectorAll("[data-assign-filter]").forEach((chip) => {
          chip.classList.toggle("is-active", chip.getAttribute("data-assign-filter") === "all");
        });
        applyAssignFilters();
      }
    });
  });

  window.addEventListener("hashchange", () => {
    showView(window.location.hash.replace("#", ""));
  });
  showView(window.location.hash.replace("#", "") || "dashboard");

  const clock = document.getElementById("qlClock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    clock.textContent = fmt.format(new Date());
  }

  const courseChips = document.querySelectorAll("[data-course-filter]");
  const courseItems = document.querySelectorAll(".ql-course");
  const courseCount = document.getElementById("qlCourseCount");
  const courseEmpty = document.getElementById("qlCourseEmpty");
  let courseFilter = "all";

  function applyCourseFilters(query) {
    const q = (query || "").trim().toLowerCase();
    let visible = 0;
    courseItems.forEach((item) => {
      const status = item.getAttribute("data-status");
      const name = (item.getAttribute("data-name") || "").toLowerCase();
      const statusOk = courseFilter === "all" || status === courseFilter;
      const queryOk = !q || name.includes(q) || item.textContent.toLowerCase().includes(q);
      const show = statusOk && queryOk;
      item.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (courseCount) courseCount.textContent = `Showing ${visible} course${visible === 1 ? "" : "s"}`;
    if (courseEmpty) courseEmpty.hidden = visible !== 0;
  }

  courseChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      courseFilter = chip.getAttribute("data-course-filter") || "all";
      courseChips.forEach((c) => c.classList.toggle("is-active", c === chip));
      applyCourseFilters(document.getElementById("qlTopSearch")?.value);
    });
  });

  const assignChips = document.querySelectorAll("[data-assign-filter]");
  const assignRows = document.querySelectorAll("#qlAssignBody tr");
  const assignCount = document.getElementById("qlAssignCount");
  const assignEmpty = document.getElementById("qlAssignEmpty");
  const dueBadge = document.getElementById("qlDueBadge");
  let assignFilter = "all";
  let assignCourse = "all";

  function dueCount() {
    return Array.from(assignRows).filter((row) => {
      const status = row.getAttribute("data-status");
      return status === "due" || status === "overdue";
    }).length;
  }

  function applyAssignFilters(query) {
    const q = (query || "").trim().toLowerCase();
    let visible = 0;
    assignRows.forEach((row) => {
      const status = row.getAttribute("data-status");
      const course = row.getAttribute("data-course");
      const name = (row.getAttribute("data-name") || "").toLowerCase();
      const statusOk = assignFilter === "all" || status === assignFilter;
      const courseOk = assignCourse === "all" || course === assignCourse;
      const queryOk = !q || name.includes(q) || row.textContent.toLowerCase().includes(q);
      const show = statusOk && courseOk && queryOk;
      row.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (assignCount) {
      assignCount.textContent = `Showing ${visible} assignment${visible === 1 ? "" : "s"}`;
    }
    if (assignEmpty) assignEmpty.hidden = visible !== 0;
    if (dueBadge) dueBadge.textContent = String(dueCount());
  }

  assignChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      assignFilter = chip.getAttribute("data-assign-filter") || "all";
      assignCourse = "all";
      assignChips.forEach((c) => c.classList.toggle("is-active", c === chip));
      applyAssignFilters(document.getElementById("qlTopSearch")?.value);
    });
  });

  document.querySelectorAll(".ql-submit-work").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const name = btn.getAttribute("data-work") || "Assignment";
      if (!row) return;
      row.setAttribute("data-status", "submitted");
      const statusCell = row.querySelector(".ql-status");
      if (statusCell) {
        statusCell.className = "ql-status is-done";
        statusCell.textContent = "Submitted";
      }
      btn.replaceWith(Object.assign(document.createElement("span"), { textContent: "In" }));
      applyAssignFilters(document.getElementById("qlTopSearch")?.value);
      showToast("Work submitted", `${name} is with faculty (demo).`);
    });
  });

  document.querySelectorAll("[data-open-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const course = btn.getAttribute("data-open-course");
      const card = document.querySelector(`.ql-course[data-course="${course}"]`);
      const name = card?.getAttribute("data-name") || "Studio";
      showView("assignments");
      assignCourse = course || "all";
      assignFilter = "all";
      document.querySelectorAll("[data-assign-filter]").forEach((chip) => {
        chip.classList.toggle("is-active", chip.getAttribute("data-assign-filter") === "all");
      });
      applyAssignFilters();
      showToast("Studio opened", `${name} work is on the board.`);
    });
  });

  const threads = {
    maya: {
      kicker: "Maya Poluru · Product Sense",
      title: "Thursday critique",
      body: "Leela — rewrite the brief to one sentence. If it needs a slide, it is not ready. See you at 16:00.",
      placeholder: "Reply to Maya Poluru…",
    },
    anika: {
      kicker: "Anika Poluru · Campus desk",
      title: "Advisor hour",
      body: "Office hour is Friday 10:00. If you need a path change, write before Thursday so I can still move a seat.",
      placeholder: "Reply to Anika Poluru…",
    },
    subbu: {
      kicker: "Subbu Poluru · Shipping Leadership",
      title: "Staff memo",
      body: "One page. I will stop at a page. Put the decision in the first four lines.",
      placeholder: "Reply to Subbu Poluru…",
    },
  };

  document.querySelectorAll("[data-thread]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-thread]").forEach((el) => el.classList.toggle("is-active", el === btn));
      const thread = threads[btn.getAttribute("data-thread") || "maya"];
      const panel = document.getElementById("qlThread");
      if (!thread || !panel) return;
      panel.querySelector(".ql-kicker").textContent = thread.kicker;
      panel.querySelector("h2").textContent = thread.title;
      panel.querySelector("p").textContent = thread.body;
      const reply = document.getElementById("qlReply");
      if (reply) reply.placeholder = thread.placeholder;
    });
  });

  document.getElementById("qlReplyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const reply = document.getElementById("qlReply");
    if (!reply?.checkValidity()) {
      reply?.reportValidity();
      return;
    }
    reply.value = "";
    showToast("Reply sent", "Demo only — connect this to campus mail.");
  });

  document.getElementById("qlTopSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = document.getElementById("qlTopSearch")?.value || "";
    showView("courses");
    applyCourseFilters(q);
    applyAssignFilters(q);
    showToast("Search", q.trim() ? `Filtered for “${q.trim()}”.` : "Showing the full desk.");
  });

  document.getElementById("qlBellBtn")?.addEventListener("click", () => {
    showView("messages");
    showToast("Inbox", "Two notes from faculty.");
  });

  document.getElementById("qlTranscriptBtn")?.addEventListener("click", () => {
    showToast("Transcript", "PDF download is a demo in this template.");
  });

  applyCourseFilters();
  applyAssignFilters();

  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
