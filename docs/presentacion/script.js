const navLinks = Array.from(document.querySelectorAll(".topnav a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const logoImage = document.querySelector("[data-logo]");
const logoBox = document.querySelector("[data-logo-box]");
const shotContainers = Array.from(document.querySelectorAll("[data-shot]"));

const sectionById = new Map(sections.map((section) => [section.id, section]));

function getHeaderOffset() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) {
    return 0;
  }

  return topbar.getBoundingClientRect().height + 10;
}

function scrollToSection(section) {
  const top = window.scrollY + section.getBoundingClientRect().top - getHeaderOffset();
  window.scrollTo({ top, behavior: "smooth" });
}

function resolveNavSectionId(sectionId) {
  if (navLinks.some((link) => link.getAttribute("href") === `#${sectionId}`)) {
    return sectionId;
  }

  // Map internal sections (without nav tab) to the nearest logical tab.
  if (sectionId === "decoradores") {
    return "temas";
  }
  if (sectionId === "cierre") {
    return "demo";
  }

  return null;
}

function setActiveNavBySection(sectionId) {
  const navSectionId = resolveNavSectionId(sectionId);
  if (!navSectionId) {
    return;
  }

  for (const link of navLinks) {
    const isActive = link.getAttribute("href") === `#${navSectionId}`;
    link.classList.toggle("is-active", isActive);
  }
}

function getCurrentSectionIndex() {
  const anchorY = window.scrollY + getHeaderOffset() + 20;
  let currentIndex = 0;

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    if (!section) {
      continue;
    }

    const sectionTop = section.offsetTop;
    if (sectionTop <= anchorY) {
      currentIndex = index;
    }
  }

  return currentIndex;
}

function updateActiveNavFromScroll() {
  const currentIndex = getCurrentSectionIndex();
  const currentSection = sections[currentIndex];
  if (!currentSection) {
    return;
  }

  setActiveNavBySection(currentSection.id);
}

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

let scrollRafId = 0;
window.addEventListener(
  "scroll",
  () => {
    if (scrollRafId) {
      return;
    }

    scrollRafId = window.requestAnimationFrame(() => {
      updateActiveNavFromScroll();
      scrollRafId = 0;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveNavFromScroll);

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  event.preventDefault();
  const activeIndex = getCurrentSectionIndex();

  const nextIndex =
    event.key === "ArrowDown"
      ? Math.min(activeIndex + 1, sections.length - 1)
      : Math.max(activeIndex - 1, 0);

  const target = sections[nextIndex];
  if (!target) {
    return;
  }

  scrollToSection(target);
});

for (const link of navLinks) {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const id = link.getAttribute("href")?.replace("#", "");
    if (!id) {
      return;
    }

    const target = sectionById.get(id);
    if (!target) {
      return;
    }

    setActiveNavBySection(id);
    scrollToSection(target);
  });
}

updateActiveNavFromScroll();
