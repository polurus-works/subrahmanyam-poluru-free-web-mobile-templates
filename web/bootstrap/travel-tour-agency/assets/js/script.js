/**
 * Vespera — Travel tour agency
 * Destination search, package filters, itinerary tabs, booking form, newsletter
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DRAFT_KEY = "vs-book-draft";

  const toastEl = document.getElementById("vsToast");
  const toast =
    toastEl && typeof bootstrap !== "undefined"
      ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 })
      : null;

  function showToast(title, body) {
    const titleEl = document.getElementById("vsToastTitle");
    const bodyEl = document.getElementById("vsToastBody");
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    toast?.show();
  }

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  const navbar = document.getElementById("vsNavbar");
  function updateNavbar() {
    navbar?.classList.toggle("vs-navbar-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  const navCollapseEl = document.getElementById("vsNav");
  const navCollapse = navCollapseEl
    ? bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false })
    : null;

  document.querySelectorAll('.vs-navbar a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navCollapse) navCollapse.hide();
    });
  });

  const sectionIds = [
    "home",
    "house",
    "destinations",
    "packages",
    "itineraries",
    "guides",
    "book",
    "notes",
    "desk",
    "faq",
  ];
  const navLinks = Array.from(document.querySelectorAll(".vs-navbar .nav-link"));

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

  const backTop = document.getElementById("vsBackTop");
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

  const counters = document.querySelectorAll(".vs-counter");
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

  function bindStepper(minusId, plusId, inputId, min, max) {
    const input = document.getElementById(inputId);
    document.getElementById(minusId)?.addEventListener("click", () => {
      if (!input) return;
      input.value = String(Math.max(min, Number(input.value || min) - 1));
    });
    document.getElementById(plusId)?.addEventListener("click", () => {
      if (!input) return;
      input.value = String(Math.min(max, Number(input.value || min) + 1));
    });
  }
  bindStepper("vsSearchMinus", "vsSearchPlus", "vsSearchTravelers", 1, 12);
  bindStepper("vsBookMinus", "vsBookPlus", "vsBookTravelers", 1, 12);

  const pkgChips = document.querySelectorAll("[data-pkg-filter]");
  const pkgItems = document.querySelectorAll(".vs-pkg-item");
  const pkgCount = document.getElementById("vsPkgCount");
  const pkgEmpty = document.getElementById("vsPkgEmpty");
  const pkgSearch = document.getElementById("vsPkgSearch");
  const searchPlace = document.getElementById("vsSearchPlace");
  const searchType = document.getElementById("vsSearchType");
  const searchTravelers = document.getElementById("vsSearchTravelers");
  const searchNote = document.getElementById("vsSearchNote");
  const placeButtons = document.querySelectorAll("[data-place-filter]");

  let typeFilter = "all";
  let placeFilter = "all";
  let occupancy = 1;

  function applyPkgFilters() {
    const q = (pkgSearch?.value || "").trim().toLowerCase();
    const guests = Math.max(occupancy, Number(searchTravelers?.value || 1));
    let visible = 0;

    pkgItems.forEach((item) => {
      const type = item.getAttribute("data-type");
      const place = item.getAttribute("data-place");
      const maxGuests = Number(item.getAttribute("data-guests") || "12");
      const text = item.textContent.toLowerCase();
      const typeOk = typeFilter === "all" || type === typeFilter;
      const placeOk = placeFilter === "all" || place === placeFilter;
      const guestsOk = maxGuests >= guests;
      const searchOk = !q || text.includes(q);
      const show = typeOk && placeOk && guestsOk && searchOk;
      item.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (pkgCount) {
      pkgCount.textContent = `Showing ${visible} package${visible === 1 ? "" : "s"}`;
    }
    pkgEmpty?.classList.toggle("d-none", visible !== 0);

    placeButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-place-filter") === placeFilter);
    });
  }

  function setTypeChip(value) {
    typeFilter = value || "all";
    pkgChips.forEach((chip) => {
      chip.classList.toggle("is-active", (chip.getAttribute("data-pkg-filter") || "all") === typeFilter);
    });
  }

  pkgChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      setTypeChip(chip.getAttribute("data-pkg-filter") || "all");
      if (searchType) searchType.value = typeFilter;
      applyPkgFilters();
    });
  });

  pkgSearch?.addEventListener("input", applyPkgFilters);

  placeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const place = btn.getAttribute("data-place-filter") || "all";
      placeFilter = placeFilter === place ? "all" : place;
      if (searchPlace) searchPlace.value = placeFilter;
      applyPkgFilters();
      scrollToId("packages");
      const label = placeFilter === "all" ? "All destinations" : btn.querySelector("strong")?.textContent || "that destination";
      showToast("Destination filtered", `${label} packages are on the board.`);
    });
  });

  document.getElementById("vsSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    occupancy = Number(searchTravelers?.value || 2);
    placeFilter = searchPlace?.value || "all";
    setTypeChip(searchType?.value || "all");
    const bookTravelers = document.getElementById("vsBookTravelers");
    if (bookTravelers) bookTravelers.value = String(occupancy);
    const month = document.getElementById("vsSearchMonth")?.value || "any";
    const depart = document.getElementById("vsDepart");
    if (depart && month && month !== "any") depart.value = month;
    applyPkgFilters();
    const placeLabel = searchPlace?.selectedOptions[0]?.textContent || "Anywhere";
    const typeLabel = searchType?.selectedOptions[0]?.textContent || "Any type";
    if (searchNote) {
      searchNote.textContent = `${placeLabel} · ${typeLabel} · ${occupancy} traveler${occupancy === 1 ? "" : "s"}. Packages below are filtered.`;
    }
    scrollToId("packages");
    showToast("Tours found", "Matching packages are listed below.");
  });

  applyPkgFilters();

  function showItinerary(id) {
    document.querySelectorAll("[data-itinerary-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.getAttribute("data-itinerary-panel") === id);
    });
    document.querySelectorAll("[data-itinerary-tab]").forEach((tab) => {
      const on = tab.getAttribute("data-itinerary-tab") === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-itinerary-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      showItinerary(tab.getAttribute("data-itinerary-tab") || "kyoto");
    });
  });

  document.querySelectorAll(".vs-open-itinerary").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-itinerary") || "kyoto";
      showItinerary(id);
      scrollToId("itineraries");
    });
  });

  document.querySelectorAll(".vs-book-pkg").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkg = btn.getAttribute("data-pkg") || "";
      const pick = document.getElementById("vsTripPick");
      if (pick && pkg) pick.value = pkg;
      const bookTravelers = document.getElementById("vsBookTravelers");
      if (bookTravelers && searchTravelers?.value) bookTravelers.value = searchTravelers.value;
      scrollToId("book");
      showToast("Trip selected", `${pkg} is ready on the booking form.`);
    });
  });

  const form = document.getElementById("vsBookForm");
  const note = document.getElementById("vsFormNote");

  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved && form) {
      const map = {
        vsName: saved.name,
        vsEmail: saved.email,
        vsPhone: saved.phone,
        vsTripPick: saved.trip,
        vsDepart: saved.depart,
        vsBookTravelers: saved.travelers,
        vsRoom: saved.room,
        vsOccasion: saved.occasion,
        vsNotes: saved.notes,
      };
      Object.keys(map).forEach((id) => {
        const el = document.getElementById(id);
        if (el && map[id] != null) el.value = map[id];
      });
    }
  } catch (err) {
    /* ignore */
  }

  function formData() {
    return {
      name: document.getElementById("vsName")?.value || "",
      email: document.getElementById("vsEmail")?.value || "",
      phone: document.getElementById("vsPhone")?.value || "",
      trip: document.getElementById("vsTripPick")?.value || "",
      depart: document.getElementById("vsDepart")?.value || "",
      travelers: document.getElementById("vsBookTravelers")?.value || "",
      room: document.getElementById("vsRoom")?.value || "",
      occasion: document.getElementById("vsOccasion")?.value || "",
      notes: document.getElementById("vsNotes")?.value || "",
    };
  }

  document.getElementById("vsSaveDraft")?.addEventListener("click", () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData()));
      showToast("Draft saved", "Your seat request is stored in this browser.");
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
    if (note) {
      note.textContent = `Held for ${data.name} · ${data.trip} · ${data.travelers} traveler${data.travelers === "1" ? "" : "s"} · ${data.depart}.`;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      /* ignore */
    }
    form.reset();
    form.classList.remove("was-validated");
    const guestsEl = document.getElementById("vsBookTravelers");
    if (guestsEl) guestsEl.value = "2";
    showToast("Seat requested", "Demo confirmation — connect this form to your booking desk.");
  });

  document.getElementById("vsNewsForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("vsNewsEmail");
    if (!email?.checkValidity()) {
      email?.reportValidity();
      return;
    }
    email.value = "";
    showToast("You’re on the list", "Departure notes will land in this inbox (demo).");
  });

  const weekday = new Date().getDay();
  document.querySelectorAll(".vs-hours li[data-days]").forEach((row) => {
    const days = (row.getAttribute("data-days") || "")
      .split(",")
      .map((value) => Number(value.trim()));
    if (days.includes(weekday)) row.classList.add("is-today");
  });
})();
