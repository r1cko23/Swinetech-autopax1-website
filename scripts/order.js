/**
 * Order Form JavaScript
 * Handles package selection, order summary updates, form submission, and upsell/downsell modals
 */

(function() {
  'use strict';

  // Package data
  const packages = {
    starter: {
      name: 'Starter Package (1 Bottle)',
      price: 4984,
      bottles: 1
    },
    popular: {
      name: 'Popular Package (3 Bottles)',
      price: 13272,
      bottles: 3
    },
    professional: {
      name: 'Professional Package (6 Bottles)',
      price: 23184,
      bottles: 6
    }
  };

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initPackageSelection();
    initFormSubmission();
    initUpsellModal();
    initDownsellModal();
    initPartnershipModal();
  }

  // Package selection handler
  function initPackageSelection() {
    const packageInputs = document.querySelectorAll('input[name="package"]');
    if (packageInputs.length === 0) return;

    packageInputs.forEach(input => {
      input.addEventListener('change', function() {
        updateOrderSummary(this.value);
      });
    });

    // Initialize with default selected package
    const defaultPackage = document.querySelector('input[name="package"]:checked');
    if (defaultPackage) {
      updateOrderSummary(defaultPackage.value);
    }
  }

  // Update order summary
  function updateOrderSummary(packageValue) {
    const packageData = packages[packageValue];
    if (!packageData) return;

    const packageNameEl = document.getElementById('selectedPackageName');
    const packagePriceEl = document.getElementById('selectedPackagePrice');
    const totalPriceEl = document.getElementById('totalPrice');

    if (packageNameEl) {
      packageNameEl.textContent = packageData.name;
    }

    if (packagePriceEl) {
      packagePriceEl.textContent = `₱${packageData.price.toLocaleString()}`;
    }

    if (totalPriceEl) {
      totalPriceEl.textContent = `₱${packageData.price.toLocaleString()}`;
    }

    // Check if price per bottle reaches baseline (10,679.99)
    // This triggers when someone is ordering at the baseline premium pricing
    const pricePerBottle = packageData.price / packageData.bottles;
    const baselinePrice = 10679.99;
    const tolerance = 1.0; // Allow small differences for floating point comparison
    
    // Check if price per bottle is at or very close to baseline
    // This would typically happen with larger bulk orders
    if (Math.abs(pricePerBottle - baselinePrice) <= tolerance) {
      // Show partnership modal after a short delay to allow summary to update
      setTimeout(() => {
        showPartnershipModal();
      }, 500);
    }
    
    // Also check on form submission if total order value suggests bulk pricing
    // This is a fallback for when packages don't directly match baseline
    // In a real scenario, you might have a quantity input that calculates this
  }

  // Form submission handler
  function initFormSubmission() {
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) return;

    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const selectedPackage = formData.get('package');
      const packageData = packages[selectedPackage];

      // Validate form
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      // Check if this order qualifies for partnership pricing
      const pricePerBottle = packageData.price / packageData.bottles;
      const baselinePrice = 10679.99;
      const tolerance = 1.0;
      
      // If price per bottle is at baseline, show partnership modal instead
      if (Math.abs(pricePerBottle - baselinePrice) <= tolerance) {
        showPartnershipModal();
        return;
      }

      // Show upsell modal for starter and popular packages
      if (selectedPackage === 'starter' || selectedPackage === 'popular') {
        showUpsellModal();
      } else {
        // Professional package goes directly to completion
        processOrder(formData, packageData);
      }
    });
  }

  // Upsell modal functions
  function initUpsellModal() {
    // Modal will be shown on form submission
  }

  function showUpsellModal() {
    const modal = document.getElementById('upsellModal');
    if (!modal) return;

    modal.classList.add('active');
    startUpsellTimer();
    document.body.style.overflow = 'hidden';
  }

  function closeUpsellModal() {
    const modal = document.getElementById('upsellModal');
    if (!modal) return;

    modal.classList.remove('active');
    stopUpsellTimer();
    document.body.style.overflow = '';
    
    // Show downsell modal if upsell was declined
    showDownsellModal();
  }

  function acceptUpsell() {
    const orderForm = document.getElementById('orderForm');
    const formData = new FormData(orderForm);
    
    // Add premium package to order
    const premiumPackage = {
      name: 'Premium Protection Package',
      price: 22344,
      originalPrice: 32984
    };

    closeUpsellModal();
    processOrder(formData, premiumPackage, true);
  }

  function declineUpsell() {
    closeUpsellModal();
  }

  let upsellTimerInterval;
  function startUpsellTimer() {
    let timeLeft = 300; // 5 minutes in seconds
    const timerEl = document.getElementById('modalTimer');
    const countdownEl = document.getElementById('modalCountdown');
    const countdownTextEl = document.getElementById('modalCountdownText');

    if (!countdownEl || !countdownTextEl) return;

    upsellTimerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (countdownEl) countdownEl.textContent = timeString;
      if (countdownTextEl) countdownTextEl.textContent = timeString;

      if (timeLeft <= 0) {
        stopUpsellTimer();
        closeUpsellModal();
      } else {
        timeLeft--;
      }
    }, 1000);
  }

  function stopUpsellTimer() {
    if (upsellTimerInterval) {
      clearInterval(upsellTimerInterval);
      upsellTimerInterval = null;
    }
  }

  // Downsell modal functions
  function initDownsellModal() {
    // Modal will be shown after upsell is declined
  }

  function showDownsellModal() {
    const modal = document.getElementById('downsellModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDownsellModal() {
    const modal = document.getElementById('downsellModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function acceptDownsell() {
    const orderForm = document.getElementById('orderForm');
    const formData = new FormData(orderForm);
    
    // Add starter pack to order
    const starterPack = {
      name: 'Starter Success Pack',
      price: 7224,
      originalPrice: 9968
    };

    closeDownsellModal();
    processOrder(formData, starterPack, false, true);
  }

  function declineDownsell() {
    const orderForm = document.getElementById('orderForm');
    const formData = new FormData(orderForm);
    const selectedPackage = formData.get('package');
    const packageData = packages[selectedPackage];

    closeDownsellModal();
    processOrder(formData, packageData);
  }

  // Process final order
  function processOrder(formData, packageData, isUpsell = false, isDownsell = false) {
    // Collect all order data
    const orderData = {
      package: packageData.name,
      price: packageData.price,
      customer: {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        province: formData.get('province'),
        address: formData.get('address')
      },
      isUpsell: isUpsell,
      isDownsell: isDownsell,
      timestamp: new Date().toISOString()
    };

    // Log order data (in production, send to server)
    console.log('Order submitted:', orderData);

    // Show success message or redirect
    alert('Thank you for your order! Your order has been received and you will receive a confirmation email shortly.');
    
    // In production, you would:
    // 1. Send orderData to your backend API
    // 2. Redirect to thank you page
    // 3. Track conversion in analytics
  }

  // Partnership modal functions
  function initPartnershipModal() {
    // Modal will be shown when baseline price is reached
  }

  function showPartnershipModal() {
    const modal = document.getElementById('partnershipModal');
    if (!modal) return;

    // Don't show if already shown in this session
    if (modal.dataset.shown === 'true') return;

    modal.classList.add('active');
    modal.dataset.shown = 'true';
    document.body.style.overflow = 'hidden';
  }

  function closePartnershipModal() {
    const modal = document.getElementById('partnershipModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function becomePartner() {
    // Redirect to bulk order form
    window.location.href = 'bulk-order.html';
  }

  // Make functions globally available for onclick handlers
  window.acceptUpsell = acceptUpsell;
  window.declineUpsell = declineUpsell;
  window.closeUpsellModal = closeUpsellModal;
  window.acceptDownsell = acceptDownsell;
  window.declineDownsell = declineDownsell;
  window.closeDownsellModal = closeDownsellModal;
  window.closePartnershipModal = closePartnershipModal;
  window.becomePartner = becomePartner;

  // Initialize
  init();
})();
