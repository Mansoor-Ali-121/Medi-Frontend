/**
 * Islamabad & Rawalpindi Healthcare Portal - main.js
 * Global scripts, Natural Language search simulation, Location selector & Toast feedback
 */

document.addEventListener('DOMContentLoaded', () => {
    initLocationSelector();
    initSmartSearch();
    initEmergencyHotline();
    initGlobalModals();
    initFaqModule();
    initNavbarInteractions();
});

// City / Location State Management
function initLocationSelector() {
    const currentCity = localStorage.getItem('selected_city') || 'All Twin Cities';
    const locationPills = document.querySelectorAll('.selected-city-text');
    locationPills.forEach(el => {
        el.textContent = currentCity;
    });

    const cityDropdownItems = document.querySelectorAll('.city-dropdown-option');
    cityDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenCity = item.getAttribute('data-city') || 'All Twin Cities';
            localStorage.setItem('selected_city', chosenCity);
            locationPills.forEach(el => el.textContent = chosenCity);
            showToast('Location Updated', `Filtered view set to: ${chosenCity}`, 'info');

            if (typeof window.applyCityFilter === 'function') {
                window.applyCityFilter(chosenCity);
            }
        });
    });
}

// Natural Language / Smart Search Engine Simulation
function initSmartSearch() {
    const searchInput = document.getElementById('global-smart-search');
    const suggestionsBox = document.getElementById('search-suggestions-box');
    const searchBtn = document.getElementById('btn-smart-search');
    const quickPills = document.querySelectorAll('.quick-prompt-pill');

    if (!searchInput) return;

    const simulatedKnowledgeBase = [
        { query: "Need female nurse for elderly mother in F-8 Islamabad", type: "Home Nurse", link: "nurses.html?service=elderly&city=Islamabad", icon: "fa-user-nurse" },
        { query: "ICU / Post-surgery home nursing Rawalpindi Saddar", type: "Home Nurse", link: "nurses.html?service=post-op&city=Rawalpindi", icon: "fa-heart-pulse" },
        { query: "Best Cardiologist in Shifa International Hospital", type: "Doctor", link: "doctors.html?specialty=Cardiologist&hospital=Shifa", icon: "fa-user-doctor" },
        { query: "Pediatrician available today near Blue Area Islamabad", type: "Doctor", link: "doctors.html?specialty=Pediatrician&city=Islamabad", icon: "fa-baby" },
        { query: "24/7 Emergency trauma center in Rawalpindi (Holy Family)", type: "Hospital", link: "hospitals.html?emergency=247&city=Rawalpindi", icon: "fa-hospital" },
        { query: "Quaid-e-Azam International Hospital emergency number", type: "Hospital", link: "hospitals.html?query=quaid", icon: "fa-phone-volume" },
        { query: "Stroke recovery physiotherapist and home nurse DHA Islamabad", type: "Home Nurse", link: "nurses.html?service=stroke&city=Islamabad", icon: "fa-wheelchair" },
        { query: "Gynecologist in Maroof International F-10 Islamabad", type: "Doctor", link: "doctors.html?specialty=Gynecologist&city=Islamabad", icon: "fa-stethoscope" }
    ];

    quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const promptText = pill.getAttribute('data-prompt') || pill.textContent.trim();
            searchInput.value = promptText;
            triggerSearchAction(promptText);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();
        if (!suggestionsBox) return;

        if (val.length < 2) {
            suggestionsBox.classList.remove('active');
            return;
        }

        const matches = simulatedKnowledgeBase.filter(item =>
            item.query.toLowerCase().includes(val) || item.type.toLowerCase().includes(val)
        );

        if (matches.length > 0) {
            suggestionsBox.innerHTML = matches.map(m => `
                <div class="suggestion-item" onclick="window.location.href='${m.link}'">
                    <i class="fa-solid ${m.icon} text-primary"></i>
                    <div>
                        <div class="fw-semibold text-dark text-sm">${m.query}</div>
                        <div class="text-xs text-muted">Category: <span class="badge bg-light text-dark">${m.type}</span></div>
                    </div>
                    <i class="fa-solid fa-arrow-right ms-auto text-muted"></i>
                </div>
            `).join('');
            suggestionsBox.classList.add('active');
        } else {
            suggestionsBox.innerHTML = `
                <div class="p-3 text-center text-muted text-sm">
                    <i class="fa-solid fa-sparkles text-primary me-2"></i>
                    Searching twin cities database for "${e.target.value}"...
                    <div class="mt-2">
                        <a href="doctors.html?q=${encodeURIComponent(val)}" class="btn btn-sm btn-outline-primary me-2">Find Doctors</a>
                        <a href="nurses.html?q=${encodeURIComponent(val)}" class="btn btn-sm btn-outline-success">Find Nurses</a>
                    </div>
                </div>
            `;
            suggestionsBox.classList.add('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove('active');
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            triggerSearchAction(searchInput.value);
        });
    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            triggerSearchAction(searchInput.value);
        }
    });

    function triggerSearchAction(term) {
        if (!term || term.trim() === '') {
            showToast('Search Query', 'Please enter symptoms, doctor specialty, or nursing service.', 'warning');
            return;
        }
        const lower = term.toLowerCase();
        if (lower.includes('nurse') || lower.includes('home care') || lower.includes('elderly') || lower.includes('injection') || lower.includes('wound')) {
            window.location.href = `nurses.html?query=${encodeURIComponent(term)}`;
        } else if (lower.includes('hospital') || lower.includes('emergency') || lower.includes('icu') || lower.includes('clinic')) {
            window.location.href = `hospitals.html?query=${encodeURIComponent(term)}`;
        } else {
            window.location.href = `doctors.html?query=${encodeURIComponent(term)}`;
        }
    }
}

