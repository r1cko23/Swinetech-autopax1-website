/**
 * Order Form JavaScript
 * Handles quantity selection, order summary updates, form submission, and partnership modal
 */

(function() {
  'use strict';

  // Pricing constants
  const PRICE_PER_BOTTLE = 10679.99; // SRP - Baseline Premium Pricing

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initQuantitySelection();
    initFormSubmission();
    initPartnershipModal();
  }

  // Quantity selection handler
  function initQuantitySelection() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initQuantitySelection',message:'Initializing quantity selection',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
    // #endregion
    
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('quantityDecrease');
    const increaseBtn = document.getElementById('quantityIncrease');
    
    if (!quantityInput) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initQuantitySelection',message:'Quantity input not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Function to update button states
    function updateButtonStates() {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (decreaseBtn) {
        decreaseBtn.disabled = currentValue <= 1;
      }
    }

    // Decrease button
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    // Increase button
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
        quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    // Quantity input change handler
    quantityInput.addEventListener('change', function() {
      const quantity = parseInt(this.value) || 1;
      
      // Ensure minimum of 1
      if (quantity < 1) {
        this.value = 1;
        updateOrderSummary(1);
        updateButtonStates();
        return;
      }
      
      // Update button states
      updateButtonStates();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initQuantitySelection',message:'Quantity changed',data:{quantity:quantity},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
      // #endregion
      
      // Show partnership modal if quantity is more than 3
      if (quantity > 3) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initQuantitySelection',message:'Triggering partnership modal',data:{quantity:quantity,threshold:3},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'PartnershipModal'})}).catch(()=>{});
        // #endregion
        
        // Small delay to ensure UI updates smoothly
        setTimeout(() => {
          showPartnershipModal();
        }, 300);
      }
      
      updateOrderSummary(quantity);
    });

    // Initialize with default quantity of 1
    updateButtonStates();
    updateOrderSummary(1);
  }

  // Update order summary based on quantity
  function updateOrderSummary(quantity) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:updateOrderSummary',message:'Function called',data:{quantity:quantity},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
    // #endregion
    
    const bottles = parseInt(quantity) || 1;
    const totalPrice = PRICE_PER_BOTTLE * bottles;
    const totalSRP = PRICE_PER_BOTTLE * bottles; // Same as totalPrice since we're using SRP
    const totalSavings = 0; // No savings at SRP pricing
    const savingsPercent = 0; // No discount at SRP pricing
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:updateOrderSummary',message:'Calculated values',data:{bottles:bottles,totalPrice:totalPrice,totalSRP:totalSRP,totalSavings:totalSavings,savingsPercent:savingsPercent},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
    // #endregion

    const packageNameEl = document.getElementById('selectedPackageName');
    const packagePriceEl = document.getElementById('selectedPackagePrice');
    const totalPriceEl = document.getElementById('totalPrice');

    if (packageNameEl) {
      const bottleText = bottles === 1 ? 'Bottle' : 'Bottles';
      packageNameEl.textContent = `${bottles} ${bottleText}`;
    }

    if (packagePriceEl) {
      packagePriceEl.textContent = `₱${totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    if (totalPriceEl) {
      totalPriceEl.textContent = `₱${totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    // Update pricing comparison section with SRP-based calculations
    const specialPriceEl = document.getElementById('specialPrice');
    const savingsAmountEl = document.getElementById('savingsAmount');
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:updateOrderSummary',message:'Looking for price elements',data:{specialPriceElExists:!!specialPriceEl,savingsAmountElExists:!!savingsAmountEl},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
    // #endregion
    
    if (specialPriceEl) {
      specialPriceEl.textContent = `₱${totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:updateOrderSummary',message:'Updated special price',data:{newText:specialPriceEl.textContent},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
      // #endregion
    }
    
    if (savingsAmountEl) {
      const savingsText = `You Save: ₱${totalSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${savingsPercent}% OFF)`;
      savingsAmountEl.textContent = savingsText;
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:updateOrderSummary',message:'Updated savings amount',data:{newText:savingsText},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'QuantitySelection'})}).catch(()=>{});
      // #endregion
    }
  }

  // Form submission handler
  function initFormSubmission() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Initializing form submission',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
    // #endregion
    
    const orderForm = document.getElementById('orderForm');
    if (!orderForm) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Order form not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
      // #endregion
      return;
    }

    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Form submitted',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
      // #endregion

      // Get form data
      const formData = new FormData(this);
      const quantity = parseInt(formData.get('quantity')) || 1;
      const totalPrice = PRICE_PER_BOTTLE * quantity;

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Form data retrieved',data:{quantity:quantity,totalPrice:totalPrice},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
      // #endregion

      // Validate form
      if (!this.checkValidity()) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Form validation failed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
        // #endregion
        this.reportValidity();
        return;
      }

      // Check if quantity is more than 3, show partnership modal
      if (quantity > 3) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Quantity > 3, showing partnership modal',data:{quantity:quantity},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
        // #endregion
        showPartnershipModal();
        return;
      }

      // Process order for 1-3 bottles
      const orderData = {
        quantity: quantity,
        price: totalPrice,
        bottles: quantity,
        customer: {
          fullname: formData.get('fullname'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          province: formData.get('province'),
          address: formData.get('address')
        },
        timestamp: new Date().toISOString()
      };

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:initFormSubmission',message:'Processing order',data:{quantity:quantity,totalPrice:totalPrice},timestamp:Date.now(),sessionId:'debug-session',runId:'run10',hypothesisId:'FormSubmission'})}).catch(()=>{});
      // #endregion

      // Log order data (in production, send to server)
      console.log('Order submitted:', orderData);

      // Show success message
      alert('Thank you for your order! Your order has been received and you will receive a confirmation email shortly.');
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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:showPartnershipModal',message:'Showing partnership modal',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'PartnershipModal'})}).catch(()=>{});
    // #endregion
    
    const modal = document.getElementById('partnershipModal');
    if (!modal) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:showPartnershipModal',message:'Partnership modal not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'PartnershipModal'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Don't show if already shown in this session (but allow showing again when package changes)
    // Remove the restriction to allow showing when user changes packages
    // if (modal.dataset.shown === 'true') return;

    modal.classList.add('active');
    modal.dataset.shown = 'true';
    document.body.style.overflow = 'hidden';
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:showPartnershipModal',message:'Partnership modal shown',data:{modalActive:modal.classList.contains('active')},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'PartnershipModal'})}).catch(()=>{});
    // #endregion
  }

  function closePartnershipModal() {
    const modal = document.getElementById('partnershipModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function becomePartner() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b76d1cdd-97ac-45d2-af38-06bb397558d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'order.js:becomePartner',message:'Redirecting to bulk order form',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run8',hypothesisId:'PartnershipModal'})}).catch(()=>{});
    // #endregion
    
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
