/**
 * Kiosk: home view (video + CTA) and order form per Order Form JPG.
 * Submit sends to /api/send-order-email (fullName, location, email, contactNumber, message), then returns to home.
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
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = (form.querySelector('[name="fullName"]') || {}).value || '';
        const location = (form.querySelector('[name="location"]') || {}).value || '';
        const email = (form.querySelector('[name="email"]') || {}).value || '';
        const contactNumber = (form.querySelector('[name="contactNumber"]') || {}).value || '';
        const message = (form.querySelector('[name="message"]') || {}).value || '';

        if (!fullName.trim()) {
          showToast('Please enter your full name.', true);
          return;
        }
        if (!location.trim()) {
          showToast('Please enter your location.', true);
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
        if (!message.trim()) {
          showToast('Please enter a message.', true);
          return;
        }

        const payload = {
          fullName: fullName.trim(),
          location: location.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
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
