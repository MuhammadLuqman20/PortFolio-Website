
document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. SCROLL REVEAL ANIMATIONS
  // =========================================

  const revealSelectors = [
    ".section-header",
    ".about-card",
    ".stat-card",
    ".project-card",
    ".skill-category-card",
    ".timeline-item",
    ".highlight-card",
    ".education-card",
    ".contact-card",
    ".contact-banner"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.classList.add("reveal");

      // Short stagger between elements
      element.style.transitionDelay = `${(index % 4) * 60}ms`;

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // =========================================
  // 2. MOBILE NAVIGATION
  // =========================================

  const hamburger = document.getElementById("hamburger-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function setMobileMenu(open) {
    if (!hamburger || !mobileNav) return;

    hamburger.classList.toggle("is-active", open);
    mobileNav.classList.toggle("is-open", open);

    hamburger.setAttribute("aria-expanded", String(open));
    mobileNav.setAttribute("aria-hidden", String(!open));

    // Keep hidden menu links out of keyboard navigation
    mobileNav.inert = !open;

    document.body.classList.toggle("menu-open", open);
  }

  if (hamburger && mobileNav) {
    setMobileMenu(false);

    hamburger.addEventListener("click", () => {
      const isOpen =
        hamburger.getAttribute("aria-expanded") === "true";

      setMobileMenu(!isOpen);
    });

    // Close the menu after selecting a navigation link
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMobileMenu(false);
      });
    });

    // Close the menu with Escape
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        hamburger.getAttribute("aria-expanded") === "true"
      ) {
        setMobileMenu(false);
        hamburger.focus();
      }
    });

    // Close the mobile menu when switching to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setMobileMenu(false);
      }
    });
  }

  // =========================================
  // 3. PROJECT FILTERS
  // =========================================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      // Update selected filter button
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute(
          "aria-selected",
          String(isActive)
        );
      });

      // Show matching project cards
      projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const shouldShow =
          selectedFilter === "all" ||
          category.split(/\s+/).includes(selectedFilter);

        card.hidden = !shouldShow;

        if (shouldShow) {
          card.classList.remove("is-visible");
          card.classList.add("reveal");

          // Trigger a fresh reveal animation
          requestAnimationFrame(() => {
            card.classList.add("is-visible");
          });
        }
      });
    });
  });

  // =========================================
  // 4. COPY EMAIL TO CLIPBOARD
  // =========================================

  const copyEmailButton = document.getElementById("copy-email-btn");
  const copyText = document.getElementById("copy-text");
  const toast = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");

  let toastTimeout;

  function showToast(message) {
    if (toastMessage) {
      toastMessage.textContent = message;
    }

    if (toast) {
      toast.classList.add("show");
      toast.classList.add("visible");
      toast.setAttribute("aria-hidden", "false");

      clearTimeout(toastTimeout);

      toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.remove("visible");
        toast.setAttribute("aria-hidden", "true");
      }, 2500);
    }
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for browsers without Clipboard API support
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    temporaryInput.style.pointerEvents = "none";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const successful = document.execCommand("copy");

    temporaryInput.remove();

    if (!successful) {
      throw new Error("Clipboard copy failed");
    }
  }

  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
      const email =
        copyEmailButton.dataset.email ||
        (copyText ? copyText.textContent.trim() : "");

      if (!email) {
        showToast("Email address not found.");
        return;
      }

      try {
        await copyTextToClipboard(email);
        showToast("Email copied to clipboard!");
      } catch (error) {
        showToast("Unable to copy. Please copy the email manually.");
      }
    });
  }

  // =========================================
  // 5. AUTOMATIC FOOTER YEAR
  // =========================================

  const currentYearElement =
    document.getElementById("current-year");

  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // =========================================
  // 6. ACTIVE NAVIGATION LINK ON SCROLL
  // =========================================

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(
    ".nav-link, .mobile-nav-link"
  );

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeSectionId = entry.target.id;

            navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              const isActive = href === `#${activeSectionId}`;

              link.classList.toggle("active", isActive);

              if (isActive) {
                link.setAttribute("aria-current", "location");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