// Emergency Quick Hotline Simulation
function initEmergencyHotline() {
    const callButtons = document.querySelectorAll('.btn-emergency-call');
    callButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const num = btn.getAttribute('data-phone') || '1122';
            const facility = btn.getAttribute('data-facility') || 'Emergency Response';

            const proceed = confirm(`🚨 EMERGENCY DISPATCH: Would you like to initiate a priority call to ${facility} (${num})?`);
            if (proceed) {
                showToast('Emergency Alert Dispatched', `Connecting to ${facility} hotline: ${num}... An ambulance team will receive your GPS coordinates.`, 'danger');
            }
        });
    });
}

// Global Reusable Toast Notification System
function showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-notification-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';

    let iconClass = 'fa-circle-info text-primary';
    let borderLeft = '#0284c7';
    if (type === 'success') {
        iconClass = 'fa-circle-check text-success';
        borderLeft = '#10b981';
    } else if (type === 'danger') {
        iconClass = 'fa-triangle-exclamation text-danger';
        borderLeft = '#ef4444';
    } else if (type === 'warning') {
        iconClass = 'fa-circle-exclamation text-warning';
        borderLeft = '#f59e0b';
    }

    toast.style.borderLeftColor = borderLeft;
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} fa-lg mt-1"></i>
        <div class="flex-grow-1">
            <div class="fw-bold text-dark text-sm">${title}</div>
            <div class="text-xs text-muted mt-1">${message}</div>
        </div>
        <button type="button" class="btn-close btn-close-sm" style="font-size: 0.7rem;" onclick="this.parentElement.remove()"></button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4500);
}

// FAQ Search & Category Filter Module
function initFaqModule() {
    const faqSearchInput = document.getElementById('faq-search-input');
    const faqFilterPills = document.querySelectorAll('.faq-filter-pill');
    const faqAccordionItems = document.querySelectorAll('.faq-accordion-item');
    const noFaqResults = document.getElementById('no-faq-results');

    if (!faqAccordionItems.length) return;

    let activeCategory = 'all';

    function filterFaqs() {
        const query = faqSearchInput ? faqSearchInput.value.trim().toLowerCase() : '';
        let visibleCount = 0;

        faqAccordionItems.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            const questionText = (item.querySelector('.accordion-button')?.textContent || '').toLowerCase();
            const answerText = (item.querySelector('.faq-accordion-body')?.textContent || '').toLowerCase();

            const matchesCategory = (activeCategory === 'all' || category === activeCategory);
            const matchesQuery = query === '' || questionText.includes(query) || answerText.includes(query);

            if (matchesCategory && matchesQuery) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (noFaqResults) {
            noFaqResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    faqFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            faqFilterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.getAttribute('data-category') || 'all';
            filterFaqs();
        });
    });

    if (faqSearchInput) {
        faqSearchInput.addEventListener('input', () => {
            filterFaqs();
        });
    }
}

// Global modal helpers
function initGlobalModals() {
    // Ensure backdrop clicks handle cleanly
}

