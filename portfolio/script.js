/* ============================================================
   script.js  —  Dr. Ahmad Tayeb Portfolio  |  CPIT-405
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── MOBILE HAMBURGER MENU ─────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }


  /* ── ACTIVE NAV HIGHLIGHT (sidebar smooth scroll) ──────── */
  const sections = document.querySelectorAll('article[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

  if (sections.length > 0 && sidebarLinks.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sidebarLinks.forEach(function (link) {
            link.classList.remove('active-section');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active-section');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (sec) { observer.observe(sec); });
  }


  /* ── CONTACT FORM (Web3Forms) ───────────────────────────── */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic client-side validation
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body:   data,
          headers: { 'Accept': 'application/json' }
        });

        const json = await res.json();

        if (json.success) {
          showStatus('✓ Your message has been sent successfully! I\'ll get back to you soon.', 'success');
          form.reset();
        } else {
          showStatus('Something went wrong. Please try again or email me directly.', 'error');
        }
      } catch (err) {
        showStatus('Network error. Please check your connection and try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });

    function showStatus(msg, type) {
      formStatus.textContent = msg;
      formStatus.className   = 'form-status ' + type;
      formStatus.style.display = 'block';
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (type === 'success') {
        setTimeout(function () {
          formStatus.style.display = 'none';
        }, 6000);
      }
    }
  }


  /* ── FADE-IN ON SCROLL ──────────────────────────────────── */
  const cards = document.querySelectorAll('.card');

  if ('IntersectionObserver' in window && cards.length > 0) {
    cards.forEach(function (card) {
      card.style.opacity  = '0';
      card.style.transform = 'translateY(18px)';
      card.style.transition = 'opacity .4s ease, transform .4s ease';
    });

    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function (card) { fadeObserver.observe(card); });
  }

});
