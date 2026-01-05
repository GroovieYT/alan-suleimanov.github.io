(function () {
  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Active nav state
  var path = window.location.pathname || "/";
  var links = document.querySelectorAll("[data-nav]");
  links.forEach(function (a) {
    var href = a.getAttribute("data-nav");
    if (!href) return;
    if (href === path || (href !== "/" && path.endsWith(href))) {
      a.classList.add("is-active");
    }
  });

  // Mobile menu toggle
  var btn = document.querySelector(".menuBtn");
  var mobile = document.querySelector(".mobileNav");
  if (btn && mobile) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      mobile.hidden = open;
    });
  }

  // Resources search + tag filter
  var search = document.querySelector("[data-search]");
  var tagBtns = document.querySelectorAll("[data-tag]");
  var cards = document.querySelectorAll("[data-resource-card]");
  var activeTag = "all";

  function applyFilter() {
    var q = (search && search.value ? search.value : "").toLowerCase().trim();

    cards.forEach(function (card) {
      var title = (card.getAttribute("data-title") || "").toLowerCase();
      var desc = (card.getAttribute("data-desc") || "").toLowerCase();
      var tags = (card.getAttribute("data-tags") || "").toLowerCase();

      var tagOk = activeTag === "all" || tags.indexOf(activeTag) !== -1;
      var qOk = !q || title.indexOf(q) !== -1 || desc.indexOf(q) !== -1 || tags.indexOf(q) !== -1;

      card.style.display = (tagOk && qOk) ? "" : "none";
    });
  }

  if (search) search.addEventListener("input", applyFilter);

  tagBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      tagBtns.forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      activeTag = b.getAttribute("data-tag") || "all";
      applyFilter();
    });
  });

  // Contact form (client-side validation + success panel)
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // clear errors
      form.querySelectorAll("[data-error]").forEach(function (el) { el.textContent = ""; });

      function val(id) {
        var el = form.querySelector("#" + id);
        return el ? String(el.value || "").trim() : "";
      }
      function setErr(id, msg) {
        var el = form.querySelector('[data-error-for="' + id + '"]');
        if (el) el.textContent = msg;
      }

      var first = val("firstName");
      var last = val("lastName");
      var email = val("email");
      var interest = val("interest");
      var message = val("message");

      var ok = true;
      if (!first) { setErr("firstName", "First name is required."); ok = false; }
      if (!last) { setErr("lastName", "Last name is required."); ok = false; }

      if (!email) { setErr("email", "Email is required."); ok = false; }
      else if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("email", "Please enter a valid email."); ok = false; }

      if (!interest) { setErr("interest", "Please select an interest."); ok = false; }
      if (!message || message.length < 20) { setErr("message", "Please add a short message (20+ characters)."); ok = false; }

      if (!ok) return;

      // success state (no backend on GH Pages)
      var success = document.querySelector("[data-contact-success]");
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      form.reset();
    });
  }
})();

