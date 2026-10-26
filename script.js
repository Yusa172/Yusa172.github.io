(function () {
  var header = document.getElementById("header");
  var hero = document.getElementById("home");
  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");
  var progress = document.getElementById("progress");
  var rotator = document.getElementById("rotator");
  var year = document.getElementById("year");
  var copyButton = document.getElementById("copyEmail");
  var localTime = document.getElementById("localTime");
  var command = document.getElementById("command");
  var openCommand = document.getElementById("openCommand");
  var commandInput = document.getElementById("commandInput");
  var commandList = document.getElementById("commandList");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var email = "simaofiuza.cv@gmail.com";

  var commands = [
    { label: "About", hint: "What I do", href: "#services" },
    { label: "Experience", hint: "Work and education", href: "#experience" },
    { label: "Projects", hint: "Selected projects", href: "#projects" },
    { label: "Courses", hint: "Courses and certifications", href: "#courses" },
    { label: "Contact", hint: "Email and links", href: "#contact" },
    { label: "Open CV", hint: "PDF resume", href: "cv_simão.pdf", external: true },
    { label: "Market power & pricing study", hint: "CS2 skins market", href: "https://github.com/Yusa172/csgo-steam-market-volatility-analysis", external: true },
    { label: "VaR calculator", hint: "GitHub", href: "https://github.com/Yusa172/Portfolio-Value-at-Risk-Calculator", external: true },
    { label: "Study Clock", hint: "Open the app", href: "https://yusa172.github.io/Study-clock/", external: true },
    { label: "GitHub", hint: "Yusa172", href: "https://github.com/Yusa172", external: true },
    { label: "LinkedIn", hint: "Professional profile", href: "https://www.linkedin.com/in/sim%C3%A3o-fi%C3%BAza", external: true },
    { label: "Copy email", hint: email, action: copyEmail }
  ];
  var activeIndex = 0;

  function updateHeader() {
    var heroEnd = hero.offsetHeight - header.offsetHeight;
    header.classList.toggle("is-solid", window.scrollY > heroEnd || nav.classList.contains("is-open"));
  }

  function updateProgress() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  }

  function onScroll() {
    updateHeader();
    updateProgress();
  }

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    updateHeader();
  }

  // Types and deletes each phrase in turn after the hero intro finishes.
  // Text changes in place, so it also runs when reduced motion is requested.
  function startRotator() {
    if (!rotator) return;
    var phrases = ["financial models", "funding applications", "data analysis in R", "risk tools in Python"];
    var phraseIndex = 0;
    var text = phrases[0];
    var deleting = true;

    function tick() {
      var target = phrases[phraseIndex];
      if (deleting) {
        text = text.slice(0, -1);
        if (!text) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      } else {
        text = target.slice(0, text.length + 1);
      }
      rotator.textContent = text;

      var delay = deleting ? 40 : 75;
      if (!deleting && text === phrases[phraseIndex]) {
        deleting = true;
        delay = 2200;
      }
      window.setTimeout(tick, delay);
    }

    window.setTimeout(tick, 2600);
  }

  function countUp(element) {
    var target = Number(element.dataset.count);
    var suffix = element.dataset.suffix || "";
    var start = performance.now();

    function frame(now) {
      var t = Math.min(1, (now - start) / 1000);
      var eased = 1 - Math.pow(1 - t, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    element.textContent = "0" + suffix;
    requestAnimationFrame(frame);
  }

  // Histogram of simulated daily returns; bars left of the VaR cut-off form the tail.
  function drawVarChart() {
    var group = document.querySelector(".var-bars");
    if (!group) return;
    var bins = 36;
    var left = 48;
    var width = 704;
    var base = 330;
    var barWidth = width / bins;
    var cutX = 196;
    var ns = "http://www.w3.org/2000/svg";

    for (var i = 0; i < bins; i++) {
      var x = (i - bins * 0.55) / (bins * 0.17);
      var density = Math.exp(-x * x / 2) + 0.06 * Math.exp(-Math.pow(x + 2.6, 2) / 0.5);
      var height = Math.max(4, density * 260);
      var rect = document.createElementNS(ns, "rect");
      var rx = left + i * barWidth;
      rect.setAttribute("x", rx.toFixed(1));
      rect.setAttribute("y", (base - height).toFixed(1));
      rect.setAttribute("width", (barWidth - 3).toFixed(1));
      rect.setAttribute("height", height.toFixed(1));
      rect.style.transitionDelay = i * 18 + "ms";
      if (rx + barWidth <= cutX + 1) rect.setAttribute("class", "is-tail");
      group.appendChild(rect);
    }
  }

  function observe() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    var chart = document.querySelector(".var-chart");

    // Cards that share a parent come in one after another.
    reveals.forEach(function (item) {
      var siblings = Array.prototype.filter.call(item.parentNode.children, function (el) {
        return el.classList.contains("reveal");
      });
      item.style.setProperty("--delay", Math.min(siblings.indexOf(item), 4) * 110 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (item) { item.classList.add("is-visible"); });
      if (chart) chart.classList.add("is-drawn");
      return;
    }

    if (reduceMotion) {
      reveals.forEach(function (item) { item.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (item) { revealObserver.observe(item); });
    }

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (item) { countObserver.observe(item); });

    if (chart) {
      var chartObserver = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        chart.classList.add("is-drawn");
        chartObserver.disconnect();
      }, { threshold: 0.35 });
      chartObserver.observe(chart);
    }

    // Underline the nav link of the section in view.
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });
  }

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(markCopied, markCopied);
    } else {
      markCopied();
    }
  }

  function markCopied() {
    if (!copyButton) return;
    copyButton.textContent = "Copied";
    window.setTimeout(function () { copyButton.textContent = "Copy email"; }, 1500);
  }

  function updateLocalTime() {
    if (!localTime) return;
    localTime.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  function openCommandMenu() {
    command.hidden = false;
    commandInput.value = "";
    activeIndex = 0;
    renderCommands(commands);
    window.setTimeout(function () { commandInput.focus(); }, 0);
  }

  function closeCommandMenu() {
    command.hidden = true;
  }

  function filteredCommands() {
    var query = commandInput.value.trim().toLowerCase();
    if (!query) return commands;
    return commands.filter(function (item) {
      return (item.label + " " + item.hint).toLowerCase().indexOf(query) !== -1;
    });
  }

  function renderCommands(items) {
    commandList.textContent = "";
    items.forEach(function (item, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "command-item" + (index === activeIndex ? " is-active" : "");
      var label = document.createElement("strong");
      label.textContent = item.label;
      var hint = document.createElement("span");
      hint.textContent = item.hint;
      button.appendChild(label);
      button.appendChild(hint);
      button.addEventListener("click", function () { runCommand(item); });
      commandList.appendChild(button);
    });
    if (!items.length) {
      var empty = document.createElement("div");
      empty.className = "command-item";
      empty.textContent = "No matches";
      commandList.appendChild(empty);
    }
  }

  function runCommand(item) {
    closeCommandMenu();
    if (item.action) {
      item.action();
    } else if (item.external) {
      window.open(item.href, "_blank", "noopener");
    } else {
      document.querySelector(item.href).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") setMenu(false);
  });

  openCommand.addEventListener("click", openCommandMenu);
  if (copyButton) copyButton.addEventListener("click", copyEmail);

  command.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-command")) closeCommandMenu();
  });

  commandInput.addEventListener("input", function () {
    activeIndex = 0;
    renderCommands(filteredCommands());
  });

  document.addEventListener("keydown", function (event) {
    var typing = event.target instanceof Element && event.target.matches("input, textarea");
    if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      openCommandMenu();
      return;
    }

    if (event.key === "Escape") {
      closeCommandMenu();
      setMenu(false);
      return;
    }

    if (!command.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter")) {
      var items = filteredCommands();
      if (!items.length) return;
      event.preventDefault();
      if (event.key === "ArrowDown") activeIndex = (activeIndex + 1) % items.length;
      if (event.key === "ArrowUp") activeIndex = (activeIndex - 1 + items.length) % items.length;
      if (event.key === "Enter") {
        runCommand(items[activeIndex]);
        return;
      }
      renderCommands(items);
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  if (year) year.textContent = String(new Date().getFullYear());
  updateLocalTime();
  window.setInterval(updateLocalTime, 30000);
  drawVarChart();
  observe();
  startRotator();
  onScroll();
})();
