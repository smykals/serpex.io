/* Inquiry metrics contain no field values or customer contact details. */
(() => {
  const pendingKey = 'serpex-inquiry-pending';
  const form = document.querySelector('#inquiry-form');
  const options = document.querySelector('#inquiry-options');
  const service = document.querySelector('#service-choice');

  function track(name, extra = {}) {
    if (typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', name, {
        send_to: 'G-M96R1WY7JR',
        form_id: 'inquiry-form',
        ...extra
      });
    } catch (_) {
      // Tracking must never prevent contacting Serpex.
    }
  }

  if (options && service && new URLSearchParams(location.search).get('service') === service.value) {
    options.open = true;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.getAttribute('href').startsWith('mailto:')) {
      track('email_click');
    } else if (link.matches('.button,[data-service]') && new URL(link.href).hash === '#contact') {
      track('assessment_click');
      if (options && link.dataset.service) options.open = true;
    }
  });

  if (form) {
    let started = false;
    let submitting = false;
    form.addEventListener('input', () => {
      if (!started) {
        started = true;
        track('inquiry_start');
      }
    });
    window.addEventListener('pageshow', () => { submitting = false; });
    form.addEventListener('submit', event => {
      if (event.defaultPrevented || !form.checkValidity()) return;
      event.preventDefault();
      if (submitting) return;
      submitting = true;
      try { sessionStorage.setItem(pendingKey, String(Date.now())); } catch (_) {}
      let sent = false;
      const continueSubmission = () => {
        if (sent) return;
        sent = true;
        HTMLFormElement.prototype.submit.call(form);
      };
      // Give Analytics a brief chance to send before navigating to FormSubmit.
      // This fallback works even with an ad blocker or unavailable Analytics.
      setTimeout(continueSubmission, 500);
      track('inquiry_submit', { event_callback: continueSubmission, event_timeout: 450 });
    });
  }

  if (location.pathname.endsWith('/thanks.html')) {
    let submittedAt = 0;
    try {
      submittedAt = Number(sessionStorage.getItem(pendingKey));
      sessionStorage.removeItem(pendingKey);
    } catch (_) {}
    const age = Date.now() - submittedAt;
    if (submittedAt > 0 && age >= 0 && age <= 30 * 60 * 1000) {
      // A return after submission, not verification of inbox delivery.
      track('inquiry_confirmation');
    }
  }
})();
