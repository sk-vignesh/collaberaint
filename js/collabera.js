/* collabera.js — Collabera International v2 */
(function () {
    'use strict';

    /* ── Preloader ── */
    window.addEventListener('load', function () {
        var pl = document.getElementById('preloader');
        if (pl) setTimeout(function () { pl.classList.add('hidden'); }, 900);
    });

    /* ── Year ── */
    document.querySelectorAll('#year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ── Mobile menu ── */
    var btn = document.getElementById('menuBtn');
    var overlay = document.getElementById('mobileOverlay');
    function toggleMenu(open) {
        if (!btn || !overlay) return;
        btn.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }
    if (btn) btn.addEventListener('click', function () { toggleMenu(!btn.classList.contains('open')); });
    if (overlay) overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

    /* ── Scroll fade animations ── */
    var obs;
    if ('IntersectionObserver' in window) {
        obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.fade-up, .fade-in').forEach(function (el, i) {
            el.style.transitionDelay = (i % 5) * 0.08 + 's';
            obs.observe(el);
        });
    } else {
        document.querySelectorAll('.fade-up, .fade-in').forEach(function (el) { el.classList.add('visible'); });
    }

    /* ── Marquee pause on hover ── */
    var track = document.querySelector('.marquee-track');
    if (track) {
        track.parentElement.addEventListener('mouseenter', function () { track.style.animationPlayState = 'paused'; });
        track.parentElement.addEventListener('mouseleave', function () { track.style.animationPlayState = 'running'; });
    }

    /* ── Hero image subtle zoom ── */
    var heroImg = document.querySelector('.hero-image img');
    if (heroImg) { setTimeout(function () { heroImg.style.transform = 'scale(1.04)'; }, 100); }

    /* ── Stat counters (for bento stats) ── */
    if ('IntersectionObserver' in window) {
        var cObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target; var raw = el.textContent.trim();
                var num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
                if (isNaN(num) || num < 2) return;
                var suffix = raw.replace(/[0-9]/g, '');
                var start = null;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / 1200, 1);
                    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * num) + suffix;
                    if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
                }
                requestAnimationFrame(step);
                cObs.unobserve(el);
            });
        }, { threshold: 0.6 });
        document.querySelectorAll('.bento-stat .big').forEach(function (el) { cObs.observe(el); });
    }

    /* ── Contact form ── */
    var form = document.getElementById('contactForm');
    var msg = document.getElementById('formMessage');
    if (form && msg) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            form.querySelectorAll('[required]').forEach(function (f) {
                var bad = !f.value.trim() || (f.type === 'checkbox' && !f.checked);
                f.style.borderColor = bad ? '#ff4d4d' : '';
                if (bad) valid = false;
            });
            if (!valid) {
                msg.style.display = 'block';
                msg.style.cssText += '; background:rgba(255,77,77,0.1); color:#ff8080; border:1px solid rgba(255,77,77,0.3); border-radius:8px;';
                msg.textContent = 'Please complete all required fields.'; return;
            }
            var submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
            setTimeout(function () {
                msg.style.display = 'block';
                msg.style.cssText += '; background:rgba(202,255,51,0.08); color:var(--lime); border:1px solid rgba(202,255,51,0.25); border-radius:8px;';
                msg.textContent = '✓ Message sent — we\'ll be in touch within one business day.';
                form.reset(); submitBtn.disabled = false; submitBtn.textContent = 'Send Message →';
            }, 800);
        });
        form.querySelectorAll('input, textarea, select').forEach(function (f) {
            f.addEventListener('input', function () { f.style.borderColor = ''; });
        });
    }

})();
