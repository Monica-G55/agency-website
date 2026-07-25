(function () {
  'use strict';

  /* --------------------------------------------------------------------
     Mobile nav toggle
     -------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------
     Altimeter - scroll-progress reading tied to page position
     -------------------------------------------------------------------- */
  var altimeterValue = document.getElementById('altimeterValue');

  if (altimeterValue) {
    var ticking = false;

    function updateAltimeter() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      var metres = Math.round(progress * 8848); // Everest summit, as a playful ceiling
      altimeterValue.textContent = metres.toLocaleString('en-IN') + 'M';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateAltimeter);
        ticking = true;
      }
    }, { passive: true });

    updateAltimeter();
  }

  var form = document.getElementById('contactForm');
  if (!form) return;

  var statusEl = document.getElementById('formStatus');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var fields = {
    fullName: {
      el: document.getElementById('fullName'),
      errorEl: document.getElementById('fullNameError'),
      validate: function (value) {
        return value.trim().length >= 2 ? '' : 'Enter your full name.';
      }
    },
    email: {
      el: document.getElementById('email'),
      errorEl: document.getElementById('emailError'),
      validate: function (value) {
        if (!value.trim()) return 'Enter your email address.';
        return emailPattern.test(value.trim()) ? '' : 'Enter a valid email address.';
      }
    },
    budget: {
      el: document.getElementById('budget'),
      errorEl: document.getElementById('budgetError'),
      validate: function (value) {
        return value ? '' : 'Select an approximate budget.';
      }
    },
    message: {
      el: document.getElementById('message'),
      errorEl: document.getElementById('messageError'),
      validate: function (value) {
        return value.trim().length >= 10 ? '' : 'Tell us a little more (10 characters minimum).';
      }
    }
  };

  function showError(field, message) {
    field.errorEl.textContent = message;
    field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(key) {
    var field = fields[key];
    var message = field.validate(field.el.value);
    showError(field, message);
    return !message;
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.el.addEventListener('blur', function () { validateField(key); });
    field.el.addEventListener('input', function () {
      if (field.el.getAttribute('aria-invalid') === 'true') validateField(key);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var honeypot = document.getElementById('company_website');
    if (honeypot && honeypot.value) {
      return;
    }

    var allValid = Object.keys(fields).reduce(function (valid, key) {
      var fieldValid = validateField(key);
      return valid && fieldValid;
    }, true);

    if (!allValid) {
      statusEl.textContent = 'Please fix the highlighted fields before sending.';
      statusEl.dataset.state = 'error';
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend wired up for this exercise - simulate a successful send.
    statusEl.textContent = 'Thanks — your message is in. We\u2019ll reply within one business day.';
    statusEl.dataset.state = 'success';
    form.reset();
    Object.keys(fields).forEach(function (key) { showError(fields[key], ''); });
  });
})();
