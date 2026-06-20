/* rescens — rhode-style interactions
   All behaviors are idempotent: each handler attaches once via a data flag,
   so re-rendering in the Shopify theme editor doesn't double-bind. */

(function () {
  'use strict';

  function once(el, key, fn) {
    if (!el || el.dataset['rsBound_' + key]) return;
    el.dataset['rsBound_' + key] = '1';
    fn();
  }

  // BUNDLE SELECT (radio behaviour inside .rs-bundles)
  function initBundles(root) {
    (root || document).querySelectorAll('.rs-bundle').forEach(function (b) {
      once(b, 'bundle', function () {
        b.addEventListener('click', function () {
          var parent = b.closest('.rs-bundles');
          if (!parent) return;
          parent.querySelectorAll('.rs-bundle').forEach(function (x) { x.classList.remove('is-selected'); });
          b.classList.add('is-selected');
          var input = b.querySelector('input[type="radio"]');
          if (input) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // emit a custom event so a parent product form can react
          parent.dispatchEvent(new CustomEvent('rs:bundle-change', { detail: { value: b.dataset.value || null } }));
        });
      });
    });
  }

  // SUBSCRIPTION TOGGLE
  function initSubSwitch(root) {
    (root || document).querySelectorAll('.rs-sub-switch').forEach(function (sw) {
      once(sw, 'sub', function () {
        sw.addEventListener('click', function () { sw.classList.toggle('is-on'); });
      });
    });
  }

  // BOTTOM SHEET (variant picker)
  function initSheet(root) {
    (root || document).querySelectorAll('[data-rs-sheet]').forEach(function (sheet) {
      once(sheet, 'sheet', function () {
        var id = sheet.getAttribute('data-rs-sheet');
        var overlay = document.querySelector('[data-rs-sheet-overlay="' + id + '"]');
        var openBtns = document.querySelectorAll('[data-rs-sheet-open="' + id + '"]');
        var closeBtns = sheet.querySelectorAll('[data-rs-sheet-close]');

        function open() {
          sheet.classList.add('is-show');
          if (overlay) overlay.classList.add('is-show');
          document.body.style.overflow = 'hidden';
        }
        function close() {
          sheet.classList.remove('is-show');
          if (overlay) overlay.classList.remove('is-show');
          document.body.style.overflow = '';
        }
        openBtns.forEach(function (btn) { btn.addEventListener('click', open); });
        closeBtns.forEach(function (btn) { btn.addEventListener('click', close); });
        if (overlay) overlay.addEventListener('click', close);
      });
    });
  }

  // GALLERY DOT INDICATORS
  function initGallery(root) {
    (root || document).querySelectorAll('[data-rs-gallery]').forEach(function (gallery) {
      once(gallery, 'gallery', function () {
        var dots = gallery.parentElement.querySelectorAll('.rs-gallery-dot');
        var thumbs = gallery.parentElement.parentElement.querySelectorAll('.rs-thumb');

        function update() {
          var idx = Math.round(gallery.scrollLeft / gallery.clientWidth);
          dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
          thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === idx); });
        }
        gallery.addEventListener('scroll', update);

        thumbs.forEach(function (t, i) {
          t.addEventListener('click', function () {
            gallery.scrollTo({ left: gallery.clientWidth * i, behavior: 'smooth' });
          });
        });
      });
    });
  }

  // BEFORE/AFTER SLIDER
  function initBaSlider(root) {
    (root || document).querySelectorAll('[data-rs-ba]').forEach(function (slider) {
      once(slider, 'ba', function () {
        var after = slider.querySelector('.rs-ba-after');
        var divider = slider.querySelector('.rs-ba-divider');
        if (!after || !divider) return;
        var dragging = false;
        function update(x) {
          var rect = slider.getBoundingClientRect();
          var pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
          after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
          divider.style.left = pct + '%';
        }
        slider.addEventListener('mousedown', function (e) { dragging = true; update(e.clientX); });
        document.addEventListener('mousemove', function (e) { if (dragging) update(e.clientX); });
        document.addEventListener('mouseup', function () { dragging = false; });
        slider.addEventListener('touchstart', function (e) { dragging = true; update(e.touches[0].clientX); }, { passive: true });
        document.addEventListener('touchmove', function (e) {
          if (dragging) { e.preventDefault(); update(e.touches[0].clientX); }
        }, { passive: false });
        document.addEventListener('touchend', function () { dragging = false; });
      });
    });
  }

  // REVIEW FILTER PILLS (cosmetic toggle)
  function initFilters(root) {
    (root || document).querySelectorAll('.rs-filter-scroll').forEach(function (group) {
      once(group, 'filter', function () {
        group.querySelectorAll('.rs-filter-pill').forEach(function (p) {
          p.addEventListener('click', function () {
            group.querySelectorAll('.rs-filter-pill').forEach(function (x) { x.classList.remove('is-active'); });
            p.classList.add('is-active');
          });
        });
      });
    });
  }

  // FAQ SPLIT — smooth open/close for native <details> (both directions)
  function initFaqSplit(root) {
    (root || document).querySelectorAll('.rs-faqsplit-item').forEach(function (item) {
      once(item, 'faqsplit', function () {
        var summary = item.querySelector('summary');
        if (!summary) return;
        summary.addEventListener('click', function (e) {
          e.preventDefault();
          if (item.dataset.animating) return;
          item.dataset.animating = '1';
          var wrap = item.querySelector('.rs-faqsplit-answer-wrap');

          function clear() { delete item.dataset.animating; }

          if (item.open) {
            // collapse: animate to 0fr, then drop the open attribute
            if (wrap) {
              wrap.style.gridTemplateRows = '1fr';
              requestAnimationFrame(function () { wrap.style.gridTemplateRows = '0fr'; });
              wrap.addEventListener('transitionend', function te() {
                wrap.removeEventListener('transitionend', te);
                item.open = false;
                wrap.style.gridTemplateRows = '';
                clear();
              }, { once: true });
            } else { item.open = false; clear(); }
          } else {
            // expand: open first, then animate 0fr -> 1fr
            item.open = true;
            if (wrap) {
              wrap.style.gridTemplateRows = '0fr';
              requestAnimationFrame(function () { wrap.style.gridTemplateRows = '1fr'; });
              wrap.addEventListener('transitionend', function te() {
                wrap.removeEventListener('transitionend', te);
                wrap.style.gridTemplateRows = '';
                clear();
              }, { once: true });
            } else { clear(); }
          }
        });
      });
    });
  }

  function initAll(root) {
    initBundles(root);
    initSubSwitch(root);
    initSheet(root);
    initGallery(root);
    initBaSlider(root);
    initFilters(root);
    initFaqSplit(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  // Re-init when a Shopify section is reloaded in the theme editor
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:select', function (e) { initAll(e.target); });

  window.rescensInit = initAll;
})();
