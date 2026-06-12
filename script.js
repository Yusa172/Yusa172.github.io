(function () {
  var root = document.documentElement;
  var body = document.body;
  var progress = document.getElementById("progress");
  var themeToggle = document.getElementById("themeToggle");
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  var copyEmail = document.getElementById("copyEmail");
  var localTime = document.getElementById("localTime");
  var year = document.getElementById("year");
  var command = document.getElementById("command");
  var openCommand = document.getElementById("openCommand");
  var commandInput = document.getElementById("commandInput");
  var commandList = document.getElementById("commandList");
  var email = "simaofiuza1@gmail.com";

  var fallbackRepos = [
    {
      name: "csgo-steam-market-volatility-analysis",
      full_name: "Yusa172/csgo-steam-market-volatility-analysis",
      description: "Steam Market price-history collection and volatility analysis for CS2 digital assets.",
      html_url: "https://github.com/Yusa172/csgo-steam-market-volatility-analysis",
      language: "R",
      stargazers_count: 0,
      forks_count: 0,
      pushed_at: "2026-05-15T16:03:09Z"
    }
  ];

  var commands = [
    { label: "About", hint: "Profile and summary", href: "#about" },
    { label: "Focus", hint: "Economics, data and markets", href: "#focus" },
    { label: "Projects", hint: "Featured work", href: "#projects" },
    { label: "Courses", hint: "Additional training", href: "#courses" },
    { label: "Skills", hint: "Tools and education", href: "#skills" },
    { label: "Contact", hint: "Email and links", href: "#contact" },
    { label: "Open CV", hint: "PDF resume", href: "CV.pdf", external: true },
    { label: "GitHub", hint: "Yusa172 repositories", href: "https://github.com/Yusa172", external: true },
    { label: "LinkedIn", hint: "Professional profile", href: "https://www.linkedin.com/in/sim%C3%A3o-fi%C3%BAza", external: true },
    { label: "Copy email", hint: email, action: copyEmailAddress },
    { label: "Toggle theme", hint: "Light or dark mode", action: toggleTheme }
  ];
  var activeCommandIndex = 0;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("simao-portfolio-theme-v3", theme);
    } catch (error) {}
  }

  function toggleTheme() {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }

  function updateProgress() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  }

  function toggleMenu(force) {
    var willOpen = typeof force === "boolean" ? force : !navLinks.classList.contains("is-open");
    navLinks.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    body.classList.toggle("menu-open", willOpen);
  }

  function copyEmailAddress() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(markCopied).catch(markCopied);
    } else {
      markCopied();
    }
  }

  function markCopied() {
    if (!copyEmail) return;
    var original = copyEmail.textContent;
    copyEmail.textContent = "Copied";
    window.setTimeout(function () {
      copyEmail.textContent = original;
    }, 1500);
  }

  function updateLocalTime() {
    if (!localTime) return;
    localTime.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  function revealOnScroll() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function animateMetrics() {
    var metrics = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!("IntersectionObserver" in window)) {
      metrics.forEach(setFinalMetric);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countMetric(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });

    metrics.forEach(function (metric) {
      observer.observe(metric);
    });
  }

  function setFinalMetric(element) {
    element.textContent = Number(element.dataset.count).toLocaleString("en-US") + (element.dataset.suffix || "");
  }

  function countMetric(element) {
    var target = Number(element.dataset.count || 0);
    var suffix = element.dataset.suffix || "";
    var start = performance.now();
    var duration = target > 1000 ? 1100 : 820;

    function frame(now) {
      var progressValue = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - progressValue, 3);
      var value = Math.round(target * eased);
      element.textContent = value.toLocaleString("en-US") + suffix;
      if (progressValue < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function openCommandMenu() {
    command.hidden = false;
    commandInput.value = "";
    activeCommandIndex = 0;
    renderCommands(commands);
    window.setTimeout(function () {
      commandInput.focus();
    }, 0);
  }

  function closeCommandMenu() {
    command.hidden = true;
  }

  function renderCommands(items) {
    commandList.textContent = "";

    items.forEach(function (item, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "command-item" + (index === activeCommandIndex ? " is-active" : "");

      var label = document.createElement("strong");
      label.textContent = item.label;
      var hint = document.createElement("span");
      hint.textContent = item.hint || "";

      button.appendChild(label);
      button.appendChild(hint);
      button.addEventListener("click", function () {
        runCommand(item);
      });
      commandList.appendChild(button);
    });

    if (!items.length) {
      var empty = document.createElement("div");
      empty.className = "command-item";
      empty.textContent = "No matches";
      commandList.appendChild(empty);
    }
  }

  function filteredCommands() {
    var query = commandInput.value.trim().toLowerCase();
    if (!query) return commands;
    return commands.filter(function (item) {
      return (item.label + " " + (item.hint || "")).toLowerCase().includes(query);
    });
  }

  function runCommand(item) {
    closeCommandMenu();

    if (item.action) {
      item.action();
      return;
    }

    if (item.external) {
      window.open(item.href, "_blank", "noopener");
      return;
    }

    document.querySelector(item.href).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function createRepoCard(repo) {
    var card = document.createElement("a");
    card.className = "repo-card";
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener";

    var title = document.createElement("h4");
    title.textContent = repo.name;

    var desc = document.createElement("p");
    desc.textContent = repo.description || "Public repository by Simão Fiúza.";

    var meta = document.createElement("div");
    meta.className = "repo-meta";

    var language = document.createElement("span");
    language.textContent = repo.language || "Code";
    var stars = document.createElement("span");
    stars.textContent = "Stars " + (repo.stargazers_count || 0);
    var forks = document.createElement("span");
    forks.textContent = "Forks " + (repo.forks_count || 0);

    meta.appendChild(language);
    meta.appendChild(stars);
    meta.appendChild(forks);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    return card;
  }

  function renderRepos(repos) {
    var repoGrid = document.getElementById("repoGrid");
    if (!repoGrid) return;
    repoGrid.textContent = "";

    repos
      .filter(function (repo) {
        return !repo.fork && repo.name !== "Yusa172";
      })
      .sort(function (a, b) {
        return new Date(b.pushed_at || b.updated_at || 0) - new Date(a.pushed_at || a.updated_at || 0);
      })
      .slice(0, 6)
      .forEach(function (repo) {
        repoGrid.appendChild(createRepoCard(repo));
      });
  }

  function loadRepos() {
    fetch("https://api.github.com/users/Yusa172/repos?sort=updated&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("GitHub request failed");
        return response.json();
      })
      .then(renderRepos)
      .catch(function () {
        renderRepos(fallbackRepos);
      });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (menuToggle) menuToggle.addEventListener("click", function () { toggleMenu(); });
  if (copyEmail) copyEmail.addEventListener("click", copyEmailAddress);
  if (openCommand) openCommand.addEventListener("click", openCommandMenu);

  navLinks.addEventListener("click", function (event) {
    if (event.target.tagName === "A") toggleMenu(false);
  });

  document.addEventListener("click", function (event) {
    if (event.target.matches("[data-close-command]")) closeCommandMenu();
  });

  document.addEventListener("keydown", function (event) {
    if ((event.key === "/" && !event.target.matches("input, textarea")) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      openCommandMenu();
    }

    if (event.key === "Escape") {
      closeCommandMenu();
      toggleMenu(false);
    }

    if (!command.hidden && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter")) {
      var items = filteredCommands();
      if (!items.length) return;
      if (event.key === "ArrowDown") activeCommandIndex = (activeCommandIndex + 1) % items.length;
      if (event.key === "ArrowUp") activeCommandIndex = (activeCommandIndex - 1 + items.length) % items.length;
      if (event.key === "Enter") runCommand(items[activeCommandIndex]);
      event.preventDefault();
      renderCommands(items);
    }
  });

  if (commandInput) {
    commandInput.addEventListener("input", function () {
      activeCommandIndex = 0;
      renderCommands(filteredCommands());
    });
  }

  if (year) year.textContent = String(new Date().getFullYear());
  updateLocalTime();
  window.setInterval(updateLocalTime, 30000);
  revealOnScroll();
  animateMetrics();
  loadRepos();
})();
