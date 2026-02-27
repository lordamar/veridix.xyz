/* ============================================================
   VERIDIX — Main Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar: glass effect on scroll ───────────────────────
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Scroll-reveal: fade-up on intersection ────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

  // ── Mobile navigation toggle ──────────────────────────────
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Smooth scroll for all anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Contact form ──────────────────────────────────────────
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (form && submitBtn) {
    const isFormspreeConfigured = () =>
      form.action && !form.action.includes('YOUR_FORM_ID');

    form.addEventListener('submit', async (e) => {
      // If Formspree is not yet configured, show a friendly demo response
      if (!isFormspreeConfigured()) {
        e.preventDefault();
        showSuccess();
        return;
      }

      // Formspree is configured — add loading state, let the browser submit
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Handle Formspree AJAX response
      e.preventDefault();
      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          showSuccess();
        } else {
          submitBtn.textContent = 'Something went wrong — try again';
          submitBtn.disabled = false;
          setTimeout(() => {
            submitBtn.textContent = 'Send Message';
          }, 3500);
        }
      } catch {
        submitBtn.textContent = 'Network error — please try again';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
        }, 3500);
      }
    });

    function showSuccess() {
      submitBtn.textContent = 'Message Sent ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      if (successMsg) successMsg.classList.add('visible');
      form.reset();

      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        if (successMsg) successMsg.classList.remove('visible');
      }, 4000);
    }
  }

});
