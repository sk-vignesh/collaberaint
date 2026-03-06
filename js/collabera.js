/* collabera.js — Collabera International site scripts */
(function () {
    'use strict';

    /* ── Preloader ── */
    window.addEventListener('load', function () {
        var pl = document.getElementById('preloader');
        if (pl) { setTimeout(function () { pl.classList.add('hidden'); }, 1000); }
    });

    /* ── Year ── */
    document.querySelectorAll('#year').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* ── Header scroll ── */
    var header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ── Mobile nav ── */
    var navToggle = document.getElementById('navToggle');
    var mobileNav = document.getElementById('mobileNav');
    var mobileNavClose = document.getElementById('mobileNavClose');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; });
    }
    if (mobileNavClose && mobileNav) {
        mobileNavClose.addEventListener('click', function () { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
    }
    if (mobileNav) {
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { mobileNav.classList.remove('open'); document.body.style.overflow = ''; });
        });
    }

    /* ── Hero image swap ── */
    var heroImgs = document.querySelectorAll('.hero-img');
    var heroDots = document.querySelectorAll('.hero-dot');
    var current = 0;
    var heroInterval;

    function toSlide(i) {
        heroImgs[current].classList.remove('active');
        heroDots[current] && heroDots[current].classList.remove('active');
        current = (i + heroImgs.length) % heroImgs.length;
        heroImgs[current].classList.add('active');
        heroDots[current] && heroDots[current].classList.add('active');
    }
    if (heroImgs.length > 1) {
        heroInterval = setInterval(function () { toSlide(current + 1); }, 6000);
        heroDots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { clearInterval(heroInterval); toSlide(i); heroInterval = setInterval(function () { toSlide(current + 1); }, 6000); });
        });
    }

    /* ── Scroll fade animations ── */
    var animEls = document.querySelectorAll('.fade-up, .fade-in');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        animEls.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 0.1 + 's'; observer.observe(el); });
    } else {
        animEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ── Stat counters ── */
    var statNums = document.querySelectorAll('.stat-number');
    if ('IntersectionObserver' in window) {
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = el.textContent.trim();
                var num = parseInt(target.replace(/[^0-9]/g, ''), 10);
                if (isNaN(num) || num === 0) return;
                var suffix = target.replace(/[0-9]/g, '');
                var start = null;
                var dur = 1400;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * num) + suffix;
                    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
                }
                requestAnimationFrame(step);
                counterObs.unobserve(el);
            });
        }, { threshold: 0.5 });
        statNums.forEach(function (el) { counterObs.observe(el); });
    }

    /* ── Contact form ── */
    var form = document.getElementById('contactForm');
    var formMsg = document.getElementById('formMessage');
    if (form && formMsg) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            form.querySelectorAll('[required]').forEach(function (f) {
                if (!f.value.trim() || (f.type === 'checkbox' && !f.checked)) { valid = false; f.style.borderColor = '#c0392b'; }
                else f.style.borderColor = '';
            });
            if (!valid) {
                formMsg.style.display = 'block';
                formMsg.style.cssText += '; background:#fdecea; color:#c0392b; border:1px solid #f5c6cb;';
                formMsg.textContent = 'Please complete all required fields.';
                return;
            }
            var btn = form.querySelector('[type="submit"]');
            btn.disabled = true; btn.textContent = 'Sending…';
            setTimeout(function () {
                formMsg.style.display = 'block';
                formMsg.style.cssText += '; background:#eaf7f0; color:#1a6640; border:1px solid #b7e4cb;';
                formMsg.textContent = 'Thank you — we\'ll be in touch within one business day.';
                form.reset(); btn.disabled = false; btn.textContent = 'Send Message';
            }, 800);
        });
        form.querySelectorAll('input, textarea, select').forEach(function (f) {
            f.addEventListener('input', function () { f.style.borderColor = ''; });
        });
    }

})();
