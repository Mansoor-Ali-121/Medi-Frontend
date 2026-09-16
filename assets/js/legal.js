/**
 * ShifaCare Plus - Legal Pages JavaScript (legal.js)
 * Privacy Policy & Terms and Conditions Interactive Features
 * 100% PURE TAILWIND - ZERO BOOTSTRAP
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initLegalSearch();
  initCopySectionLinks();
  initPrintHandlers();
  initLegalAcknowledgeBanner();
});

/**
 * Mobile Navigation Toggle (Pure Tailwind)
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggleBtn');
  const mobileMenu = document.getElementById('mobileNavMenu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    }
  });
}

/**
 * Scroll Spy for Table of Contents & Mobile Auto-Close Fix
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('.legal-section');
  const tocLinks = document.querySelectorAll('.legal-toc-link');
  const mobileMenu = document.getElementById('mobileNavMenu');

  if (!sections.length || !tocLinks.length) return;

  // Handle click on TOC links for smooth scrolling and mobile menu auto-collapse
  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL hash safely without jumping
          history.pushState(null, null, targetId);

          // If mobile menu is open (dropdown or drawer), automatically close it on click
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
          }
        }
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('bg-sky-50', 'text-sky-700', 'font-bold', 'border-l-4', 'border-sky-600');
            link.classList.remove('text-slate-600', 'hover:bg-slate-50', 'border-transparent');
            
            // Scroll container smoothly
            const tocBody = document.querySelector('.legal-toc-body');
            if (tocBody) {
              const linkTop = link.offsetTop;
              const linkBottom = linkTop + link.offsetHeight;
              const tocTop = tocBody.scrollTop;
              const tocBottom = tocTop + tocBody.clientHeight;
              if (linkTop < tocTop || linkBottom > tocBottom) {
                tocBody.scrollTo({ top: linkTop - 40, behavior: 'smooth' });
              }
            }
          } else {
            link.classList.remove('bg-sky-50', 'text-sky-700', 'font-bold', 'border-l-4', 'border-sky-600');
            link.classList.add('text-slate-600', 'hover:bg-slate-50', 'border-transparent');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Filter / Search through Legal Sections
 */
function initLegalSearch() {
  const searchInput = document.getElementById('legalSearchInput');
  const clearBtn = document.getElementById('legalSearchClear');
  const countDisplay = document.getElementById('legalSearchResultsCount');
  const sections = document.querySelectorAll('.legal-section');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
    }

    if (!query) {
      sections.forEach((s) => {
        s.style.display = 'block';
      });
      if (countDisplay) countDisplay.textContent = '';
      return;
    }

    let matchCount = 0;
    sections.forEach((section) => {
      const text = section.innerText.toLowerCase();
      if (text.includes(query)) {
        section.style.display = 'block';
        matchCount++;
      } else {
        section.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = matchCount === 0 
        ? 'No matching clauses found' 
        : `Showing ${matchCount} of ${sections.length} clauses`;
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    });
  }
}

/**
 * Copy Direct Link to Section
 */
function initCopySectionLinks() {
  const copyButtons = document.querySelectorAll('.legal-copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      if (!sectionId) return;

      const fullUrl = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-600 mr-1"></i>Copied!';
        showToast('Link copied to clipboard', 'You can now share this specific clause URL.');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2200);
      }).catch(() => {
        showToast('Section Link', fullUrl);
      });
    });
  });
}

/**
 * Print & Export Handlers
 */
function initPrintHandlers() {
  const printBtns = document.querySelectorAll('.btn-print-legal');
  printBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}

/**
 * Legal Acknowledgment LocalStorage helper
 */
function initLegalAcknowledgeBanner() {
  const banner = document.getElementById('legalAckBanner');
  const ackBtn = document.getElementById('legalAckBtn');
  const pageType = document.body.getAttribute('data-legal-page') || 'policy';
  const storageKey = `shifacare_read_${pageType}_2026`;

  if (!banner || !ackBtn) return;

  if (localStorage.getItem(storageKey)) {
    banner.style.display = 'none';
  } else {
    banner.style.display = 'flex';
  }

  ackBtn.addEventListener('click', () => {
    localStorage.setItem(storageKey, new Date().toISOString());
    banner.style.display = 'none';
    showToast('Preference Saved', 'Thank you for reviewing our healthcare regulatory guidelines.');
  });
}

/**
 * Toast Notification Helper (Pure Tailwind)
 */
function showToast(title, message) {
  const container = document.getElementById('toast-notification-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 text-white border border-slate-700 shadow-2xl rounded-2xl p-4 mb-3 flex items-start gap-3 transition-all duration-300 transform translate-y-2 opacity-0 max-w-sm';

  toast.innerHTML = `
    <div class="text-sky-400 text-lg mt-0.5 shrink-0"><i class="fa-solid fa-circle-info"></i></div>
    ANZ
    <div class="flex-1 min-w-0">
      <div class="font-bold text-sm text-white">${title}</div>
      <div class="text-xs text-slate-300 mt-0.5 leading-relaxed">${message}</div>
    </div>
    <button type="button" class="text-slate-400 hover:text-white text-base leading-none shrink-0">&times;</button>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 20);

  // Close button
  toast.querySelector('button').addEventListener('click', () => {
    toast.remove();
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}