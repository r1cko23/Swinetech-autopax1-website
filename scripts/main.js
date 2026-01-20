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

    // Load all 7 red cells in a tight, organic cluster (start as red, change to blue when clicked)
    const cellCount = 7;

    // Define varying sizes for cells - will scale proportionally based on viewport
    // Z-index values ensure proper layering: higher = in front
    // Base sizes for desktop (will scale down on smaller screens)
    const getCellSizes = () => {
      // Calculate scale factor based on viewport width
      // Base reference: 1200px container width
      const baseWidth = 1200;
      const viewportWidth = window.innerWidth;
      // Scale factor: 1.0 at 1200px+, scales down proportionally below that
      // Minimum scale: 0.4 (for very small screens), Maximum: 1.0
      const scaleFactor = Math.max(0.4, Math.min(1.0, viewportWidth / baseWidth));
      
      return [
        { width: 100 * scaleFactor, height: 100 * scaleFactor, zIndex: 4 }, // Cell 1
        { width: 85 * scaleFactor, height: 85 * scaleFactor, zIndex: 3 }, // Cell 2
        { width: 229 * scaleFactor, height: 207 * scaleFactor, zIndex: 0 }, // Cell 3
        { width: 62 * scaleFactor, height: 60 * scaleFactor, zIndex: 6 }, // Cell 4
        { width: 128 * scaleFactor, height: 144 * scaleFactor, zIndex: 20 }, // Cell 5
        { width: 222 * scaleFactor, height: 208 * scaleFactor, zIndex: 3 }, // Cell 6
        { width: 134 * scaleFactor, height: 120 * scaleFactor, zIndex: 4 }, // Cell 7
      ];
    };
    
    const cellSizes = getCellSizes();

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

    // Function to change cell color from red to blue (one-way, not reversible)
    function changeCellToBlue(cellIndex, cellImg, wrapper, clickEvent) {
      const cellData = window.cellWrappers[cellIndex];
      if (!cellData) return;

      // Only allow change if cell is currently red
      if (!cellData.isRed) {
        return; // Already blue, do nothing
      }

      // Change state to blue
      cellData.isRed = false;

      // Get click position relative to the cell
      const rect = wrapper.getBoundingClientRect();
      const clickX = clickEvent ? clickEvent.clientX - rect.left : rect.width / 2;
      const clickY = clickEvent ? clickEvent.clientY - rect.top : rect.height / 2;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate offset from center for ripple effect
      const offsetX = ((clickX - centerX) / rect.width) * 100;
      const offsetY = ((clickY - centerY) / rect.height) * 100;

      // Create modern ripple effect with multiple layers for depth
      const rippleContainer = document.createElement("div");
      rippleContainer.className = "cell-animation__ripple-container";
      rippleContainer.style.position = "absolute";
      rippleContainer.style.left = `${clickX}px`;
      rippleContainer.style.top = `${clickY}px`;
      rippleContainer.style.transform = "translate(-50%, -50%)";
      rippleContainer.style.pointerEvents = "none";
      rippleContainer.style.zIndex = "1000";
      wrapper.appendChild(rippleContainer);

      // Create multiple ripple layers for ultra-smooth depth effect
      // Increased layers and smoother transitions for better visual effect
      for (let i = 0; i < 5; i++) {
        const ripple = document.createElement("div");
        ripple.className = `cell-animation__ripple-effect cell-animation__ripple-effect--layer-${i + 1}`;
        ripple.style.position = "absolute";
        ripple.style.left = "0";
        ripple.style.top = "0";
        ripple.style.width = "0px";
        ripple.style.height = "0px";
        ripple.style.borderRadius = "50%";
        const delay = i * 0.08; // Reduced delay for smoother wave effect
        const opacity = 0.9 - (i * 0.15); // Higher initial opacity for more visible ripples
        
        // Create a gradient from red (spray point) to blue (treated) for smooth color transition
        const redIntensity = Math.max(0, 1 - (i * 0.2));
        const blueIntensity = Math.min(1, i * 0.25);
        ripple.style.background = `radial-gradient(circle, 
          rgba(251, 54, 64, ${opacity * redIntensity}) 0%, 
          rgba(251, 54, 64, ${opacity * redIntensity * 0.6}) 15%, 
          rgba(0, 125, 235, ${opacity * blueIntensity}) 30%, 
          rgba(0, 125, 235, ${opacity * blueIntensity * 0.5}) 50%, 
          transparent 75%)`;
        ripple.style.boxShadow = `0 0 ${40 + i * 15}px rgba(0, 125, 235, ${0.8 - i * 0.15}), 
          0 0 ${20 + i * 8}px rgba(251, 54, 64, ${0.4 - i * 0.08})`;
        ripple.style.transform = "translate(-50%, -50%)";
        ripple.style.opacity = "0";
        rippleContainer.appendChild(ripple);

        // Animate each layer with ultra-smooth staggered timing for fluid wave effect
        requestAnimationFrame(() => {
          setTimeout(() => {
            const maxSize = Math.max(rect.width, rect.height) * (3.2 + i * 0.4); // Larger ripples
            const scaleX = 1.05 + (i * 0.04); // More subtle scaling
            const scaleY = 0.95 - (i * 0.03);
            
            // Ultra-smooth easing for fluid motion
            ripple.style.transition = `width 1.4s cubic-bezier(0.16, 1, 0.3, 1), 
              height 1.4s cubic-bezier(0.16, 1, 0.3, 1), 
              opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)`;
            ripple.style.width = `${maxSize}px`;
            ripple.style.height = `${maxSize}px`;
            ripple.style.opacity = "0";
            // Smooth organic scaling with gentle rotation
            ripple.style.transform = `translate(-50%, -50%) scale(${scaleX}, ${scaleY}) rotate(${i * 4}deg)`;
          }, delay * 1000);
        });
      }

      // Remove ripple container after all animations complete
      setTimeout(() => {
        if (rippleContainer.parentNode) {
          rippleContainer.remove();
        }
      }, 1800); // Extended time for smoother animation

      // Add ultra-smooth liquify/distortion effect to the cell during spray
      // Use CSS custom properties for smooth interpolation
      wrapper.style.setProperty('--liquify-offset-x', `${offsetX * 0.12}%`);
      wrapper.style.setProperty('--liquify-offset-y', `${offsetY * 0.12}%`);
      wrapper.style.setProperty('--liquify-scale', '0.92');
      wrapper.style.setProperty('--liquify-blur', '2px');
      wrapper.style.setProperty('--liquify-brightness', '1.25');
      
      // Smoother initial transition with better easing
      cellImg.style.transition = "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      cellImg.style.filter = "blur(var(--liquify-blur)) brightness(var(--liquify-brightness)) contrast(1.08) saturate(1.15) drop-shadow(0 0 8px rgba(251, 54, 64, 0.4))";
      cellImg.style.transform = `scale(var(--liquify-scale)) translate(var(--liquify-offset-x), var(--liquify-offset-y)) perspective(500px) rotateX(${offsetY * 0.15}deg) rotateY(${offsetX * 0.15}deg)`;
      cellImg.style.opacity = "0.8";
      // Smoother organic clip-path for liquify shape
      cellImg.style.clipPath = "inset(4% 4% 4% 4% round 12% 18% 12% 18%)";

      // Transition to blue with ultra-smooth liquify effect
      setTimeout(() => {
        // Switch image source from red to blue
        cellImg.src = `assets/Section 4/Blue Cells/Cell_${cellIndex + 1}.png`;
        cellImg.classList.add("cell-blue");
        cellImg.classList.remove("cell-red");

        // Update wrapper state and make it non-clickable
        wrapper.setAttribute("data-cell-state", "blue");
        wrapper.style.cursor = "default"; // No longer clickable

        // Ultra-smooth bounce with 3D perspective and fluid liquify
        wrapper.style.setProperty('--liquify-scale', '1.15');
        wrapper.style.setProperty('--liquify-offset-x', `${offsetX * 0.06}%`);
        wrapper.style.setProperty('--liquify-offset-y', `${offsetY * 0.06}%`);
        wrapper.style.setProperty('--liquify-blur', '0.5px');
        wrapper.style.setProperty('--liquify-brightness', '1.12');
        
        // Ultra-smooth transition with fluid easing curves
        cellImg.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        cellImg.style.opacity = "1";
        // Smooth 3D transform with gentle perspective for depth
        const rotateX = offsetY * 0.08;
        const rotateY = offsetX * 0.08;
        const rotateZ = offsetX * 0.04;
        cellImg.style.transform = `scale(var(--liquify-scale)) translate(var(--liquify-offset-x), var(--liquify-offset-y)) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        cellImg.style.filter = "drop-shadow(0 0 30px rgba(0, 125, 235, 0.9)) brightness(var(--liquify-brightness)) contrast(1.06) saturate(1.15) blur(var(--liquify-blur))";
        // Smooth organic clip-path transition
        const borderRadius = 12 + Math.abs(offsetX) * 0.08;
        cellImg.style.clipPath = `inset(0% 0% 0% 0% round ${borderRadius}% ${borderRadius * 1.15}% ${borderRadius}% ${borderRadius * 1.15}%)`;

        // Final settle animation with ultra-smooth liquify return
        setTimeout(() => {
          wrapper.style.setProperty('--liquify-scale', '1');
          wrapper.style.setProperty('--liquify-offset-x', '0%');
          wrapper.style.setProperty('--liquify-offset-y', '0%');
          wrapper.style.setProperty('--liquify-blur', '0px');
          wrapper.style.setProperty('--liquify-brightness', '1');
          
          // Ultra-smooth settle with fluid easing
          cellImg.style.transition = "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
          cellImg.style.transform = "scale(1) translate(0%, 0%) perspective(700px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
          cellImg.style.filter = "drop-shadow(0 0 15px rgba(0, 125, 235, 0.7))";
          cellImg.style.clipPath = "inset(0% 0% 0% 0% round 0%)";
        }, 700);
      }, 400);

      console.log(`Cell ${cellIndex + 1} changed from RED to BLUE (one-way)`);
    }

    // Function to update cell sizes on resize
    const updateCellSizes = () => {
      const newSizes = getCellSizes();
      window.cellWrappers.forEach((cellData, index) => {
        if (cellData.wrapper && newSizes[index]) {
          cellData.wrapper.style.width = `${newSizes[index].width}px`;
          cellData.wrapper.style.height = `${newSizes[index].height}px`;
          // Update stored size
          cellData.originalSize = newSizes[index];
        }
      });
      
      // Also update ripple sizes if they exist
      const ripples = clickPromptWrapper.querySelectorAll('.cell-animation__ripple');
      const newRippleSize = getRippleSize();
      ripples.forEach(ripple => {
        ripple.style.width = `${newRippleSize}px`;
        ripple.style.height = `${newRippleSize}px`;
      });
    };

    // Handle window resize to scale cells proportionally
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCellSizes();
        // Update prompt font size on resize
        if (clickPrompt) {
          clickPrompt.style.fontSize = getPromptFontSize();
        }
      }, 100);
    });

    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("img");
      cell.src = `assets/Section 4/Red Cells/Cell_${i + 1}.png`;
      cell.alt = "";
      cell.className = "cell-animation__cell cell-red";
      cell.style.animationDelay = `${i * 0.15}s`;

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.width = `${cellSizes[i].width}px`;
      wrapper.style.height = `${cellSizes[i].height}px`;
      wrapper.style.left = positions[i].left;
      wrapper.style.top = positions[i].top;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.zIndex = cellSizes[i].zIndex;
      wrapper.style.cursor = "pointer"; // Start as clickable (red cells)
      wrapper.setAttribute("data-cell-index", i);
      wrapper.setAttribute("data-cell-number", i + 1);
      wrapper.setAttribute("data-cell-state", "red"); // Track state for styling

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
        isRed: true, // Start as red - initial state
      });

      // Verify initial state is red
      console.log(`Cell ${i + 1} initialized as RED (src: ${cell.src})`);

      // Add click functionality to change cell from red to blue (one-way)
      wrapper.addEventListener("click", (e) => {
        changeCellToBlue(i, cell, wrapper, e);
      });
    }
    
    console.log(`✅ All ${cellCount} cells initialized as RED`);

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

    // Create ripple background circles - scale based on viewport
    const getRippleSize = () => {
      const baseWidth = 1200;
      const viewportWidth = window.innerWidth;
      const scaleFactor = Math.max(0.4, Math.min(1.0, viewportWidth / baseWidth));
      return 200 * scaleFactor;
    };
    
    const rippleSize = getRippleSize();
    for (let i = 0; i < 3; i++) {
      const ripple = document.createElement("div");
      ripple.className = `cell-animation__ripple cell-animation__ripple--${
        i + 1
      }`;
      ripple.style.position = "absolute";
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;
      ripple.style.borderRadius = "50%";
      ripple.style.border = `2px solid rgba(255, 255, 255, ${0.3 - i * 0.1})`;
      ripple.style.left = "50%";
      ripple.style.top = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.animation = `rippleAnimation 2s ease-in-out infinite`;
      ripple.style.animationDelay = `${i * 0.4}s`;
      clickPromptWrapper.appendChild(ripple);
    }

    // Function to get prompt font size based on viewport
    const getPromptFontSize = () => {
      const baseWidth = 1200;
      const viewportWidth = window.innerWidth;
      const scaleFactor = Math.max(0.5, Math.min(1.0, viewportWidth / baseWidth));
      return `${0.875 * scaleFactor}rem`;
    };
    
    // Add text
    const clickPrompt = document.createElement("div");
    clickPrompt.className = "cell-animation__click-prompt";
    clickPrompt.textContent = "Click to spray autopax1";
    clickPrompt.style.position = "relative";
    clickPrompt.style.color = "var(--text-light)";
    clickPrompt.style.fontFamily = "var(--font-heading)";
    clickPrompt.style.fontWeight = "var(--font-weight-bold)";
    clickPrompt.style.fontSize = getPromptFontSize();
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

    console.log("✅ Cell click-to-spray animation enabled!");
    console.log("\n📖 HOW TO USE:");
    console.log("   • Cells start as RED (infected)");
    console.log("   • Click any red cell to change it to BLUE (treated)");
    console.log("   • Changes are one-way (red → blue only)");
    console.log("   • Refresh page to reset all cells to red");
    console.log("\n💡 Console commands:");
    console.log("   • getCellPositions() - Get current positions");
    console.log("   • getCellSizes() - Get current sizes");
  }

  // ============================================
  // CAROUSEL FUNCTIONALITY
  // ============================================
  // ============================================
  // HERO CAROUSEL
  // ============================================
  function initHeroCarousel() {
    // #region agent log
    const heroCarousel = document.querySelector(".hero__carousel");
    if (!heroCarousel) {
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:initHeroCarousel',message:'Hero carousel not found',data:{exists:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'HeroCarousel'})}).catch(()=>{});
      return;
    }
    // #endregion
    
    const track = heroCarousel.querySelector(".hero__carousel-track");
    const slides = heroCarousel.querySelectorAll(".hero__carousel-slide");
    const prevBtn = document.getElementById("heroCarouselPrev");
    const nextBtn = document.getElementById("heroCarouselNext");
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
      if (index < 0 || index >= slides.length) return;
      
      // Remove active class from all slides
      slides.forEach(slide => {
        slide.classList.remove("hero__carousel-slide--active");
      });
      
      // Add active class to current slide
      slides[index].classList.add("hero__carousel-slide--active");
      
      // Update arrow visibility
      if (prevBtn && nextBtn) {
        // Always show next arrow (even with one slide, as visual indicator)
        // Hide prev arrow if only one slide or on first slide
        if (slides.length <= 1 || index === 0) {
          prevBtn.classList.remove("hero__carousel-btn--visible");
          prevBtn.style.opacity = "0";
          prevBtn.style.pointerEvents = "none";
        } else {
          prevBtn.classList.add("hero__carousel-btn--visible");
          prevBtn.style.opacity = "0.8";
          prevBtn.style.pointerEvents = "auto";
        }
        
        // Always show next arrow (even if disabled, for visual consistency)
        if (index === slides.length - 1 && slides.length > 1) {
          nextBtn.classList.add("hero__carousel-btn--hidden");
          nextBtn.style.opacity = "0.6"; // Slightly visible but disabled
          nextBtn.style.pointerEvents = "none";
        } else {
          nextBtn.classList.remove("hero__carousel-btn--hidden");
          nextBtn.style.opacity = "0.8";
          nextBtn.style.pointerEvents = "auto";
        }
      }
      
      currentSlide = index;
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:initHeroCarousel',message:'Hero carousel slide changed',data:{currentSlide:index,totalSlides:slides.length,prevVisible:index > 0,nextVisible:index < slides.length - 1},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'HeroCarousel'})}).catch(()=>{});
      // #endregion
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
    
    // Initialize first slide
    showSlide(0);
  }

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

      // Add animation class for smooth transitions
      const previousSlide = slides[currentSlide];
      if (previousSlide && previousSlide !== slides[index]) {
        previousSlide.classList.add("carousel__slide--exiting");
        setTimeout(() => {
          previousSlide.classList.remove("carousel__slide--exiting");
        }, 500);
      }

      // Hide all slides
      slides.forEach((slide, i) => {
        slide.classList.remove("carousel__slide--active", "carousel__slide--next", "carousel__slide--exiting");
        if (i === index) {
          // Add active class with animation
          requestAnimationFrame(() => {
            slide.classList.add("carousel__slide--active");
          });
        } else if (i === index + 1 && index + 1 < slides.length) {
          // Show next slide with reduced opacity as preview
          requestAnimationFrame(() => {
            slide.classList.add("carousel__slide--next");
          });
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
    
    // Ensure next slide is visible on initial load
    if (slides.length > 1) {
      slides[1].classList.add("carousel__slide--next");
    }
    
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

    // Add error handling for missing certificate images
    slides.forEach((slide, index) => {
      const img = slide.querySelector(".carousel__image");
      if (img) {
        img.addEventListener("error", function() {
          console.warn(`Certificate image ${index + 1} (${this.src}) failed to load. Please ensure Cert_${index + 1}.png exists in assets/Section 5/`);
          // Add a visual indicator for missing images
          this.style.border = "2px dashed rgba(255, 0, 0, 0.5)";
          this.alt = `Certificate ${index + 1} - Image not found`;
        });
        img.addEventListener("load", function() {
          console.log(`✓ Certificate image ${index + 1} loaded successfully`);
        });
      }
    });

    // Initialize certificate modal
    initCertificateModal();
  }

  // ============================================
  // CERTIFICATE MODAL
  // ============================================
  function initCertificateModal() {
    const modal = document.getElementById("certificateModal");
    const modalImage = document.getElementById("certificateModalImage");
    const closeBtn = document.getElementById("closeCertificateModal");
    const viewMoreLinks = document.querySelectorAll(".carousel__view-more");
    const learnMoreBtn = document.querySelector(".proof-section__learn-more-btn");

    if (!modal || !modalImage) return;

    // Open modal function
    function openModal(imageSrc, imageAlt) {
      // Clear previous image first
      modalImage.src = "";
      modalImage.alt = imageAlt || "Certificate document";
      
      // Set new image source
      modalImage.src = imageSrc;
      
      // Ensure image loads and fits properly
      modalImage.onload = function() {
        // Force image to fit within smaller viewport
        const maxWidth = window.innerWidth * 0.75; // 75% of viewport width
        const maxHeight = window.innerHeight * 0.80; // 80% of viewport height
        
        // Calculate aspect ratio
        const imgAspectRatio = this.naturalWidth / this.naturalHeight;
        const containerAspectRatio = maxWidth / maxHeight;
        
        // Reset styles first
        this.style.maxWidth = "";
        this.style.maxHeight = "";
        this.style.width = "";
        this.style.height = "";
        
        // Adjust to ensure full image is visible without scrolling
        if (imgAspectRatio > containerAspectRatio) {
          // Image is wider - constrain by width
          this.style.maxWidth = maxWidth + "px";
          this.style.height = "auto";
        } else {
          // Image is taller - constrain by height
          this.style.maxHeight = maxHeight + "px";
          this.style.width = "auto";
        }
        
        // Ensure image never exceeds container
        this.style.objectFit = "contain";
      };
      
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    // Close modal function
    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // Clear image src after animation to prevent showing previous image
      setTimeout(() => {
        modalImage.src = "";
      }, 300);
    }

    // Add click handlers to all "View More" links
    viewMoreLinks.forEach((link) => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const imageSrc = this.getAttribute("data-cert-image") || this.getAttribute("href");
        const imageAlt = this.getAttribute("data-cert-alt") || this.textContent.trim();
        openModal(imageSrc, imageAlt);
      });
    });

    // Handle "LEARN MORE" button click - open first certificate
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const firstViewMore = document.querySelector(".carousel__view-more");
        if (firstViewMore) {
          firstViewMore.click();
        }
      });
    }

    // Close modal on close button click
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Close modal on overlay click
    const overlay = modal.querySelector(".certificate-modal__overlay");
    if (overlay) {
      overlay.addEventListener("click", closeModal);
    }

    // Close modal on Escape key
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
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
  // VIDEO MODAL
  // ============================================
  function initVideoModals() {
    const videoModal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoModalPlayer");
    const closeBtn = document.getElementById("closeVideoModal");
    const playButtons = document.querySelectorAll(
      ".video-section__play-btn"
    );

    if (!videoModal || !videoPlayer) return;

    // Open modal function
    function openVideoModal() {
      videoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      
      // Reset video to beginning and play
      videoPlayer.currentTime = 0;
      videoPlayer.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }

    // Close modal function
    function closeVideoModal() {
      videoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      
      // Pause video when modal closes
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }

    // Add click handlers to play buttons
    playButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        openVideoModal();
      });
    });

    // Close modal on close button click
    if (closeBtn) {
      closeBtn.addEventListener("click", closeVideoModal);
    }

    // Close modal on overlay click
    const overlay = videoModal.querySelector(".video-modal__overlay");
    if (overlay) {
      overlay.addEventListener("click", closeVideoModal);
    }

    // Close modal on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && videoModal.getAttribute("aria-hidden") === "false") {
        closeVideoModal();
      }
    });

    // Pause video when modal is closed (in case user clicks outside)
    videoModal.addEventListener("transitionend", function () {
      if (videoModal.getAttribute("aria-hidden") === "true") {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
      }
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
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      observer.observe(section);
      
      // If section is already in view on page load, animate it in immediately
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        // Small delay to ensure smooth animation
        setTimeout(() => {
          section.classList.add("animate-in");
        }, 100);
      }
    });

    // Force animate-in for complete-order-section and order-section immediately on page load
    // These sections should always be visible since they're the main content
    const completeOrderSection = document.querySelector(".complete-order-section");
    const orderSection = document.querySelector(".order-section");
    
    if (completeOrderSection) {
      setTimeout(() => {
        completeOrderSection.classList.add("animate-in");
      }, 50);
    }
    
    if (orderSection) {
      setTimeout(() => {
        orderSection.classList.add("animate-in");
      }, 50);
    }
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

    // Handle dropdown toggles in mobile view
    const dropdownLinks = navRight.querySelectorAll(".nav__link--dropdown");
    dropdownLinks.forEach((dropdownLink) => {
      dropdownLink.addEventListener("click", (e) => {
        // Check if we're in mobile view
        if (window.innerWidth <= 768) {
          const dropdownItem = dropdownLink.closest(".nav__item--dropdown");
          if (!dropdownItem) return;

          const dropdownMenu = dropdownItem.querySelector(".nav__dropdown-menu");
          
          // If it's the Order Form dropdown, toggle it
          if (dropdownMenu) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = dropdownLink.getAttribute("aria-expanded") === "true";
            const newState = !isExpanded;
            
            dropdownLink.setAttribute("aria-expanded", newState);
            dropdownMenu.classList.toggle("nav__dropdown-menu--open");
            
            // Close other dropdowns
            dropdownLinks.forEach((otherLink) => {
              if (otherLink !== dropdownLink) {
                const otherItem = otherLink.closest(".nav__item--dropdown");
                const otherMenu = otherItem?.querySelector(".nav__dropdown-menu");
                if (otherMenu) {
                  otherLink.setAttribute("aria-expanded", "false");
                  otherMenu.classList.remove("nav__dropdown-menu--open");
                }
              }
            });
          }
          // If it's FAQ (no dropdown menu), let it navigate normally
        }
      });
    });

    // Close menu when clicking on a non-dropdown link
    const navLinks = navRight.querySelectorAll(".nav__link:not(.nav__link--dropdown), .nav__phone, .nav__dropdown-link");
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
  // INFOGRAPHICS CAROUSEL
  // ============================================
  function initInfographicsCarousel() {
    const carousel = document.querySelector(".infographics-section__carousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".infographics-section__slide");
    const prevBtn = document.getElementById("infographicPrev");
    const nextBtn = document.getElementById("infographicNext");
    const timelineCircles = document.querySelectorAll(".infographics-section__timeline-circle");

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
      // Ensure index is within bounds
      if (index < 0 || index >= slides.length) return;

      // Hide all slides
      slides.forEach((slide, i) => {
        slide.classList.remove("infographics-section__slide--active");
        if (i === index) {
          slide.classList.add("infographics-section__slide--active");
        }
      });

      // Update timeline indicators
      timelineCircles.forEach((circle, i) => {
        const circleImg = circle.querySelector(".infographics-section__timeline-circle-img");
        if (i === index) {
          circle.classList.add("infographics-section__timeline-circle--active");
          if (circleImg) {
            circleImg.src = "assets/Infographic/Circle_1.png";
          }
        } else {
          circle.classList.remove("infographics-section__timeline-circle--active");
          if (circleImg) {
            circleImg.src = "assets/Infographic/Circle_2.png";
          }
        }
      });

      // Update button visibility
      if (prevBtn && nextBtn) {
        if (index === 0) {
          // First slide: hide left arrow, show right arrow
          prevBtn.classList.remove("infographics-section__nav-btn--visible");
          nextBtn.style.opacity = "1";
          nextBtn.style.pointerEvents = "auto";
        } else if (index === slides.length - 1) {
          // Last slide: show left arrow, hide right arrow
          prevBtn.classList.add("infographics-section__nav-btn--visible");
          nextBtn.style.opacity = "0";
          nextBtn.style.pointerEvents = "none";
        } else {
          // Middle slides: show both arrows
          prevBtn.classList.add("infographics-section__nav-btn--visible");
          nextBtn.style.opacity = "1";
          nextBtn.style.pointerEvents = "auto";
        }
      }

      // Show next slide as preview (foreshadowing)
      slides.forEach((slide, i) => {
        slide.classList.remove("infographics-section__slide--next");
        if (i === index + 1 && index + 1 < slides.length) {
          slide.classList.add("infographics-section__slide--next");
        }
      });

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

    // Timeline circle clicks
    timelineCircles.forEach((circle, index) => {
      circle.addEventListener("click", () => {
        showSlide(index);
      });
    });

    // Keyboard navigation
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && currentSlide > 0) {
        showSlide(currentSlide - 1);
      } else if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
      }
    });

    // Initialize first slide
    showSlide(0);
    
    // Show next slide as preview on initial load
    if (slides.length > 1) {
      slides[1].classList.add("infographics-section__slide--next");
    }
  }

  // ============================================
  // DEBUG: HERO SECTION LAYOUT TRACKING
  // ============================================
  function debugHeroSection() {
    // #region agent log
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 480;
    
    const heroContainer = document.querySelector('.hero__container');
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image');
    const heroBottle = document.querySelector('.hero__bottle');
    
    if (heroContainer && heroContent && heroImage && heroBottle) {
      const containerComputed = window.getComputedStyle(heroContainer);
      const contentComputed = window.getComputedStyle(heroContent);
      const imageComputed = window.getComputedStyle(heroImage);
      const bottleComputed = window.getComputedStyle(heroBottle);
      
      const containerRect = heroContainer.getBoundingClientRect();
      const contentRect = heroContent.getBoundingClientRect();
      const imageRect = heroImage.getBoundingClientRect();
      const bottleRect = heroBottle.getBoundingClientRect();
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugHeroSection',message:'Hero section layout',data:{viewportWidth,isMobile,containerDisplay:containerComputed.display,containerGridTemplateColumns:containerComputed.gridTemplateColumns,containerFlexDirection:containerComputed.flexDirection,contentWidth:contentComputed.width,contentRectWidth:contentRect.width,imageWidth:imageComputed.width,imageRectWidth:imageRect.width,bottleWidth:bottleComputed.width,bottleMaxWidth:bottleComputed.maxWidth,bottleRectWidth:bottleRect.width,contentLeft:contentRect.left,imageLeft:imageRect.left,bottleLeft:bottleRect.left,isSideBySide:contentRect.left < imageRect.left && imageRect.left > contentRect.right},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'Hero'})}).catch(()=>{});
    }
    // #endregion
  }
  
  // ============================================
  // DEBUG: MOBILE ISSUES TRACKING
  // ============================================
  function debugMobileIssues() {
    // #region agent log
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 480;
    
    // Hypothesis A: CTA button missing on mobile
    const asfContent = document.querySelector('.asf-section__content');
    const asfButton = document.querySelector('.asf-section__content .btn');
    const asfContainer = document.querySelector('.asf-section__container');
    const asfSection = document.querySelector('.asf-section');
    
    if (asfButton) {
      const buttonComputed = window.getComputedStyle(asfButton);
      const buttonRect = asfButton.getBoundingClientRect();
      const contentRect = asfContent ? asfContent.getBoundingClientRect() : null;
      const containerRect = asfContainer ? asfContainer.getBoundingClientRect() : null;
      const sectionRect = asfSection ? asfSection.getBoundingClientRect() : null;
      const contentComputed = asfContent ? window.getComputedStyle(asfContent) : null;
      const containerComputed = asfContainer ? window.getComputedStyle(asfContainer) : null;
      const sectionComputed = asfSection ? window.getComputedStyle(asfSection) : null;
      
      // Check if button is clipped or off-screen
      const isOffScreen = buttonRect.top < 0 || buttonRect.left < 0 || buttonRect.bottom > window.innerHeight || buttonRect.right > window.innerWidth;
      const hasZeroSize = buttonRect.width === 0 || buttonRect.height === 0;
      const isClipped = contentRect && (buttonRect.top < contentRect.top || buttonRect.bottom > contentRect.bottom || buttonRect.left < contentRect.left || buttonRect.right > contentRect.right);
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugMobileIssues',message:'Hypothesis A: CTA button mobile detailed',data:{viewportWidth,isMobile,display:buttonComputed.display,visibility:buttonComputed.visibility,opacity:buttonComputed.opacity,width:buttonComputed.width,height:buttonComputed.height,rectTop:buttonRect.top,rectLeft:buttonRect.left,rectWidth:buttonRect.width,rectHeight:buttonRect.height,contentTop:contentRect?.top,contentBottom:contentRect?.bottom,contentDisplay:contentComputed?.display,contentVisibility:contentComputed?.visibility,contentOverflow:contentComputed?.overflow,containerDisplay:containerComputed?.display,containerVisibility:containerComputed?.visibility,sectionDisplay:sectionComputed?.display,sectionOverflow:sectionComputed?.overflow,isOffScreen,hasZeroSize,isClipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'A'})}).catch(()=>{});
    } else {
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugMobileIssues',message:'Hypothesis A: CTA button not found',data:{viewportWidth,isMobile,exists:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'A'})}).catch(()=>{});
    }
    
    // Hypothesis B: Cell positioning on mobile
    const cellContainer = document.querySelector('.cell-animation__container');
    const cells = cellContainer ? cellContainer.querySelectorAll('[data-cell-index]') : [];
    
    if (cells.length > 0) {
      const firstCell = cells[0];
      const firstCellComputed = window.getComputedStyle(firstCell);
      const firstCellRect = firstCell.getBoundingClientRect();
      const containerRect = cellContainer ? cellContainer.getBoundingClientRect() : null;
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugMobileIssues',message:'Hypothesis B: Cell positioning',data:{viewportWidth,isMobile,cellCount:cells.length,firstCellLeft:firstCellComputed.left,firstCellTop:firstCellComputed.top,firstCellWidth:firstCellComputed.width,firstCellHeight:firstCellComputed.height,containerWidth:containerRect?.width,containerHeight:containerRect?.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'B'})}).catch(()=>{});
    }
    
    // Hypothesis C: Certificate section scaling
    const carousel = document.querySelector('.carousel');
    const carouselImages = carousel ? carousel.querySelectorAll('.carousel__image') : [];
    
    if (carouselImages.length > 0) {
      const firstImage = carouselImages[0];
      const imageComputed = window.getComputedStyle(firstImage);
      const imageRect = firstImage.getBoundingClientRect();
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugMobileIssues',message:'Hypothesis C: Certificate scaling',data:{viewportWidth,isMobile,imageCount:carouselImages.length,imageWidth:imageComputed.width,imageHeight:imageComputed.height,rectWidth:imageRect.width,rectHeight:imageRect.height,transform:imageComputed.transform},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'C'})}).catch(()=>{});
    }
    // #endregion
  }
  
  // ============================================
  // DEBUG: VIDEO THUMBNAIL MISSING TRACKING
  // ============================================
  function debugVideoThumbnailMissing() {
    // #region agent log
    const videoThumbnail = document.querySelector('.video-section__thumbnail');
    const videoPlayer = document.querySelector('.video-section__player');
    const videoSection = document.querySelector('.video-section');
    const asfSection = document.querySelector('.asf-section');
    
    // Hypothesis A: Image not loading (404, wrong path)
    if (videoThumbnail) {
      const imgSrc = videoThumbnail.src || videoThumbnail.getAttribute('src');
      const imgComplete = videoThumbnail.complete;
      const imgNaturalWidth = videoThumbnail.naturalWidth;
      const imgNaturalHeight = videoThumbnail.naturalHeight;
      const imgOnError = videoThumbnail.onerror !== null;
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis A: Image loading',data:{imgSrc,imgComplete,imgNaturalWidth,imgNaturalHeight,imgOnError,exists:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      
      // Check for image load errors
      videoThumbnail.addEventListener('error', function() {
        fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Image load error detected',data:{imgSrc:this.src,error:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      }, { once: true });
    } else {
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis A: Thumbnail element missing',data:{exists:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
    }
    
    // Hypothesis B: CSS hiding it (display, visibility, opacity)
    if (videoThumbnail) {
      const computed = window.getComputedStyle(videoThumbnail);
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis B: CSS visibility',data:{display:computed.display,visibility:computed.visibility,opacity:computed.opacity,width:computed.width,height:computed.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    }
    
    // Hypothesis C: Z-index putting it behind something
    if (videoThumbnail && videoPlayer && asfSection) {
      const thumbnailComputed = window.getComputedStyle(videoThumbnail);
      const playerComputed = window.getComputedStyle(videoPlayer);
      const videoSection = document.querySelector('.video-section');
      const videoSectionComputed = videoSection ? window.getComputedStyle(videoSection) : null;
      const asfComputed = window.getComputedStyle(asfSection);
      const asfBefore = window.getComputedStyle(asfSection, '::before');
      const asfContainer = document.querySelector('.asf-section__container');
      const asfContainerComputed = asfContainer ? window.getComputedStyle(asfContainer) : null;
      const asfHeading = document.querySelector('.asf-section__heading');
      const asfHeadingComputed = asfHeading ? window.getComputedStyle(asfHeading) : null;
      const thumbnailRect = videoThumbnail.getBoundingClientRect();
      const asfRect = asfSection.getBoundingClientRect();
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis C: Z-index stacking detailed',data:{thumbnailZIndex:thumbnailComputed.zIndex,playerZIndex:playerComputed.zIndex,videoSectionZIndex:videoSectionComputed?.zIndex,asfZIndex:asfComputed.zIndex,asfBeforeZIndex:asfBefore.zIndex,asfIsolation:asfComputed.isolation,asfContainerZIndex:asfContainerComputed?.zIndex,asfHeadingZIndex:asfHeadingComputed?.zIndex,thumbnailTop:thumbnailRect.top,asfTop:asfRect.top},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
    }
    
    // Hypothesis D: Position/transform moving it off-screen
    if (videoThumbnail) {
      const computed = window.getComputedStyle(videoThumbnail);
      const rect = videoThumbnail.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isOffScreen = rect.right < 0 || rect.left > viewportWidth || rect.bottom < 0 || rect.top > viewportHeight;
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis D: Position/transform',data:{position:computed.position,top:computed.top,left:computed.left,transform:computed.transform,rectTop:rect.top,rectLeft:rect.left,rectWidth:rect.width,rectHeight:rect.height,viewportWidth,viewportHeight,isOffScreen},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
    }
    
    // Hypothesis E: Size making it invisible (width/height: 0)
    if (videoThumbnail) {
      const computed = window.getComputedStyle(videoThumbnail);
      const rect = videoThumbnail.getBoundingClientRect();
      const hasZeroSize = rect.width === 0 || rect.height === 0;
      
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoThumbnailMissing',message:'Hypothesis E: Size/visibility',data:{width:computed.width,height:computed.height,rectWidth:rect.width,rectHeight:rect.height,hasZeroSize,minWidth:computed.minWidth,maxWidth:computed.maxWidth},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
    }
    // #endregion
  }
  
  function debugVideoOverlap() {
    // #region agent log
    const asfSection = document.querySelector('.asf-section');
    const videoSection = document.querySelector('.video-section');
    const videoPlayer = document.querySelector('.video-section__player');
    const videoThumbnail = document.querySelector('.video-section__thumbnail');
    
    if (!asfSection || !videoSection || !videoPlayer || !videoThumbnail) {
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Elements not found',data:{asfSection:!!asfSection,videoSection:!!videoSection,videoPlayer:!!videoPlayer,videoThumbnail:!!videoThumbnail},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'ALL'})}).catch(()=>{});
      return;
    }
    
    const asfRect = asfSection.getBoundingClientRect();
    const videoSectionRect = videoSection.getBoundingClientRect();
    const videoPlayerRect = videoPlayer.getBoundingClientRect();
    const thumbnailRect = videoThumbnail.getBoundingClientRect();
    
    const asfComputed = window.getComputedStyle(asfSection);
    const videoSectionComputed = window.getComputedStyle(videoSection);
    const videoPlayerComputed = window.getComputedStyle(videoPlayer);
    const thumbnailComputed = window.getComputedStyle(videoThumbnail);
    
    // Check overlap
    const thumbnailOverlapsAsf = thumbnailRect.top < asfRect.bottom && thumbnailRect.bottom > asfRect.top;
    const thumbnailOverlapsVideoSection = thumbnailRect.top < videoSectionRect.bottom && thumbnailRect.bottom > videoSectionRect.top;
    
    // Hypothesis A: Negative margins causing overlap
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Hypothesis A: Negative margins',data:{videoSectionMarginTop:videoSectionComputed.marginTop,videoPlayerMarginTop:videoPlayerComputed.marginTop,thumbnailTop:thumbnailRect.top,asfBottom:asfRect.bottom,overlaps:thumbnailOverlapsAsf},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    
    // Hypothesis B: Z-index stacking issue
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Hypothesis B: Z-index values',data:{asfZIndex:asfComputed.zIndex,asfIsolation:asfComputed.isolation,videoSectionZIndex:videoSectionComputed.zIndex,videoPlayerZIndex:videoPlayerComputed.zIndex,thumbnailZIndex:thumbnailComputed.zIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    
    // Hypothesis C: Isolation stacking context
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Hypothesis C: Isolation context',data:{asfIsolation:asfComputed.isolation,asfPosition:asfComputed.position,videoSectionPosition:videoSectionComputed.position,videoPlayerPosition:videoPlayerComputed.position},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    
    // Hypothesis D: Overflow and bounding boxes
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Hypothesis D: Overflow and bounds',data:{asfOverflow:asfComputed.overflow,videoSectionOverflow:videoSectionComputed.overflow,videoPlayerOverflow:videoPlayerComputed.overflow,thumbnailHeight:thumbnailRect.height,thumbnailTop:thumbnailRect.top,thumbnailBottom:thumbnailRect.bottom,asfTop:asfRect.top,asfBottom:asfRect.bottom,videoSectionTop:videoSectionRect.top,videoSectionBottom:videoSectionRect.bottom},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    
    // Hypothesis E: Viewport-specific positioning
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugVideoOverlap',message:'Hypothesis E: Viewport positioning',data:{viewportWidth:window.innerWidth,viewportHeight:window.innerHeight,thumbnailTop:thumbnailRect.top,thumbnailLeft:thumbnailRect.left,thumbnailWidth:thumbnailRect.width,thumbnailHeight:thumbnailRect.height,asfTop:asfRect.top,asfBottom:asfRect.bottom,overlaps:thumbnailOverlapsAsf},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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

    // CRITICAL: Force visibility for ALL sections immediately BEFORE anything else
    // This must run first to ensure content is visible
    const allSections = document.querySelectorAll("section");
    allSections.forEach((section) => {
      // Force visibility with inline styles (highest priority)
      section.style.setProperty("opacity", "1", "important");
      section.style.setProperty("transform", "none", "important");
      section.classList.add("animate-in");
    });

    // Initialize all features
    initCellAnimation();
    initCarousel();
    initHeroCarousel();
    initInfographicsCarousel();
    initSmoothScroll();
    initVideoModals();
    initScrollAnimations();
    initMobileMenu();
    initUniversalEditor();
    initOrderForm();
    initBulkOrderModal();
    initFAQ();

    // Force visibility again after a short delay to ensure it sticks
    setTimeout(() => {
      allSections.forEach((section) => {
        section.style.setProperty("opacity", "1", "important");
        section.style.setProperty("transform", "none", "important");
        section.classList.add("animate-in");
      });
      
      // Debug video overlap and missing thumbnail after layout is complete
      setTimeout(() => {
        debugVideoOverlap();
        debugVideoThumbnailMissing();
        debugMobileIssues();
        debugHeroSection();
      }, 200);
      
      // Also check after images load
      window.addEventListener('load', () => {
        setTimeout(() => {
          debugVideoThumbnailMissing();
          debugMobileIssues();
          debugHeroSection();
        }, 500);
      });
      
      // Check on resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          debugMobileIssues();
          debugHeroSection();
        }, 250);
      });
    }, 100);

    // Track on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        debugVideoOverlap();
      }, 250);
    });

    // Debug proof section heading
    debugProofHeading();

    console.log("Swine Tech website initialized");
  }

  // Debug proof section heading display
  function debugProofHeading() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugProofHeading',message:'Checking proof heading',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run9',hypothesisId:'ProofHeading'})}).catch(()=>{});
    // #endregion
    
    const heading = document.getElementById('proof-heading');
    if (!heading) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugProofHeading',message:'Proof heading not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run9',hypothesisId:'ProofHeading'})}).catch(()=>{});
      // #endregion
      return;
    }

    const lines = heading.querySelectorAll('.proof-section__heading-line');
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugProofHeading',message:'Found heading lines',data:{lineCount:lines.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run9',hypothesisId:'ProofHeading'})}).catch(()=>{});
    // #endregion

    lines.forEach((line, index) => {
      const computedStyle = window.getComputedStyle(line);
      const display = computedStyle.display;
      const text = line.textContent.trim();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.js:debugProofHeading',message:'Line style check',data:{lineIndex:index,text:text,display:display,whiteSpace:computedStyle.whiteSpace},timestamp:Date.now(),sessionId:'debug-session',runId:'run9',hypothesisId:'ProofHeading'})}).catch(()=>{});
      // #endregion
    });
  }

  // ============================================
  // ORDER FORM HANDLING
  // ============================================
  function initOrderForm() {
    const orderForm = document.getElementById("orderForm");
    if (!orderForm) return;

    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        firstName: document.getElementById("firstName").value.trim(),
        farmLocation: document.getElementById("farmLocation").value,
        herdSize: document.getElementById("herdSize").value,
        message: document.getElementById("message").value.trim(),
      };

      // Validate form
      if (!formData.firstName || !formData.farmLocation || !formData.herdSize || !formData.message) {
        alert("Please fill in all required fields.");
        return;
      }

      // All orders go to bulk order page
      // Navigate to bulk order page
      window.location.href = "bulk-order.html";

      // Reset form
      orderForm.reset();
    });
  }

  // ============================================
  // BULK ORDER MODAL & PAGE
  // ============================================
  function initBulkOrderModal() {
    const modal = document.getElementById("bulkOrderModal");
    const openModalBtn = document.getElementById("openBulkOrderModal");
    const openModalBtnFromNav = document.getElementById("openBulkOrderModalFromNav");
    const closeModalBtn = document.getElementById("closeBulkOrderModal");
    // Get package cards from both modal and page
    const packageCards = document.querySelectorAll(".package-card");
    const bulkOrderForm = document.getElementById("bulkOrderForm");

    if (!modal) return;

    // Open modal function
    window.openBulkOrderModal = function () {
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      // Update URL hash without scrolling
      if (history.pushState) {
        history.pushState(null, null, "#bulk-order");
      }
    };

    // Close modal function
    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // Remove hash from URL
      if (history.pushState) {
        history.pushState(null, null, window.location.pathname);
      }
    }

    // Open modal from dropdown link
    if (openModalBtn) {
      openModalBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openBulkOrderModal();
      });
    }

    // Open modal from navigation dropdown link (on order-form.html)
    if (openModalBtnFromNav) {
      openModalBtnFromNav.addEventListener("click", function (e) {
        e.preventDefault();
        // If we're on order-form.html, open modal directly
        if (window.location.pathname.includes("order-form.html")) {
          openBulkOrderModal();
        } else {
          // Otherwise, navigate to order-form.html with hash
          window.location.href = "order-form.html#bulk-order";
        }
      });
    }

    // Check if URL hash is #bulk-order and open modal
    function checkHashAndOpenModal() {
      if (window.location.hash === "#bulk-order") {
        setTimeout(() => {
          openBulkOrderModal();
        }, 100);
      }
    }

    // Check on page load
    checkHashAndOpenModal();

    // Check on hash change (for navigation)
    window.addEventListener("hashchange", checkHashAndOpenModal);

    // Close modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    // Close modal when clicking overlay
    const overlay = modal.querySelector(".bulk-order-modal__overlay");
    if (overlay) {
      overlay.addEventListener("click", closeModal);
    }

    // Close modal on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });

    // Update order summary function
    function updateOrderSummary(selectedCard) {
      const packageName = selectedCard.dataset.package;
      const price = selectedCard.dataset.price;
      const bottles = selectedCard.dataset.bottles;

      // Package name mapping
      const packageNames = {
        starter: "Starter Package (1 Bottle)",
        popular: "Popular Package (3 Bottles)",
        professional: "Professional Package (6 Bottles)",
      };

      // Update summary (works for both modal and page)
      const summaryPackage = document.getElementById("summaryPackage");
      const summaryPrice = document.getElementById("summaryPrice");
      const summaryTotal = document.getElementById("summaryTotal");

      if (summaryPackage) {
        summaryPackage.textContent = packageNames[packageName] || "Package";
      }
      if (summaryPrice) {
        summaryPrice.textContent = `₱${parseInt(price).toLocaleString()}`;
      }
      if (summaryTotal) {
        summaryTotal.textContent = `₱${parseInt(price).toLocaleString()}`;
      }
    }

    // Package selection (works for both modal and page)
    // Only add listeners if cards exist
    if (packageCards.length > 0) {
      packageCards.forEach((card) => {
        card.addEventListener("click", function () {
          // Remove selected class from all cards (both modal and page)
          document.querySelectorAll(".package-card").forEach((c) => c.classList.remove("package-card--selected"));
          // Add selected class to clicked card
          card.classList.add("package-card--selected");
          // Update order summary (works for both modal and page)
          updateOrderSummary(card);
        });
      });
    }

    // Form submission handler
    function handleBulkOrderSubmit(e) {
      e.preventDefault();

      // Get selected package (check both modal and page)
      const selectedCard = document.querySelector(".package-card--selected");
      if (!selectedCard) {
        alert("Please select a package.");
        return;
      }

      // Get form data
      const formData = {
        package: selectedCard.dataset.package,
        bottles: selectedCard.dataset.bottles,
        price: selectedCard.dataset.price,
        fullName: document.getElementById("bulkFullName").value.trim(),
        email: document.getElementById("bulkEmail").value.trim(),
        phone: document.getElementById("bulkPhoneCode").value + document.getElementById("bulkPhone").value.trim(),
        province: document.getElementById("bulkProvince").value,
        address: document.getElementById("bulkAddress").value.trim(),
        terms: document.getElementById("bulkTerms").checked,
      };

      // Validate form
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.province ||
        !formData.address ||
        !formData.terms
      ) {
        alert("Please fill in all required fields and agree to the terms.");
        return;
      }

      // Here you would typically send the data to a server
      console.log("Bulk Order Form Submission:", formData);

      // Show success message
      alert(
        "Thank you for your order! We'll process your order and contact you soon."
      );

      // Reset form
      if (bulkOrderForm) {
        bulkOrderForm.reset();
      }

      // Close modal if it's open
      if (modal && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    }

    // Form submission (works for both modal and page)
    if (bulkOrderForm) {
      bulkOrderForm.addEventListener("submit", handleBulkOrderSubmit);
    }

    // Initialize with default selected package (works for both modal and page)
    const defaultCard = document.querySelector(".package-card--selected");
    if (defaultCard) {
      updateOrderSummary(defaultCard);
    }
  }

  // ============================================
  // PACKAGE SELECTION ON ORDER FORM PAGE
  // ============================================
  function initPackageSelection() {
    // This handles package selection on the order-form.html page
    // The initBulkOrderModal function already handles modal package selection
    // This ensures page-level package selection also works
    const pagePackageCards = document.querySelectorAll(".complete-order-section .package-card");
    if (pagePackageCards.length === 0) return;

    // Use the same update function from initBulkOrderModal if available
    // Otherwise create a local one
    const updatePageOrderSummary = function(selectedCard) {
      const packageName = selectedCard.dataset.package;
      const price = selectedCard.dataset.price;

      const packageNames = {
        starter: "Starter Package (1 Bottle)",
        popular: "Popular Package (3 Bottles)",
        professional: "Professional Package (6 Bottles)",
      };

      const summaryPackage = document.getElementById("summaryPackage");
      const summaryPrice = document.getElementById("summaryPrice");
      const summaryTotal = document.getElementById("summaryTotal");

      if (summaryPackage) {
        summaryPackage.textContent = packageNames[packageName] || "Package";
      }
      if (summaryPrice) {
        summaryPrice.textContent = `₱${parseInt(price).toLocaleString()}`;
      }
      if (summaryTotal) {
        summaryTotal.textContent = `₱${parseInt(price).toLocaleString()}`;
      }
    };

    pagePackageCards.forEach((card) => {
      card.addEventListener("click", function () {
        pagePackageCards.forEach((c) => c.classList.remove("package-card--selected"));
        card.classList.add("package-card--selected");
        updatePageOrderSummary(card);
      });
    });

    // Initialize with default
    const defaultCard = document.querySelector(".complete-order-section .package-card--selected");
    if (defaultCard) {
      updatePageOrderSummary(defaultCard);
    }
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-item__question');
    if (faqQuestions.length === 0) return;

    faqQuestions.forEach((question) => {
      question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const answerId = this.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        
        if (!answer) return;

        // Close all other FAQ items (optional - remove if you want multiple open)
        faqQuestions.forEach((otherQuestion) => {
          if (otherQuestion !== this) {
            const otherAnswerId = otherQuestion.getAttribute('aria-controls');
            const otherAnswer = document.getElementById(otherAnswerId);
            if (otherAnswer) {
              otherQuestion.setAttribute('aria-expanded', 'false');
              otherAnswer.setAttribute('aria-hidden', 'true');
            }
          }
        });

        // Toggle current FAQ item
        const newState = !isExpanded;
        this.setAttribute('aria-expanded', newState);
        answer.setAttribute('aria-hidden', !newState);
      });
    });

    // Handle hash navigation to FAQ
    if (window.location.hash === '#faq') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        setTimeout(() => {
          faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  // Start initialization
  init();
})();
