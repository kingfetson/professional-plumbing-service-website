// ========== SCRIPT.JS ==========
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initFormHandler();
  initScrollReveal();
  setFooterYear();
});

// Sticky header on scroll
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Mobile navigation toggle
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeMobile');
  const mobileLinks = document.querySelectorAll('.m-link');

  if (!hamburger || !mobileNav) return;

  const open = () => {
    mobileNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    mobileNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);
  mobileLinks.forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerOffset = document.getElementById('header')?.offsetHeight || 80;
      const elementPos = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPos - headerOffset, behavior: 'smooth' });
    });
  });
}

// Contact Form Handler with validation & spinner
function initFormHandler() {
  const form = document.getElementById('premiumContactForm');
  if (!form) return;
  const submitBtn = document.getElementById('formSubmitBtn');
  const feedbackDiv = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phoneNumber')?.value.trim();
    const service = document.getElementById('serviceType')?.value;
    const message = document.getElementById('messageText')?.value.trim();

    if (!name) return showFeedback('error', 'Please enter your full name.');
    if (!phone) return showFeedback('error', 'Phone number is required.');
    const phoneClean = phone.replace(/\s/g, '');
    if (!/^[\+]?[0-9]{9,13}$/.test(phoneClean) && phoneClean.length < 9) {
      return showFeedback('error', 'Enter a valid phone number (e.g., 0712345678).');
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

    // Simulate API call (replace with actual fetch to backend/webhook)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Success simulation
    console.log({ name, phone, service, message, timestamp: new Date().toISOString() });
    showFeedback('success', '✓ Request sent! Our team will contact you within 15 minutes.');
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    setTimeout(() => { if (feedbackDiv) feedbackDiv.style.display = 'none'; }, 5000);
  });

  function showFeedback(type, msg) {
    if (!feedbackDiv) return;
    feedbackDiv.textContent = msg;
    feedbackDiv.style.display = 'block';
    if (type === 'success') {
      feedbackDiv.style.background = '#E8F5E9';
      feedbackDiv.style.color = '#2E7D32';
      feedbackDiv.style.border = '1px solid #A5D6A7';
    } else {
      feedbackDiv.style.background = '#FFEBEE';
      feedbackDiv.style.color = '#C62828';
      feedbackDiv.style.border = '1px solid #FFCDD2';
    }
  }
}

// Intersection Observer for reveal animations
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item, .contact-info-panel, .contact-form-panel');
  if (!revealElements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function setFooterYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
