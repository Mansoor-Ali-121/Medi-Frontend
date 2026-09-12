/**
 * ShifaCare Plus - High-Performance Interactive Authentication Script
 * Features:
 * - Clean Smooth CSS Ambient Background Animation (Dynamic Moving & Color Shifting Orbs)
 * - Google Single Sign-On / Sign-Up
 * - OTP Code Generator & SMS Simulator
 * - Real-Time Password Strength Engine
 * - Smooth Tab Transitions & Form Validation
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. AMBIENT BACKGROUND GLOW ANIMATION (CSS Injector) - Enhanced & Dynamic
       ========================================================================== */
    function initAmbientBackground() {
        const oldCanvas = document.getElementById('auth-ambient-canvas');
        if (oldCanvas) {
            oldCanvas.remove();
        }

        let bgContainer = document.getElementById('shifa-ambient-bg');
        if (!bgContainer) {
            bgContainer = document.createElement('div');
            bgContainer.id = 'shifa-ambient-bg';
            bgContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                z-index: 0;
                pointer-events: none;
            `;

            bgContainer.innerHTML = `
                <div class="glow-orb orb-1"></div>
                <div class="glow-orb orb-2"></div>
                <div class="glow-orb orb-3"></div>
                <div class="glow-orb orb-4"></div>
            `;
            document.body.prepend(bgContainer);
        }

        if (!document.getElementById('shifa-ambient-styles')) {
            const style = document.createElement('style');
            style.id = 'shifa-ambient-styles';
            style.textContent = `
                .glow-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(90px);
                    opacity: 0.35;
                    mix-blend-mode: screen;
                }
                
                .orb-1 {
                    width: 450px;
                    height: 450px;
                    background: #06b6d4;
                    top: -10%;
                    left: -10%;
                    animation: driftOrb1 16s ease-in-out infinite alternate;
                }

                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: #10b981;
                    bottom: -15%;
                    right: -10%;
                    animation: driftOrb2 20s ease-in-out infinite alternate;
                }

                .orb-3 {
                    width: 400px;
                    height: 400px;
                    background: #3b82f6;
                    top: 30%;
                    left: 35%;
                    animation: driftOrb3 24s ease-in-out infinite alternate;
                }

                .orb-4 {
                    width: 350px;
                    height: 350px;
                    background: #6366f1;
                    bottom: 20%;
                    left: 10%;
                    animation: driftOrb4 18s ease-in-out infinite alternate;
                }

                @keyframes driftOrb1 {
                    0% { transform: translate(0px, 0px) scale(1); background: #06b6d4; }
                    50% { transform: translate(120px, 80px) scale(1.2); background: #3b82f6; }
                    100% { transform: translate(60px, 180px) scale(0.9); background: #10b981; }
                }

                @keyframes driftOrb2 {
                    0% { transform: translate(0px, 0px) scale(1); background: #10b981; }
                    50% { transform: translate(-140px, -100px) scale(1.15); background: #06b6d4; }
                    100% { transform: translate(-80px, -160px) scale(0.85); background: #8b5cf6; }
                }

                @keyframes driftOrb3 {
                    0% { transform: translate(0px, 0px) scale(0.9); background: #3b82f6; }
                    50% { transform: translate(-100px, 120px) scale(1.3); background: #ec4899; }
                    100% { transform: translate(100px, -90px) scale(1); background: #06b6d4; }
                }

                @keyframes driftOrb4 {
                    0% { transform: translate(0px, 0px) scale(1); background: #6366f1; }
                    50% { transform: translate(150px, -70px) scale(1.1); background: #10b981; }
                    100% { transform: translate(-60px, 110px) scale(0.9); background: #3b82f6; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ==========================================================================
       2. PASSWORD VISIBILITY TOGGLES
       ========================================================================== */
    function initPasswordToggles() {
        const toggleBtns = document.querySelectorAll('.password-toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (!input) return;

                if (input.type === 'password') {
                    input.type = 'text';
                    if (icon) {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    }
                } else {
                    input.type = 'password';
                    if (icon) {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            });
        });
    }

    /* ==========================================================================
       3. LOGIN METHOD TABS (EMAIL VS MOBILE PHONE)
       ========================================================================== */
    function initLoginTabs() {
        const tabs = document.querySelectorAll('.auth-nav-tab');
        const emailSection = document.getElementById('login-email-section');
        const phoneSection = document.getElementById('login-phone-section');

        if (!tabs.length || !emailSection || !phoneSection) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const method = this.getAttribute('data-login-method');
                if (method === 'phone') {
                    emailSection.classList.add('hidden');
                    phoneSection.classList.remove('hidden');
                } else {
                    phoneSection.classList.add('hidden');
                    emailSection.classList.remove('hidden');
                }
            });
        });

        // Handle OTP Button
        const sendOtpBtn = document.getElementById('btn-send-otp');
        const otpWrapper = document.getElementById('otp-code-wrapper');
        const otpCountdown = document.getElementById('otp-countdown');
        const phoneInput = document.getElementById('login-phone-number');

        if (sendOtpBtn && otpWrapper) {
            sendOtpBtn.addEventListener('click', function () {
                if (!phoneInput || phoneInput.value.trim().length < 9) {
                    showAuthToast('Please enter a valid mobile number.', 'danger');
                    phoneInput?.focus();
                    return;
                }

                otpWrapper.classList.remove('hidden');
                const otpInput = document.getElementById('login-otp-code');
                if (otpInput) {
                    otpInput.value = '4892';
                    otpInput.focus();
                }

                showAuthToast('Test OTP dispatched: 4892 (Autofilled)', 'success');
                sendOtpBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Code Sent';

                let seconds = 30;
                if (otpCountdown) {
                    otpCountdown.textContent = `Resend in ${seconds}s`;
                    const timer = setInterval(() => {
                        seconds--;
                        if (seconds <= 0) {
                            clearInterval(timer);
                            otpCountdown.textContent = '';
                            sendOtpBtn.disabled = false;
                            sendOtpBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                        } else {
                            otpCountdown.textContent = `Resend in ${seconds}s`;
                        }
                    }, 1000);
                }
            });
        }
    }

    /* ==========================================================================
       4. QUICK 1-CLICK DEMO AUTOFILL
       ========================================================================== */
    function initDemoAutofill() {
        const demoBtns = document.querySelectorAll('[data-demo-user]');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const emailInput = document.getElementById('login-email');
                const passInput = document.getElementById('login-password');

                if (emailInput && passInput) {
                    emailInput.value = 'usman.patient@shifacare.pk';
                    passInput.value = 'PatientCare2026!';
                    showAuthToast('Autofilled Demo Profile: Muhammad Usman', 'info');
                }
            });
        });
    }

    /* ==========================================================================
       5. PASSWORD STRENGTH METER
       ========================================================================== */
    function initPasswordStrength() {
        const passInput = document.getElementById('register-password');
        const fill = document.getElementById('strength-fill');
        const label = document.getElementById('strength-label');

        if (!passInput || !fill || !label) return;

        passInput.addEventListener('input', function () {
            const val = this.value;
            let score = 0;

            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            if (val.length === 0) {
                fill.style.width = '0%';
                fill.style.backgroundColor = 'transparent';
                label.textContent = 'Password strength';
                label.className = 'text-3xs text-slate-400 font-semibold';
            } else if (score <= 2) {
                fill.style.width = '28%';
                fill.style.backgroundColor = '#ef4444';
                label.textContent = 'Weak (Needs numbers/symbols)';
                label.className = 'text-3xs text-rose-400 font-bold';
            } else if (score <= 4) {
                fill.style.width = '65%';
                fill.style.backgroundColor = '#f59e0b';
                label.textContent = 'Good (Moderate security)';
                label.className = 'text-3xs text-amber-400 font-bold';
            } else {
                fill.style.width = '100%';
                fill.style.backgroundColor = '#10b981';
                label.textContent = 'Strong (Excellent cryptography)';
                label.className = 'text-3xs text-emerald-400 font-bold';
            }
        });
    }

    /* ==========================================================================
       6. FORM SUBMISSIONS: LOGIN & REGISTER (Without loading block)
       ========================================================================== */
    function initLoginForm() {
        const form = document.getElementById('auth-login-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('login-email');
            const phoneInput = document.getElementById('login-phone-number');
            const otpInput = document.getElementById('login-otp-code');
            const activeTab = document.querySelector('.auth-nav-tab.active')?.getAttribute('data-login-method') || 'email';

            let userIdentifier = '';
            if (activeTab === 'phone') {
                if (!phoneInput || !phoneInput.value.trim()) {
                    showAuthToast('Please enter your mobile phone number.', 'danger');
                    phoneInput?.focus();
                    return;
                }
                if (!otpInput || otpInput.value.trim().length < 4) {
                    showAuthToast('Please enter the 4-digit verification code.', 'danger');
                    otpInput?.focus();
                    return;
                }
                userIdentifier = `+92 ${phoneInput.value.trim()}`;
            } else {
                if (!emailInput || !emailInput.value.trim()) {
                    showAuthToast('Please enter your registered email address.', 'danger');
                    emailInput?.focus();
                    return;
                }
                userIdentifier = emailInput.value.trim();
            }

            const userName = 'Muhammad Usman';
            const currentUser = {
                name: userName,
                identifier: userIdentifier,
                role: 'patient',
                sector: 'Central Healthcare Zone',
                loggedInAt: new Date().toISOString()
            };

            localStorage.setItem('shifacare_session', JSON.stringify(currentUser));
            localStorage.setItem('user_logged_in', 'true');

            showAuthToast(`Welcome back, ${userName}! Opening your healthcare portal...`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard-patient.html';
            }, 600);
        });
    }

    function initRegisterForm() {
        const form = document.getElementById('auth-register-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullnameInput = document.getElementById('register-fullname');
            const emailInput = document.getElementById('register-email');
            const phoneInput = document.getElementById('register-phone');
            const sectorSelect = document.getElementById('register-sector');
            const passwordInput = document.getElementById('register-password');
            const confirmPassInput = document.getElementById('register-confirm-password');
            const termsCheck = document.getElementById('register-terms');
            const emergencyContactName = document.getElementById('emergency-contact-name');
            const emergencyContactPhone = document.getElementById('emergency-contact-phone');

            if (!fullnameInput || !fullnameInput.value.trim()) {
                showAuthToast('Please enter your full legal name.', 'danger');
                fullnameInput?.focus();
                return;
            }
            if (!emailInput || !emailInput.value.trim()) {
                showAuthToast('Please enter a valid email address.', 'danger');
                emailInput?.focus();
                return;
            }
            if (!phoneInput || !phoneInput.value.trim()) {
                showAuthToast('Please enter your mobile phone number.', 'danger');
                phoneInput?.focus();
                return;
            }
            if (passwordInput && confirmPassInput && passwordInput.value !== confirmPassInput.value) {
                showAuthToast('Passwords do not match! Please verify.', 'danger');
                confirmPassInput?.focus();
                return;
            }
            if (termsCheck && !termsCheck.checked) {
                showAuthToast('Please agree to the Healthcare Privacy Terms.', 'warning');
                return;
            }

            const newUser = {
                name: fullnameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: `+92 ${phoneInput.value.trim()}`,
                role: 'patient',
                sector: sectorSelect ? sectorSelect.value : 'Metropolitan Medical District',
                emergencyContact: {
                    name: emergencyContactName ? emergencyContactName.value.trim() : '',
                    phone: emergencyContactPhone ? emergencyContactPhone.value.trim() : ''
                },
                registeredAt: new Date().toISOString()
            };

            localStorage.setItem('shifacare_session', JSON.stringify(newUser));
            localStorage.setItem('user_logged_in', 'true');

            showAuthToast(`Account verified! Welcome to ShifaCare Plus, ${newUser.name}.`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard-patient.html';
            }, 600);
        });
    }

    /* ==========================================================================
       7. GOOGLE SINGLE AUTHENTICATION
       ========================================================================== */
    function initGoogleAuth() {
        const googleBtns = document.querySelectorAll('#btn-google-login, #btn-google-register');
        googleBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const googleUser = {
                    name: 'Muhammad Usman',
                    email: 'usman.patient@gmail.com',
                    authProvider: 'google',
                    role: 'patient',
                    sector: 'Central Health District',
                    verified: true,
                    loggedInAt: new Date().toISOString()
                };

                localStorage.setItem('shifacare_session', JSON.stringify(googleUser));
                localStorage.setItem('user_logged_in', 'true');

                showAuthToast('Google Workspace verified! Welcome, Muhammad Usman.', 'success');

                setTimeout(() => {
                    window.location.href = 'dashboard-patient.html';
                }, 600);
            });
        });
    }

    /* ==========================================================================
       8. FORGOT PASSWORD MODAL
       ========================================================================== */
    function initForgotPasswordModal() {
        const forgotLinks = document.querySelectorAll('[data-open-modal="forgot-password"]');
        const modal = document.getElementById('forgot-password-modal');
        const closeBtns = document.querySelectorAll('[data-close-modal="forgot-password"]');
        const forgotForm = document.getElementById('forgot-password-form');

        if (!modal) return;

        forgotLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                modal.classList.add('active');
                const input = document.getElementById('forgot-email-input');
                if (input) input.focus();
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                modal.classList.remove('active');
            });
        });

        modal.classList.remove('active');

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        if (forgotForm) {
            forgotForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const input = document.getElementById('forgot-email-input');

                modal.classList.remove('active');
                showAuthToast(`Reset security token dispatched to ${input ? input.value : 'your address'}.`, 'success');
                forgotForm.reset();
            });
        }
    }

    /* ==========================================================================
       9. FLOATING TOAST NOTIFICATION UTILITY
       ========================================================================== */
    function showAuthToast(message, type = 'info') {
        let container = document.getElementById('toast-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-notification-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'auth-toast';

        let icon = '<i class="fa-solid fa-circle-info text-sky-400 text-base"></i>';
        let borderColor = 'rgba(6, 182, 212, 0.4)';

        if (type === 'success') {
            icon = '<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>';
            borderColor = 'rgba(16, 185, 129, 0.5)';
        } else if (type === 'danger') {
            icon = '<i class="fa-solid fa-circle-exclamation text-rose-400 text-base"></i>';
            borderColor = 'rgba(244, 63, 94, 0.5)';
        } else if (type === 'warning') {
            icon = '<i class="fa-solid fa-triangle-exclamation text-amber-400 text-base"></i>';
            borderColor = 'rgba(245, 158, 11, 0.5)';
        }

        toast.style.borderColor = borderColor;
        toast.innerHTML = `
          ${icon}
          <span class="flex-1">${message}</span>
          <button type="button" class="text-slate-400 hover:text-white ms-2 text-xs" onclick="this.parentElement.remove()" aria-label="Close notification">
              <i class="fa-solid fa-xmark"></i>
          </button>
      `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 250);
        }, 4000);
    }

    // Global helper
    window.showToast = showAuthToast;

    // DOMContentLoaded Execution
    document.addEventListener('DOMContentLoaded', function () {
        initAmbientBackground();
        initPasswordToggles();
        initLoginTabs();
        initDemoAutofill();
        initPasswordStrength();
        initLoginForm();
        initRegisterForm();
        initForgotPasswordModal();
        initGoogleAuth();
    });
})();