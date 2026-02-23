/**
 * Kiosk: home view (video + CTA) and order form per Order Form JPG.
 * Submit sends to /api/send-order-email (fullName, location, email, contactNumber, herdSize, message), then returns to home.
 */
(function () {
  'use strict';

  const API_URL = window.location.protocol === 'file:'
    ? 'https://www.swinetech.ph/api/send-order-email'
    : '/api/send-order-email';
  const isTestMode = /\b(?:test|kiosk_test)=1\b/.test(window.location.search || '');

  const homeView = document.getElementById('kioskHomeView');
  const formView = document.getElementById('kioskFormView');
  const videoEl = document.getElementById('kioskVideo');
  const ctaSecure = document.getElementById('kioskCtaSecure');
  const backBtn = document.getElementById('kioskBackBtn');
  const form = document.getElementById('kioskOrderForm');
  const submitBtn = document.getElementById('kioskSubmitBtn');
  const toast = document.getElementById('kioskToast');
  const provinceInput = document.getElementById('kioskLocation');
  const provinceOptions = document.getElementById('kioskProvinceOptions');
  let highlightedProvinceIndex = -1;
  let visibleProvinces = [];
  const PROVINCES = [
    'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay', 'Antique', 'Apayao', 'Aurora',
    'Basilan', 'Bataan', 'Batanes', 'Batangas', 'Benguet', 'Biliran', 'Bohol', 'Bukidnon', 'Bulacan',
    'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes', 'Cavite', 'Cebu',
    'Cotabato', 'Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental',
    'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte', 'Ilocos Sur', 'Iloilo',
    'Isabela', 'Kalinga', 'La Union', 'Laguna', 'Lanao del Norte', 'Lanao del Sur', 'Leyte',
    'Maguindanao del Norte', 'Maguindanao del Sur', 'Marinduque', 'Masbate', 'Metro Manila',
    'Misamis Occidental', 'Misamis Oriental', 'Mountain Province', 'Negros Occidental', 'Negros Oriental',
    'Northern Samar', 'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro',
    'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Samar', 'Sarangani',
    'Siquijor', 'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat', 'Sulu',
    'Surigao del Norte', 'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte',
    'Zamboanga del Sur', 'Zamboanga Sibugay'
  ];

  function closeProvinceOptions() {
    if (!provinceOptions || !provinceInput) return;
    provinceOptions.hidden = true;
    provinceInput.setAttribute('aria-expanded', 'false');
    highlightedProvinceIndex = -1;
  }

  function openProvinceOptions() {
    if (!provinceOptions || !provinceInput || visibleProvinces.length === 0) return;
    provinceOptions.hidden = false;
    provinceInput.setAttribute('aria-expanded', 'true');
  }

  function renderProvinceOptions(query) {
    if (!provinceOptions || !provinceInput) return;
    const normalizedQuery = (query || '').trim().toLowerCase();
    visibleProvinces = PROVINCES.filter(function (province) {
      return province.toLowerCase().includes(normalizedQuery);
    }).slice(0, 12);

    provinceOptions.innerHTML = '';
    highlightedProvinceIndex = -1;

    visibleProvinces.forEach(function (province, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'kiosk-autocomplete__option';
      button.setAttribute('role', 'option');
      button.textContent = province;
      button.addEventListener('mousedown', function (event) {
        event.preventDefault();
      });
      button.addEventListener('click', function () {
        provinceInput.value = province;
        closeProvinceOptions();
      });
      provinceOptions.appendChild(button);

      if (index === highlightedProvinceIndex) {
        button.classList.add('kiosk-autocomplete__option--active');
      }
    });

    if (visibleProvinces.length > 0) {
      openProvinceOptions();
    } else {
      closeProvinceOptions();
    }
  }

  function setProvinceHighlight(nextIndex) {
    if (!provinceOptions || visibleProvinces.length === 0) return;
    const maxIndex = visibleProvinces.length - 1;
    highlightedProvinceIndex = Math.max(0, Math.min(nextIndex, maxIndex));
    const optionButtons = provinceOptions.querySelectorAll('.kiosk-autocomplete__option');
    optionButtons.forEach(function (button, index) {
      button.classList.toggle('kiosk-autocomplete__option--active', index === highlightedProvinceIndex);
    });
  }

  function isValidProvince(value) {
    return PROVINCES.indexOf((value || '').trim()) !== -1;
  }

  function setupProvinceAutocomplete() {
    if (!provinceInput) return;

    provinceInput.addEventListener('focus', function () {
      renderProvinceOptions(provinceInput.value);
    });

    provinceInput.addEventListener('input', function () {
      renderProvinceOptions(provinceInput.value);
    });

    provinceInput.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (provinceOptions && provinceOptions.hidden) {
          renderProvinceOptions(provinceInput.value);
        }
        setProvinceHighlight(highlightedProvinceIndex + 1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setProvinceHighlight(highlightedProvinceIndex - 1);
        return;
      }

      if (event.key === 'Enter' && highlightedProvinceIndex >= 0) {
        event.preventDefault();
        provinceInput.value = visibleProvinces[highlightedProvinceIndex];
        closeProvinceOptions();
        return;
      }

      if (event.key === 'Escape') {
        closeProvinceOptions();
      }
    });

    provinceInput.addEventListener('blur', function () {
      setTimeout(function () {
        closeProvinceOptions();
      }, 120);
    });
  }

  function showView(activeView) {
    const isHome = activeView === homeView;
    homeView.classList.toggle('kiosk-view--active', isHome);
    formView.classList.toggle('kiosk-view--active', !isHome);
    homeView.setAttribute('aria-hidden', isHome ? 'false' : 'true');
    formView.setAttribute('aria-hidden', isHome ? 'true' : 'false');
    if (videoEl) {
      if (isHome) {
        videoEl.play().catch(function () {});
      } else {
        videoEl.pause();
      }
    }
  }

  function showForm() {
    showView(formView);
  }

  function showHome() {
    showView(homeView);
  }

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('kiosk-toast--error');
    if (isError) toast.classList.add('kiosk-toast--error');
    toast.classList.add('kiosk-toast--visible');
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      toast.classList.remove('kiosk-toast--visible');
      toast.setAttribute('aria-hidden', 'true');
    }, 4000);
  }

  function resetForm() {
    if (form) form.reset();
    closeProvinceOptions();
  }

  function validatePhone(value) {
    const cleaned = (value || '').replace(/\D/g, '');
    // Accept 09XXXXXXXXX (11 digits) or 63XXXXXXXXX (12 digits, e.g. 639...)
    return /^09\d{9}$/.test(cleaned) || /^63\d{9}$/.test(cleaned);
  }

  function validateEmail(value) {
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value || '');
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    if (ctaSecure) {
      ctaSecure.addEventListener('click', function () {
        showForm();
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        showHome();
      });
    }

    if (form) {
      setupProvinceAutocomplete();

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = (form.querySelector('[name="fullName"]') || {}).value || '';
        const location = (form.querySelector('[name="location"]') || {}).value || '';
        const email = (form.querySelector('[name="email"]') || {}).value || '';
        const contactNumber = (form.querySelector('[name="contactNumber"]') || {}).value || '';
        const herdSize = (form.querySelector('[name="herdSize"]') || {}).value || '';
        const message = (form.querySelector('[name="message"]') || {}).value || '';

        if (!fullName.trim()) {
          showToast('Please enter your full name.', true);
          return;
        }
        if (!location.trim()) {
          showToast('Please select your location.', true);
          return;
        }
        if (!isValidProvince(location)) {
          showToast('Please choose a province from the dropdown list.', true);
          return;
        }
        if (!validateEmail(email)) {
          showToast('Please enter a valid email address.', true);
          return;
        }
        if (!validatePhone(contactNumber)) {
          showToast('Please enter a valid phone number (e.g. 09XX XXX XXXX or +63 9XX XXX XXXX).', true);
          return;
        }
        if (herdSize && !/^\d+$/.test(herdSize.trim())) {
          showToast('Herd size must be a valid number.', true);
          return;
        }
        if (!message.trim()) {
          showToast('Please enter a message.', true);
          return;
        }

        const payload = {
          fullName: fullName.trim(),
          location: location.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
          herdSize: herdSize ? Number(herdSize) : undefined,
          message: message.trim()
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        if (isTestMode) {
          setTimeout(function () {
            showToast('Thank you! We\'ll keep you updated.');
            resetForm();
            showHome();
            submitBtn.disabled = false;
            submitBtn.textContent = 'SECURE MY SUPPLY';
          }, 800);
          return;
        }

        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().then(function (data) {
              if (!res.ok) throw new Error(data.error || 'Failed to send');
              return data;
            });
          })
          .then(function () {
            showToast('Thank you! We\'ll keep you updated.');
            resetForm();
            showHome();
          })
          .catch(function (err) {
            showToast(err.message || 'Something went wrong. Please try again.', true);
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'SECURE MY SUPPLY';
          });
      });
    }

    if (videoEl) {
      videoEl.play().catch(function () {});
    }
  }

  init();
})();
