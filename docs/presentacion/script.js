const navLinks = Array.from(document.querySelectorAll(".topnav a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const logoImage = document.querySelector("[data-logo]");
const logoBox = document.querySelector("[data-logo-box]");
const shotContainers = Array.from(document.querySelectorAll("[data-shot]"));

const sectionById = new Map(sections.map((section) => [section.id, section]));

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16 }
);

for (const item of revealItems) {
  revealObserver.observe(item);
}

if (logoImage && logoBox) {
  const logoCandidates = [
    "https://i.ytimg.com/vi/7VRep6FNeIg/maxresdefault.jpg",
    "./assets/crunchyroll-logo.png",
    "./assets/crunchyroll-logo.webp",
    "./assets/crunchyroll-logo.jpg",
    "./assets/crunchyroll-logo.jpeg",
    "./assets/crunchyroll.png",
    "./assets/logo-crunchyroll.png",
    "./assets/logo.png",
    "./assets/kernel-logo.png",
    "./assets/kernel-logo.webp",
    "./assets/kernel-logo.jpg",
    "./assets/kernel-logo.jpeg"
  ];

  const tryLogoAt = (index) => {
    if (index >= logoCandidates.length) {
      return;
    }

    logoImage.src = logoCandidates[index];
  };

  logoImage.addEventListener("load", () => {
    logoBox.classList.add("has-logo");
  });

  logoImage.addEventListener("error", () => {
    const currentIndex = logoCandidates.indexOf(logoImage.getAttribute("src") ?? "");
    const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
    tryLogoAt(nextIndex);
  });

  tryLogoAt(0);
}

for (const container of shotContainers) {
  const image = container.querySelector("img");
  if (!image) {
    continue;
  }

  image.addEventListener("load", () => {
    container.classList.add("is-loaded");
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    const activeId = visible.target.id;
    for (const link of navLinks) {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
    }
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.2, 0.4, 0.6]
  }
);

for (const section of sections) {
  sectionObserver.observe(section);
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  const activeLink = navLinks.find((link) => link.classList.contains("is-active"));
  const activeId = activeLink?.getAttribute("href")?.replace("#", "") ?? sections[0]?.id;
  if (!activeId) {
    return;
  }

  const activeIndex = sections.findIndex((section) => section.id === activeId);
  if (activeIndex < 0) {
    return;
  }

  const nextIndex =
    event.key === "ArrowDown"
      ? Math.min(activeIndex + 1, sections.length - 1)
      : Math.max(activeIndex - 1, 0);

  const target = sections[nextIndex];
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

for (const link of navLinks) {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (!id) {
      return;
    }

    const target = sectionById.get(id);
    if (!target) {
      return;
    }

    for (const item of navLinks) {
      item.classList.remove("is-active");
    }
    link.classList.add("is-active");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
