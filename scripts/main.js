/**
 * Swine Tech - Main JavaScript
 * Handles carousel, animations, and interactive elements
 */

"use strict";

(function () {
  "use strict";

  // ============================================
  // CELL ANIMATION
  // ============================================
  function initCellAnimation() {
    const cellContainer = document.getElementById("cellAnimation");
    if (!cellContainer) return;

    const container = cellContainer.querySelector(".cell-animation__container");
    if (!container) return;

    // Clear any existing cells first
    container.innerHTML = "";

    // Load all 7 blue cells in a tight, organic cluster
    const cellCount = 7;

    // Define varying sizes for cells (in pixels) - matching reference image exactly
    // Z-index values ensure proper layering: higher = in front
    const cellSizes = [
      { width: 100, height: 100, zIndex: 4 }, // Cell 1
      { width: 85, height: 85, zIndex: 3 }, // Cell 2
      { width: 229, height: 207, zIndex: 0 }, // Cell 3
      { width: 62, height: 60, zIndex: 6 }, // Cell 4
      { width: 128, height: 144, zIndex: 20 }, // Cell 5
      { width: 222, height: 208, zIndex: 3 }, // Cell 6
      { width: 134, height: 120, zIndex: 4 }, // Cell 7
    ];

    // Define tightly grouped positions - matching reference image exactly
    // Positions based on reference: cells tightly clustered with precise x,y coordinates
    // Reference shows: large center cell with others arranged around it
    const positions = [
      { left: "69.9%", top: "12.1%" }, // Cell 1
      { left: "26.4%", top: "8.4%" }, // Cell 2
      { left: "34.9%", top: "24.9%" }, // Cell 3
      { left: "43.6%", top: "37.9%" }, // Cell 4
      { left: "32.6%", top: "62.6%" }, // Cell 5
      { left: "75.4%", top: "46.6%" }, // Cell 6
      { left: "54.4%", top: "84.4%" }, // Cell 7
    ];

    // Store wrappers globally for drag functionality
    window.cellWrappers = [];

    // Function to toggle cell color between blue and red
    function toggleCellColor(cellIndex, cellImg, wrapper) {
      const cellData = window.cellWrappers[cellIndex];
      if (!cellData) return;

      // Toggle state
      cellData.isRed = !cellData.isRed;

      // Add animation effect
      cellImg.style.opacity = "0";
      cellImg.style.transform = "scale(0.8)";

      setTimeout(() => {
        // Switch image source
        if (cellData.isRed) {
          cellImg.src = `assets/Section 4/Red Cells/Cell_${cellIndex + 1}.png`;
          cellImg.classList.add("cell-red");
          cellImg.classList.remove("cell-blue");
        } else {
          cellImg.src = `assets/Section 4/Blue Cells/Cell_${cellIndex + 1}.png`;
          cellImg.classList.add("cell-blue");
          cellImg.classList.remove("cell-red");
        }

        // Animate back
        cellImg.style.opacity = "1";
        cellImg.style.transform = "scale(1)";
      }, 200);

      console.log(
        `Cell ${cellIndex + 1} switched to ${cellData.isRed ? "RED" : "BLUE"}`
      );
    }

    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("img");
      cell.src = `assets/Section 4/Blue Cells/Cell_${i + 1}.png`;
      cell.alt = "";
      cell.className = "cell-animation__cell cell-blue";
      cell.style.animationDelay = `${i * 0.15}s`;

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.width = `${cellSizes[i].width}px`;
      wrapper.style.height = `${cellSizes[i].height}px`;
      wrapper.style.left = positions[i].left;
      wrapper.style.top = positions[i].top;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.zIndex = cellSizes[i].zIndex;
      wrapper.style.cursor = "pointer";
      wrapper.setAttribute("data-cell-index", i);
      wrapper.setAttribute("data-cell-number", i + 1);

      cell.style.width = "100%";
      cell.style.height = "100%";
      cell.style.objectFit = "contain";
      cell.style.pointerEvents = "none"; // Prevent image from interfering with click
      cell.style.transition = "opacity 0.4s ease, transform 0.4s ease";

      wrapper.appendChild(cell);
      container.appendChild(wrapper);

      // Store wrapper reference
      window.cellWrappers.push({
        wrapper: wrapper,
        cell: cell,
        index: i,
        cellNumber: i + 1,
        originalSize: cellSizes[i],
        isRed: false, // Track state
      });

      // Add click functionality to toggle cell color
      wrapper.addEventListener("click", () => {
        toggleCellColor(i, cell, wrapper);
      });
    }

    // Add "CLICK TO SPRAY" text with ripple background effect (centered where pointer was)
    const clickPromptWrapper = document.createElement("div");
    clickPromptWrapper.className = "cell-animation__click-prompt-wrapper";
    clickPromptWrapper.style.position = "absolute";
    clickPromptWrapper.style.left = "50%";
    clickPromptWrapper.style.top = "50%";
    clickPromptWrapper.style.transform = "translate(-40%, -50%)"; // Moved right by adjusting from -50% to -40%
    clickPromptWrapper.style.zIndex = "100"; // Higher than cell z-index (max is 20) to appear in front
    clickPromptWrapper.style.pointerEvents = "none";
    clickPromptWrapper.style.display = "flex";
    clickPromptWrapper.style.alignItems = "center";
    clickPromptWrapper.style.justifyContent = "center";

    // Create ripple background circles
    for (let i = 0; i < 3; i++) {
      const ripple = document.createElement("div");
      ripple.className = `cell-animation__ripple cell-animation__ripple--${
        i + 1
      }`;
      ripple.style.position = "absolute";
      ripple.style.width = "200px";
      ripple.style.height = "200px";
      ripple.style.borderRadius = "50%";
      ripple.style.border = `2px solid rgba(255, 255, 255, ${0.3 - i * 0.1})`;
      ripple.style.left = "50%";
      ripple.style.top = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.animation = `rippleAnimation 2s ease-in-out infinite`;
      ripple.style.animationDelay = `${i * 0.4}s`;
      clickPromptWrapper.appendChild(ripple);
    }

    // Add text
    const clickPrompt = document.createElement("div");
    clickPrompt.className = "cell-animation__click-prompt";
    clickPrompt.textContent = "CLICK TO SPRAY";
    clickPrompt.style.position = "relative";
    clickPrompt.style.color = "var(--text-light)";
    clickPrompt.style.fontFamily = "var(--font-heading)";
    clickPrompt.style.fontWeight = "var(--font-weight-bold)";
    clickPrompt.style.fontSize = "1rem";
    clickPrompt.style.textTransform = "uppercase";
    clickPrompt.style.letterSpacing = "0.1em";
    clickPrompt.style.whiteSpace = "nowrap";
    clickPrompt.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
    clickPrompt.style.textAlign = "center";
    clickPrompt.style.padding = "0.75rem 1.5rem";
    clickPrompt.style.zIndex = "12";

    clickPromptWrapper.appendChild(clickPrompt);

    container.appendChild(clickPromptWrapper);

    // Add global function to get all cell positions (call from console: getCellPositions())
    window.getCellPositions = function () {
      if (!window.cellWrappers || window.cellWrappers.length === 0) {
        console.log("No cells found. Make sure the page is loaded.");
        return;
      }

      const container = document.querySelector(".cell-animation__container");
      if (!container) {
        console.log("Container not found.");
        return;
      }

      console.log("\n=== CELL POSITIONS (Copy this to your code) ===\n");
      console.log("const positions = [");

      window.cellWrappers.forEach((cellData, index) => {
        const left = parseFloat(cellData.wrapper.style.left);
        const top = parseFloat(cellData.wrapper.style.top);
        const zIndex = cellData.wrapper.style.zIndex;
        const width = cellData.wrapper.style.width;
        const height = cellData.wrapper.style.height;

        console.log(
          `  { left: "${left.toFixed(1)}%", top: "${top.toFixed(
            1
          )}%" }, // Cell ${cellData.cellNumber}`
        );
      });

      console.log("];\n");
      console.log("=== Z-INDEX VALUES ===\n");
      window.cellWrappers.forEach((cellData) => {
        console.log(
          `Cell ${cellData.cellNumber}: zIndex = ${cellData.wrapper.style.zIndex}`
        );
      });

      console.log("\n=== SIZES ===\n");
      console.log("const cellSizes = [");
      window.cellWrappers.forEach((cellData) => {
        const width = parseFloat(cellData.wrapper.style.width);
        const height = parseFloat(cellData.wrapper.style.height);
        const zIndex = parseInt(cellData.wrapper.style.zIndex);
        console.log(
          `  { width: ${Math.round(width)}, height: ${Math.round(
            height
          )}, zIndex: ${zIndex} }, // Cell ${cellData.cellNumber}`
        );
      });
      console.log("];\n");

      // Return formatted string for easy copying
      const positionsArray = window.cellWrappers
        .map((cellData) => {
          const left = parseFloat(cellData.wrapper.style.left);
          const top = parseFloat(cellData.wrapper.style.top);
          return `      { left: "${left.toFixed(1)}%", top: "${top.toFixed(
            1
          )}%" }, // Cell ${cellData.cellNumber}`;
        })
        .join("\n");

      return positionsArray;
    };

    // Add global function to get all cell sizes (call from console: getCellSizes())
    window.getCellSizes = function () {
      if (!window.cellWrappers || window.cellWrappers.length === 0) {
        console.log("No cells found. Make sure the page is loaded.");
        return;
      }

      console.log("\n=== CELL SIZES (Copy this to your code) ===\n");
      console.log("const cellSizes = [");

      window.cellWrappers.forEach((cellData) => {
        const width = parseFloat(cellData.wrapper.style.width);
        const height = parseFloat(cellData.wrapper.style.height);
        const zIndex = parseInt(cellData.wrapper.style.zIndex);
        console.log(
          `  { width: ${Math.round(width)}, height: ${Math.round(
            height
          )}, zIndex: ${zIndex} }, // Cell ${cellData.cellNumber}`
        );
      });

      console.log("];\n");
    };

    // Master function to get ALL changes in code-ready format
    window.exportCellChanges = function () {
      if (!window.cellWrappers || window.cellWrappers.length === 0) {
        console.log("No cells found. Make sure the page is loaded.");
        return;
      }

      console.log("\n" + "=".repeat(60));
      console.log("📋 COPY THIS CODE TO scripts/main.js");
      console.log("=".repeat(60) + "\n");

      // Output cellSizes array
      console.log("// Replace the cellSizes array (around line 29):");
      console.log("const cellSizes = [");
      window.cellWrappers.forEach((cellData) => {
        const width = parseFloat(cellData.wrapper.style.width);
        const height = parseFloat(cellData.wrapper.style.height);
        const zIndex = parseInt(cellData.wrapper.style.zIndex);
        console.log(
          `  { width: ${Math.round(width)}, height: ${Math.round(
            height
          )}, zIndex: ${zIndex} }, // Cell ${cellData.cellNumber}`
        );
      });
      console.log("];\n");

      // Output positions array
      console.log("// Replace the positions array (around line 42):");
      console.log("const positions = [");
      window.cellWrappers.forEach((cellData) => {
        const left = parseFloat(cellData.wrapper.style.left);
        const top = parseFloat(cellData.wrapper.style.top);
        console.log(
          `  { left: "${left.toFixed(1)}%", top: "${top.toFixed(
            1
          )}%" }, // Cell ${cellData.cellNumber}`
        );
      });
      console.log("];\n");

      console.log("=".repeat(60));
      console.log("✅ Copy the arrays above and paste into scripts/main.js");
      console.log("=".repeat(60) + "\n");

      // Also copy to clipboard if possible (for modern browsers)
      const codeToCopy = [
        "// Replace the cellSizes array (around line 29):",
        "const cellSizes = [",
        ...window.cellWrappers.map((cellData) => {
          const width = parseFloat(cellData.wrapper.style.width);
          const height = parseFloat(cellData.wrapper.style.height);
          const zIndex = parseInt(cellData.wrapper.style.zIndex);
          return `  { width: ${Math.round(width)}, height: ${Math.round(
            height
          )}, zIndex: ${zIndex} }, // Cell ${cellData.cellNumber}`;
        }),
        "];",
        "",
        "// Replace the positions array (around line 42):",
        "const positions = [",
        ...window.cellWrappers.map((cellData) => {
          const left = parseFloat(cellData.wrapper.style.left);
          const top = parseFloat(cellData.wrapper.style.top);
          return `  { left: "${left.toFixed(1)}%", top: "${top.toFixed(
            1
          )}%" }, // Cell ${cellData.cellNumber}`;
        }),
        "];",
      ].join("\n");

      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(codeToCopy)
          .then(() => {
            console.log(
              "📋 Code copied to clipboard! Paste into scripts/main.js"
            );
          })
          .catch(() => {
            console.log("💡 Select and copy the code above manually");
          });
      } else {
        console.log("💡 Select and copy the code above manually");
      }

      return codeToCopy;
    };

    console.log("✅ Cell click-to-toggle animation enabled!");
    console.log("\n📖 HOW TO USE:");
    console.log("   • Click any cell to toggle between blue and red");
    console.log("   • Cells maintain their fixed positions");
    console.log("\n💡 Console commands:");
    console.log("   • getCellPositions() - Get current positions");
    console.log("   • getCellSizes() - Get current sizes");
  }

  // ============================================
  // CAROUSEL FUNCTIONALITY
  // ============================================
  function initCarousel() {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const track = document.getElementById("carouselTrack");
    const slides = track ? track.querySelectorAll(".carousel__slide") : [];
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const indicators = carousel.querySelectorAll(".carousel__indicator");

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
      // Ensure index is within bounds (no wrapping)
      if (index < 0) {
        return; // Don't go before first slide
      }
      if (index >= slides.length) {
        return; // Don't go after last slide
      }

      // Hide all slides
      slides.forEach((slide, i) => {
        slide.classList.remove("carousel__slide--active");
        if (i === index) {
          slide.classList.add("carousel__slide--active");
        }
      });

      // Update indicators
      indicators.forEach((indicator, i) => {
        const indicatorImg = indicator.querySelector(".carousel__indicator-img");
        if (i === index) {
          indicator.classList.add("carousel__indicator--active");
          indicator.setAttribute("aria-selected", "true");
          if (indicatorImg) {
            indicatorImg.src = "assets/Section 5/Circle_1.png";
          }
        } else {
          indicator.classList.remove("carousel__indicator--active");
          indicator.setAttribute("aria-selected", "false");
          if (indicatorImg) {
            indicatorImg.src = "assets/Section 5/Circle_2.png";
          }
        }
      });

      // Update arrow visibility based on position
      if (prevBtn && nextBtn) {
        // First slide: only show next arrow
        if (index === 0) {
          prevBtn.classList.remove("carousel__btn--visible");
          nextBtn.classList.remove("carousel__btn--hidden");
        }
        // Last slide: only show prev arrow
        else if (index === slides.length - 1) {
          prevBtn.classList.add("carousel__btn--visible");
          nextBtn.classList.add("carousel__btn--hidden");
        }
        // Middle slides: show both arrows
        else {
          prevBtn.classList.add("carousel__btn--visible");
          nextBtn.classList.remove("carousel__btn--hidden");
        }
      }

      currentSlide = index;
    }

    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentSlide > 0) {
          showSlide(currentSlide - 1);
        }
      });
    }

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentSlide < slides.length - 1) {
          showSlide(currentSlide + 1);
        }
      });
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        showSlide(index);
      });
    });

    // Disable auto-play - user controls navigation
    // let autoPlayInterval = setInterval(() => {
    //   showSlide(currentSlide + 1);
    // }, 5000);

    // Keyboard navigation
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        showSlide(currentSlide - 1);
      } else if (e.key === "ArrowRight") {
        showSlide(currentSlide + 1);
      }
    });

    // Initialize first slide (this will set arrow visibility)
    showSlide(0);
    
    // Initialize indicator images on load
    indicators.forEach((indicator, i) => {
      const indicatorImg = indicator.querySelector(".carousel__indicator-img");
      if (indicatorImg) {
        if (i === 0) {
          indicatorImg.src = "assets/Section 5/Circle_1.png";
        } else {
          indicatorImg.src = "assets/Section 5/Circle_2.png";
        }
      }
    });
  }

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "#home") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // ============================================
  // VIDEO MODAL (if needed)
  // ============================================
  function initVideoModals() {
    const playButtons = document.querySelectorAll(
      ".video-section__play-btn, .admin-section__play-btn"
    );

    playButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // This would open a video modal or embed
        // For now, we'll just log - you can integrate with a video player library
        console.log("Video play clicked");
        // Example: You could use a library like lightbox or create a custom modal
        // const videoUrl = 'YOUR_VIDEO_URL';
        // openVideoModal(videoUrl);
      });
    });
  }

  // ============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  function initMobileMenu() {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const navContainer = nav.querySelector(".nav__container");
    const navRight = nav.querySelector(".nav__right");
    if (!navContainer || !navRight) return;

    // Create mobile menu toggle button
    const menuToggle = document.createElement("button");
    menuToggle.className = "nav__toggle";
    menuToggle.setAttribute("aria-label", "Toggle navigation menu");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = "<span></span><span></span><span></span>";

    // Insert toggle button after logo
    const navLogo = navContainer.querySelector(".nav__logo");
    if (navLogo && navLogo.nextSibling) {
      navContainer.insertBefore(menuToggle, navLogo.nextSibling);
    } else {
      navContainer.appendChild(menuToggle);
    }

    // Toggle menu function
    function toggleMenu() {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      const newState = !isExpanded;

      menuToggle.setAttribute("aria-expanded", newState);
      navRight.classList.toggle("nav__right--open");
      menuToggle.classList.toggle("nav__toggle--active");

      // Prevent body scroll when menu is open
      if (newState) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        navRight.classList.contains("nav__right--open")
      ) {
        menuToggle.setAttribute("aria-expanded", "false");
        navRight.classList.remove("nav__right--open");
        menuToggle.classList.remove("nav__toggle--active");
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking on a link
    const navLinks = navRight.querySelectorAll(".nav__link, .nav__phone");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          menuToggle.setAttribute("aria-expanded", "false");
          navRight.classList.remove("nav__right--open");
          menuToggle.classList.remove("nav__toggle--active");
          document.body.style.overflow = "";
        }
      });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          // Close menu on desktop
          menuToggle.setAttribute("aria-expanded", "false");
          navRight.classList.remove("nav__right--open");
          menuToggle.classList.remove("nav__toggle--active");
          document.body.style.overflow = "";
        }
      }, 250);
    });
  }

  // ============================================
  // UNIVERSAL CHROME DEVTOOLS EDITOR
  // ============================================
  function initUniversalEditor() {
    let editMode = false;
    let editableElements = [];
    let draggedElement = null;
    let resizeElement = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    let isDragging = false;
    let dragThreshold = 5; // pixels to move before considering it a drag

    // Elements that can be edited (add more selectors as needed)
    const editableSelectors = [
      ".hero__heading",
      ".hero__subtitle",
      ".hero__bottle",
      ".hero__content",
      ".hero__image",
      ".asf-section__heading",
      ".asf-section__text",
      ".asf-section__content",
      ".video-section__player",
      ".video-section__heading",
      ".video-section__container",
      ".mechanism-section__heading",
      ".mechanism-section__text",
      ".mechanism-section__benefits",
      ".mechanism-section__content",
      ".proof-section__heading",
      ".product-section__heading",
      ".admin-section__heading",
      ".protocol-section__heading",
      ".protocol-section__text",
      ".btn",
      "section",
      ".nav",
      ".footer",
    ];

    // Toggle edit mode
    window.toggleEditMode = function () {
      editMode = !editMode;
      if (editMode) {
        enableEditMode();
        console.log("✅ Edit mode ENABLED");
        console.log("📖 Drag elements to move, resize handles to resize");
        console.log("💡 Type toggleEditMode() to disable");
      } else {
        disableEditMode();
        console.log("❌ Edit mode DISABLED");
      }
    };

    function enableEditMode() {
      editableElements = [];
      editableSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (!el.classList.contains("editor-handle")) {
            makeEditable(el);
            editableElements.push(el);
          }
        });
      });

      // Prevent link navigation when dragging
      document.addEventListener("click", preventNavigationDuringEdit, true);
    }

    function disableEditMode() {
      editableElements.forEach((el) => {
        el.style.cursor = "";
        el.style.outline = "";
        el.style.position = "";
        el.style.zIndex = "";
        el.classList.remove("editor-editable");
        // Remove resize handles
        const handles = el.querySelectorAll(".editor-resize-handle");
        handles.forEach((h) => h.remove());
        // Re-enable pointer events
        const links = el.querySelectorAll("a, button");
        links.forEach((link) => {
          link.style.pointerEvents = "";
        });
      });
      editableElements = [];
      
      // Remove navigation prevention
      document.removeEventListener("click", preventNavigationDuringEdit, true);
    }

    // Prevent navigation when clicking on editable elements
    function preventNavigationDuringEdit(e) {
      if (!editMode) return;
      
      // Check if click is on an editable element or its children
      const clickedElement = e.target.closest(".editor-editable");
      if (clickedElement) {
        // Only prevent if it's a link/button and we're not just clicking normally
        if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
          // Allow normal clicks, but prevent during drag
          if (!draggedElement && !resizeElement) {
            // Normal click - allow it
            return;
          }
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }

    function makeEditable(element) {
      // Skip if already editable or is a handle
      if (
        element.classList.contains("editor-editable") ||
        element.classList.contains("editor-handle")
      ) {
        return;
      }

      // Get computed styles
      const computed = window.getComputedStyle(element);
      const position = computed.position;

      // Make positionable if not already
      if (position === "static") {
        element.style.position = "relative";
      }

      element.classList.add("editor-editable");
      element.style.cursor = "move";
      element.style.outline = "2px dashed rgba(0, 125, 235, 0.5)";
      element.style.zIndex = "1000";

      // Add resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "editor-resize-handle";
      resizeHandle.style.position = "absolute";
      resizeHandle.style.width = "20px";
      resizeHandle.style.height = "20px";
      resizeHandle.style.background = "rgba(0, 125, 235, 0.8)";
      resizeHandle.style.border = "2px solid white";
      resizeHandle.style.borderRadius = "50%";
      resizeHandle.style.bottom = "0";
      resizeHandle.style.right = "0";
      resizeHandle.style.cursor = "nwse-resize";
      resizeHandle.style.zIndex = "1001";
      resizeHandle.style.pointerEvents = "auto";
      element.appendChild(resizeHandle);

      // Drag functionality
      element.addEventListener("mousedown", handleDragStart);
      resizeHandle.addEventListener("mousedown", handleResizeStart);
    }

    function handleDragStart(e) {
      if (!editMode) return;
      if (e.target.classList.contains("editor-resize-handle")) return;

      isDragging = false;
      draggedElement = e.currentTarget;
      const rect = draggedElement.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseFloat(draggedElement.style.left) || 0;
      startTop = parseFloat(draggedElement.style.top) || 0;

      // Temporarily disable pointer events on links/buttons
      const links = draggedElement.querySelectorAll("a, button");
      links.forEach((link) => {
        link.style.pointerEvents = "none";
      });

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      
      // Prevent default only if it's not a link/button click
      if (e.target.tagName !== "A" && e.target.tagName !== "BUTTON") {
        e.preventDefault();
      }
      e.stopPropagation();
    }

    function handleDrag(e) {
      if (!draggedElement) return;

      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);

      // Check if we've moved enough to consider it a drag
      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        isDragging = true;
        // Prevent navigation during drag
        e.preventDefault();
        e.stopPropagation();
      }

      if (isDragging) {
        const parent = draggedElement.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const offsetX = e.clientX - startX;
        const offsetY = e.clientY - startY;
        const newLeft = startLeft + offsetX;
        const newTop = startTop + offsetY;

        draggedElement.style.left = `${newLeft}px`;
        draggedElement.style.top = `${newTop}px`;
      }
    }

    function handleDragEnd(e) {
      // Re-enable pointer events on links/buttons
      if (draggedElement) {
        const links = draggedElement.querySelectorAll("a, button");
        links.forEach((link) => {
          link.style.pointerEvents = "";
        });

        // If we were dragging, prevent click events
        if (isDragging && e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Prevent any click events that might fire after mouseup
          setTimeout(() => {
            if (e.target.tagName === "A" || e.target.closest("a")) {
              const link = e.target.tagName === "A" ? e.target : e.target.closest("a");
              if (link) {
                link.addEventListener("click", (clickE) => {
                  clickE.preventDefault();
                  clickE.stopPropagation();
                }, { once: true, capture: true });
              }
            }
          }, 0);
        }
      }

      isDragging = false;
      draggedElement = null;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    }

    function handleResizeStart(e) {
      if (!editMode) return;
      e.stopPropagation();
      e.preventDefault();
      e.stopImmediatePropagation();

      resizeElement = e.currentTarget.parentElement;
      const rect = resizeElement.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;

      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    }

    function handleResize(e) {
      if (!resizeElement) return;

      // Prevent navigation during resize
      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(50, startWidth + deltaX);
      const newHeight = Math.max(50, startHeight + deltaY);

      resizeElement.style.width = `${newWidth}px`;
      resizeElement.style.height = `${newHeight}px`;
    }

    function handleResizeEnd(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      resizeElement = null;
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    }

    // Export all changes
    window.exportAllChanges = function () {
      if (!editMode || editableElements.length === 0) {
        console.log("⚠️ Enable edit mode first: toggleEditMode()");
        return;
      }

      console.log("\n" + "=".repeat(60));
      console.log("📋 COPY THIS CSS TO styles/main.css");
      console.log("=".repeat(60) + "\n");

      editableElements.forEach((el, index) => {
        const selector = getSelector(el);
        const styles = getComputedStyle(el);
        const position = styles.position;
        const left = el.style.left || styles.left;
        const top = el.style.top || styles.top;
        const width = el.style.width || styles.width;
        const height = el.style.height || styles.height;

        console.log(`/* ${selector} */`);
        if (position && position !== "static") {
          console.log(`${selector} {`);
          if (left && left !== "auto") console.log(`  position: ${position};`);
          if (left && left !== "auto") console.log(`  left: ${left};`);
          if (top && top !== "auto") console.log(`  top: ${top};`);
          if (width && width !== "auto") console.log(`  width: ${width};`);
          if (height && height !== "auto") console.log(`  height: ${height};`);
          console.log("}\n");
        }
      });

      console.log("=".repeat(60));
      console.log("✅ Copy the CSS above and paste into styles/main.css");
      console.log("=".repeat(60) + "\n");
    };

    // Get CSS selector for element
    function getSelector(element) {
      if (element.id) return `#${element.id}`;
      if (element.className) {
        const classes = element.className
          .split(" ")
          .filter((c) => !c.includes("editor-"))
          .join(".");
        if (classes) return `.${classes}`;
      }
      return element.tagName.toLowerCase();
    }

    // Export element positions and sizes
    window.exportElementPositions = function () {
      if (!editMode || editableElements.length === 0) {
        console.log("⚠️ Enable edit mode first: toggleEditMode()");
        return;
      }

      console.log("\n" + "=".repeat(60));
      console.log("📋 ELEMENT POSITIONS & SIZES");
      console.log("=".repeat(60) + "\n");

      editableElements.forEach((el) => {
        const selector = getSelector(el);
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        const position = styles.position;
        const left = el.style.left || styles.left;
        const top = el.style.top || styles.top;
        const width = el.style.width || styles.width;
        const height = el.style.height || styles.height;

        console.log(`${selector}:`);
        console.log(`  Position: ${position}`);
        if (left && left !== "auto") console.log(`  Left: ${left}`);
        if (top && top !== "auto") console.log(`  Top: ${top}`);
        if (width && width !== "auto") console.log(`  Width: ${width}`);
        if (height && height !== "auto") console.log(`  Height: ${height}`);
        console.log(`  Bounding Box: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px`);
        console.log("");
      });
    };

    console.log("✅ Universal Editor loaded!");
    console.log("\n📖 HOW TO USE:");
    console.log("   1. Type toggleEditMode() to enable edit mode");
    console.log("   2. Drag elements to reposition them");
    console.log("   3. Drag resize handles (blue circles) to resize");
    console.log("   4. Type exportAllChanges() to get CSS code");
    console.log("   5. Type exportElementPositions() to see all positions");
    console.log("   6. Type toggleEditMode() again to disable");
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // Initialize all features
    initCellAnimation();
    initCarousel();
    initSmoothScroll();
    initVideoModals();
    initScrollAnimations();
    initMobileMenu();
    initUniversalEditor();

    console.log("Swine Tech website initialized");
  }

  // Start initialization
  init();
})();
