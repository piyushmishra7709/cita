// CITA Bharat EV — shared front-end behaviour

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((el) => {
        if (el !== item) el.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  // Tabs (solutions page)
  document.querySelectorAll('.tab-bar').forEach((bar) => {
    const buttons = bar.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach((p) => {
          p.classList.toggle('active', p.getAttribute('data-panel') === target);
        });
      });
    });
  });

  // Contact / quote form — demo submit handler.
  // Replace this with a real endpoint (e.g. a PHP handler or form service) before going live.
  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = quoteForm.querySelector('.form-feedback');
      if (note) {
        note.textContent = 'Thanks — your enquiry has been noted. Our team will reach out shortly. (Connect this form to your CRM/email backend to make it live.)';
        note.style.display = 'block';
      }
      quoteForm.reset();
    });
  }

  // Highlight active nav link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
  });
});