// Unified Tailwind Navbar & Dropdown Interactions
function initNavbarInteractions() {
    const cityDropdownBtn = document.getElementById('cityDropdownBtn');
    const cityDropdownMenu = document.getElementById('cityDropdownMenu');

    if (cityDropdownBtn && cityDropdownMenu) {
        cityDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cityDropdownMenu.classList.toggle('hidden');
        });
    }

    const mobileToggleBtn = document.getElementById('manualMenuBtn');
    const navContent = document.getElementById('manualNavContent');
    const menuIcon = document.getElementById('menuIcon');

    if (mobileToggleBtn && navContent) {
        mobileToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navContent.classList.toggle('show-menu');

            if (menuIcon) {
                if (navContent.classList.contains('show-menu')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }

    window.addEventListener('click', () => {
        if (cityDropdownMenu && !cityDropdownMenu.classList.contains('hidden')) {
            cityDropdownMenu.classList.add('hidden');
        }
    });
}

// FAQ Accordions & Live Filtering
document.addEventListener("DOMContentLoaded", function () {
    const accordionBtns = document.querySelectorAll(".faq-accordion-btn");

    accordionBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector(".fa-chevron-down");
            const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

            document.querySelectorAll(".faq-accordion-content").forEach(item => {
                item.style.maxHeight = "0px";
            });
            document.querySelectorAll(".faq-accordion-btn .fa-chevron-down").forEach(ic => {
                ic.style.transform = "rotate(0deg)";
            });

            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = "rotate(180deg)";
            }
        });
    });

    const searchInput = document.getElementById("faq-search-input");
    const filterButtons = document.querySelectorAll(".faq-filter-pill");
    const faqItems = document.querySelectorAll(".faq-accordion-item");
    const noResultsMsg = document.getElementById("no-faq-results");

    let currentCategory = "all";

    function filterFAQs() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach(item => {
            const category = item.getAttribute("data-category");
            const text = item.textContent.toLowerCase();

            const matchesCategory = (currentCategory === "all" || category === currentCategory);
            const matchesSearch = text.includes(query);

            if (matchesCategory && matchesSearch) {
                item.style.display = "block";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });

        if (noResultsMsg) {
            if (visibleCount === 0) {
                noResultsMsg.classList.remove("hidden");
            } else {
                noResultsMsg.classList.add("hidden");
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterFAQs);
    }

    const defaultClasses = ["bg-white", "text-slate-600", "border", "border-slate-200", "hover:bg-slate-100", "hover:text-slate-900"];
    const activeClasses = ["bg-teal-600", "text-white", "shadow-sm", "hover:bg-teal-700", "hover:text-white"];

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => {
                btn.classList.remove(...activeClasses);
                btn.classList.add(...defaultClasses);
            });
            this.classList.remove(...defaultClasses);
            this.classList.add(...activeClasses);

            currentCategory = this.getAttribute("data-category");
            filterFAQs();
        });
    });
});

// Trust Metrics Animation Counter
document.addEventListener("DOMContentLoaded", () => {
    const statsSection = document.getElementById("trust-metrics-section");
    const statNums = document.querySelectorAll(".stat-num");
    let animated = false;

    const animateStats = () => {
        statNums.forEach((numElement) => {
            const rawText = numElement.getAttribute("data-target") || numElement.innerText;
            const target = parseInt(rawText.replace(/[^0-9]/g, ""), 10);
            const hasPlus = rawText.includes("+");
            const isEmergency = rawText.includes("24/7");

            if (isEmergency) return;

            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    numElement.innerText = Math.floor(current).toLocaleString() + (hasPlus ? "+" : "");
                    requestAnimationFrame(updateCount);
                } else {
                    numElement.innerText = target.toLocaleString() + (hasPlus ? "+" : "");
                }
            };

            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        observer.observe(statsSection);
    }
});

// ==========================================
// GLOBAL NURSE BOOKING MODAL CONTROLS
// ==========================================
function openNurseBookingModal(nurseName, pncReg, dailyRate, specialty) {
    const nameEl = document.getElementById('modal-nurse-name');
    const pncEl = document.getElementById('modal-nurse-pnc');
    const specialtyEl = document.getElementById('modal-nurse-specialty');
    const rateEl = document.getElementById('nurse-modal-daily-rate');

    if (nameEl) nameEl.innerText = nurseName;
    if (pncEl) pncEl.innerText = "PNC Reg #" + pncReg;
    if (specialtyEl) specialtyEl.innerText = specialty;
    if (rateEl) rateEl.innerText = "Rs. " + Number(dailyRate).toLocaleString() + " / shift";

    const modal = document.getElementById('nurseBookingModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeNurseBookingModal() {
    const modal = document.getElementById('nurseBookingModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Map globally to window to avoid scope issues
window.openNurseBookingModal = openNurseBookingModal;
window.closeNurseBookingModal = closeNurseBookingModal;

// Close modal when clicking outside (backdrop)
window.addEventListener('click', function (event) {
    const modal = document.getElementById('nurseBookingModal');
    if (event.target === modal) {
        closeNurseBookingModal();
    }
});

// Model for Hospital Details
// Open and populate Modal data with smooth transition fix
function viewHospitalDetails(name, address, beds, phone, depts) {
    document.getElementById('modalHospitalName').innerText = name;
    document.getElementById('modalHospitalAddress').innerText = address;
    document.getElementById('modalHospitalBeds').innerText = beds;
    document.getElementById('modalHospitalPhone').innerText = phone;
    document.getElementById('modalHospitalDepts').innerText = depts;

    const modal = document.getElementById('hospitalModal');
    const modalBox = modal.querySelector('div > div'); // inner card

    // Pehle hidden hataein aur opacity 0 rakhein
    modal.classList.remove('hidden');
    modal.classList.add('opacity-0');
    modalBox.classList.add('scale-95');

    // Thoda sa delay de kar transition trigger karein
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }, 10);
}

// Close Modal function with smooth fade-out
function closeHospitalModal() {
    const modal = document.getElementById('hospitalModal');
    const modalBox = modal.querySelector('div > div');

    // Pehle fade out classes add karein
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');

    // Transition mukammal hone ke baad (300ms) 'hidden' wapis laga dein
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Optional: Agar user modal ke bahar black area par click kare toh bhi modal band ho jaye
window.onclick = function (event) {
    const modal = document.getElementById('hospitalModal');
    if (event.target == modal) {
        closeHospitalModal();
    }
}
// Export toast globally
window.showToast = showToast;