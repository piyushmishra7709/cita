/* CITA Bharat EV — header / menu behaviour (no dependencies) */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var header = document.getElementById('citaHeader');
    if (!header) return;

    var body = document.body;
    var burger = header.querySelector('.cita-burger');
    var nav = header.querySelector('.cita-nav');
    var overlay = header.querySelector('.cita-overlay');
    var closeBtn = header.querySelector('.cita-close');
    var desktop = window.matchMedia('(min-width: 1280px)');

    function closeSubs(except) {
      header.querySelectorAll('.cita-menu > li.is-open').forEach(function (li) {
        if (li === except) return;
        li.classList.remove('is-open');
        var b = li.querySelector('.cita-caret');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }

    function setDrawer(open) {
      body.classList.toggle('cita-nav-open', open);
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeSubs();
      else if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
    }

    if (burger) burger.addEventListener('click', function () {
      setDrawer(!body.classList.contains('cita-nav-open'));
    });
    if (closeBtn) closeBtn.addEventListener('click', function () {
      setDrawer(false);
      if (burger) burger.focus();
    });
    if (overlay) overlay.addEventListener('click', function () { setDrawer(false); });

    // sub-menu toggles (caret buttons)
    header.querySelectorAll('.cita-caret').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var li = btn.parentElement;
        var willOpen = !li.classList.contains('is-open');
        closeSubs(li);
        li.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    // links inside the drawer close it (same-page anchors included)
    header.querySelectorAll('.cita-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!desktop.matches) setDrawer(false);
      });
    });

    // click outside closes desktop dropdowns
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeSubs();
    });

    // Escape closes drawer / dropdowns
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (body.classList.contains('cita-nav-open')) {
        setDrawer(false);
        if (burger) burger.focus();
      } else {
        closeSubs();
      }
    });

    // switching to desktop width resets the drawer
    var onBreakpoint = function () {
      if (desktop.matches) setDrawer(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);

    // shadow once the page has scrolled
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 4);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
