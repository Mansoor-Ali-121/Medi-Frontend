/**
 * Islamabad & Rawalpindi Healthcare Portal - booking.js
 * Multi-step Doctor Appointment & Home Nursing Booking Workflow Logic
 */

// Simulated Twin Cities Doctor Database for dynamic multi-step wizard
const DOCTORS_DATA = [
    {
        id: "doc-1",
        name: "Prof. Dr. Tariq Mahmood",
        specialty: "Cardiologist",
        qualifications: "MBBS, FCPS (Cardiology), FACC (USA)",
        experience: "22 Years Exp",
        rating: 4.9,
        reviews: 184,
        city: "Islamabad",
        hospitals: ["Shifa International Hospital H-8", "Kulsum International Hospital Blue Area"],
        fee: 3500,
        photoIcon: "fa-user-doctor",
        availableSlots: ["10:30 AM", "11:15 AM", "04:30 PM", "05:15 PM"],
        gender: "Male"
    },
    {
        id: "doc-2",
        name: "Dr. Ayesha Siddiqa",
        specialty: "Gynecologist & Obstetrician",
        qualifications: "MBBS, MRCOG (UK), FCPS",
        experience: "16 Years Exp",
        rating: 4.9,
        reviews: 215,
        city: "Islamabad",
        hospitals: ["Maroof International Hospital F-10", "Ali Medical Centre F-8"],
        fee: 3000,
        photoIcon: "fa-user-doctor",
        availableSlots: ["09:00 AM", "11:00 AM", "02:30 PM", "06:00 PM"],
        gender: "Female"
    },
    {
        id: "doc-3",
        name: "Dr. Bilal Farooq",
        specialty: "Neurologist & Stroke Specialist",
        qualifications: "MBBS, MD (Neurology), Fellowship Interventional Neuro",
        experience: "14 Years Exp",
        rating: 4.8,
        reviews: 142,
        city: "Islamabad",
        hospitals: ["Quaid-e-Azam International Hospital", "PIMS Hospital G-8"],
        fee: 2800,
        photoIcon: "fa-user-doctor",
        availableSlots: ["01:00 PM", "02:00 PM", "05:00 PM"],
        gender: "Male"
    },
    {
        id: "doc-4",
        name: "Dr. Salman Qureshi",
        specialty: "Orthopedic & Spine Surgeon",
        qualifications: "MBBS, FRCS (Orthopedics UK), AO Spine Fellow",
        experience: "19 Years Exp",
        rating: 4.9,
        reviews: 198,
        city: "Rawalpindi",
        hospitals: ["Holy Family Hospital Satellite Town", "CMH Rawalpindi Saddar"],
        fee: 2500,
        photoIcon: "fa-user-doctor",
        availableSlots: ["10:00 AM", "12:30 PM", "04:00 PM", "06:30 PM"],
        gender: "Male"
    },
    {
        id: "doc-5",
        name: "Dr. Fatima Noor",
        specialty: "Pediatrician & Child Specialist",
        qualifications: "MBBS, FCPS (Pediatrics), DCH",
        experience: "11 Years Exp",
        rating: 4.8,
        reviews: 167,
        city: "Rawalpindi",
        hospitals: ["Benazir Bhutto Hospital Murree Road", "Bilal Hospital Satellite Town"],
        fee: 2000,
        photoIcon: "fa-user-doctor",
        availableSlots: ["11:30 AM", "03:00 PM", "05:30 PM"],
        gender: "Female"
    },
    {
        id: "doc-6",
        name: "Dr. Kamran Akram",
        specialty: "General Physician & Diabetologist",
        qualifications: "MBBS, MCPS (Medicine), Post-Grad Diab (UK)",
        experience: "15 Years Exp",
        rating: 4.7,
        reviews: 96,
        city: "Islamabad",
        hospitals: ["Medics Hospital G-11", "KRL Hospital G-9"],
        fee: 1800,
        photoIcon: "fa-user-doctor",
        availableSlots: ["09:30 AM", "12:00 PM", "06:00 PM", "07:30 PM"],
        gender: "Male"
    },
    {
        id: "doc-7",
        name: "Dr. Hina Rizvi",
        specialty: "Dermatologist & Cosmetologist",
        qualifications: "MBBS, FCPS (Dermatology), Board Certified (USA)",
        experience: "10 Years Exp",
        rating: 4.9,
        reviews: 134,
        city: "Islamabad",
        hospitals: ["PAF Hospital E-9", "Esthetic Clinic F-7"],
        fee: 2500,
        photoIcon: "fa-user-doctor",
        availableSlots: ["02:00 PM", "03:30 PM", "05:00 PM"],
        gender: "Female"
    },
    {
        id: "doc-8",
        name: "Dr. Usman Tahir",
        specialty: "Pulmonologist & Critical Care",
        qualifications: "MBBS, FCPS (Pulmonology), FCCP",
        experience: "13 Years Exp",
        rating: 4.8,
        reviews: 88,
        city: "Rawalpindi",
        hospitals: ["Rawalpindi Institute of Cardiology (RIC)", "Al-Suffah Hospital Saddar"],
        fee: 2200,
        photoIcon: "fa-user-doctor",
        availableSlots: ["10:00 AM", "01:30 PM", "04:30 PM"],
        gender: "Male"
    }
];

// Booking Wizard Active State
const wizardState = {
    currentStep: 1,
    city: "Islamabad",
    specialty: "",
    doctor: null,
    hospital: "",
    date: new Date().toISOString().split('T')[0],
    timeSlot: "",
    patientName: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "Male",
    patientNotes: ""
};

document.addEventListener('DOMContentLoaded', () => {
    initDoctorWizard();
    initNurseBookingModal();
    initURLParamsPreload();
});

// Initialize multi-step doctor wizard
function initDoctorWizard() {
    const wizardContainer = document.getElementById('doctor-booking-wizard-container');
    if (!wizardContainer) return;

    renderWizardStep(1);

    // Bind city radio buttons
    document.querySelectorAll('.wizard-city-radio').forEach(radio => {
        radio.addEventListener('change', (e) => {
            wizardState.city = e.target.value;
        });
    });
}

function goToWizardStep(step) {
    if (step < 1 || step > 6) return;

    // Validation rules before progressing
    if (step > 1 && !wizardState.city) {
        window.showToast?.('Selection Required', 'Please choose your preferred city first.', 'warning');
        return;
    }
    if (step > 2 && !wizardState.specialty) {
        window.showToast?.('Selection Required', 'Please select a medical specialty.', 'warning');
        return;
    }
    if (step > 3 && !wizardState.doctor) {
        window.showToast?.('Selection Required', 'Please select a doctor to proceed.', 'warning');
        return;
    }
    if (step > 4 && !wizardState.hospital) {
        window.showToast?.('Selection Required', 'Please pick a consultation hospital / clinic.', 'warning');
        return;
    }
    if (step > 5 && !wizardState.timeSlot) {
        window.showToast?.('Selection Required', 'Please pick an appointment time slot.', 'warning');
        return;
    }

    wizardState.currentStep = step;
    renderWizardStep(step);
}

function renderWizardStep(step) {
    // Update step indicators
    for (let i = 1; i <= 6; i++) {
        const indicator = document.getElementById(`step-indicator-${i}`);
        const stepContent = document.getElementById(`wizard-step-pane-${i}`);
        if (indicator) {
            indicator.classList.remove('active', 'completed');
            if (i < step) indicator.classList.add('completed');
            if (i === step) indicator.classList.add('active');
        }
        if (stepContent) {
            stepContent.style.display = (i === step) ? 'block' : 'none';
        }
    }

    // Populate dynamic step contents
    if (step === 3) {
        renderDoctorOptionsForWizard();
    } else if (step === 4) {
        renderHospitalOptionsForWizard();
    } else if (step === 5) {
        renderSlotOptionsForWizard();
    } else if (step === 6) {
        renderSummaryForWizard();
    }
}

function selectWizardSpecialty(specialtyName) {
    wizardState.specialty = specialtyName;
    document.querySelectorAll('.specialty-wizard-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-specialty') === specialtyName);
    });
    goToWizardStep(3);
}

function renderDoctorOptionsForWizard() {
    // Humne design ab HTML mein static kar diya hai, 
    // isliye JS is container ko overwrite nahi karegi.
    return;
}

// when click to next btn it jumps next page in Doctor page  
function selectStaticDoctor(name, specialty, fee, inputId, cardElement) {
    // Radio button ko check karein
    const radioBtn = document.getElementById(inputId);
    if (radioBtn) radioBtn.checked = true;

    // Sabhi cards ke borders reset kar ke selected wale par highlight lagayein
    const allCards = document.querySelectorAll('#wizard-doctors-list > div');
    allCards.forEach(card => {
        card.classList.remove('border-sky-500', 'shadow-md');
        card.classList.add('border-slate-200/80');
    });
    if (cardElement) {
        cardElement.classList.remove('border-slate-200/80');
        cardElement.classList.add('border-sky-500', 'shadow-md');
    }

    // Wizard state update karein taake validation pass ho jaye
    if (typeof wizardState !== 'undefined') {
        wizardState.doctor = {
            id: inputId,
            name: name,
            specialty: specialty,
            fee: parseInt(fee)
        };
    }
}

// when click to next btn it jumps next page in Doctor page  
function selectStaticHospital(name, location, inputId, cardElement) {
    // Radio button ko check karein
    const radioBtn = document.getElementById(inputId);
    if (radioBtn) radioBtn.checked = true;

    // Sabhi cards ke borders reset karein
    const allCards = document.querySelectorAll('#wizard-hospitals-list > div');
    allCards.forEach(card => {
        card.classList.remove('border-sky-500', 'shadow-md');
        card.classList.add('border-slate-200/80');
    });

    // Selected card ko highlight karein
    if (cardElement) {
        cardElement.classList.remove('border-slate-200/80');
        cardElement.classList.add('border-sky-500', 'shadow-md');
    }

    // Wizard state update karein
    if (typeof wizardState !== 'undefined') {
        wizardState.hospital = {
            id: inputId,
            name: name,
            location: location
        };
    }
}

function selectStaticTimeZone(timeStr, inputId, cardEl) {
    const radio = document.getElementById(inputId);
    if (radio) radio.checked = true;

    document.querySelectorAll('#wizard-time-slots-container > div').forEach(d => {
        d.classList.remove('border-sky-500', 'bg-sky-50/50', 'text-sky-700', 'shadow-xs');
        d.classList.add('border-slate-200/80', 'text-slate-700');
    });
    cardEl.classList.remove('border-slate-200/80', 'text-slate-700');
    cardEl.classList.add('border-sky-500', 'bg-sky-50/50', 'text-sky-700', 'shadow-xs');

    if (typeof wizardState !== 'undefined') {
        wizardState.timeSlot = timeStr;
    }
}

// Modal ko show karne ke liye (Jab appointment confirm ho)
function openSuccessModal() {
    const modal = document.getElementById('doctorBookingSuccessModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Modal ko close karne ke liye
function closeSuccessModal() {
    const modal = document.getElementById('doctorBookingSuccessModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function selectWizardDoctor(docId) {
    const doc = DOCTORS_DATA.find(d => d.id === docId);
    if (!doc) return;
    wizardState.doctor = doc;
    wizardState.hospital = doc.hospitals[0] || "Main Outpatient Clinic";
    goToWizardStep(4);
}

function renderHospitalOptionsForWizard() {
    const container = document.getElementById('wizard-hospitals-list');
    if (!container || !wizardState.doctor) return;

    container.innerHTML = wizardState.doctor.hospitals.map((hosp, idx) => `
    <div class="col-md-6 mb-3">
      <div class="shift-select-card ${wizardState.hospital === hosp ? 'selected' : ''}" onclick="selectWizardHospital('${hosp}')">
        <div class="d-flex align-items-center gap-3">
          <div class="stat-icon-wrapper stat-icon-blue">
            <i class="fa-solid fa-hospital"></i>
          </div>
          <div>
            <h6 class="fw-bold text-dark mb-1">${hosp}</h6>
            <div class="text-xs text-success fw-semibold"><i class="fa-solid fa-location-dot"></i> Affiliated Consultant Clinic</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function selectWizardHospital(hospName) {
    wizardState.hospital = hospName;
    goToWizardStep(5);
}

function renderSlotOptionsForWizard() {
    const slotsContainer = document.getElementById('wizard-time-slots-container');
    const dateInput = document.getElementById('wizard-date-input');

    if (dateInput) {
        dateInput.value = wizardState.date;
        dateInput.min = new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', (e) => {
            wizardState.date = e.target.value;
        });
    }

    if (!slotsContainer || !wizardState.doctor) return;

    slotsContainer.innerHTML = wizardState.doctor.availableSlots.map(slot => `
    <div class="col-6 col-md-3 mb-2">
      <button type="button" class="time-slot-btn ${wizardState.timeSlot === slot ? 'selected' : ''}" onclick="selectWizardSlot('${slot}')">
        <i class="fa-regular fa-clock me-1"></i> ${slot}
      </button>
    </div>
  `).join('');
}

function selectWizardSlot(slotText) {
    wizardState.timeSlot = slotText;
    renderSlotOptionsForWizard();
}

function renderSummaryForWizard() {
    const summaryBox = document.getElementById('wizard-confirmation-summary');
    if (!summaryBox || !wizardState.doctor) return;

    summaryBox.innerHTML = `
    <div class="p-3 bg-white rounded-3 border mb-3">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="text-xs text-muted text-uppercase fw-bold">Doctor</div>
          <div class="fw-bold text-dark">${wizardState.doctor.name}</div>
          <div class="text-xs text-primary">${wizardState.doctor.specialty} (${wizardState.doctor.qualifications})</div>
        </div>
        <div class="col-md-6">
          <div class="text-xs text-muted text-uppercase fw-bold">Hospital / Clinic</div>
          <div class="fw-bold text-dark">${wizardState.hospital}</div>
          <div class="text-xs text-muted">${wizardState.city}</div>
        </div>
        <div class="col-md-6">
          <div class="text-xs text-muted text-uppercase fw-bold">Date & Time Slot</div>
          <div class="fw-bold text-success"><i class="fa-regular fa-calendar-check me-1"></i> ${wizardState.date} at ${wizardState.timeSlot}</div>
        </div>
        <div class="col-md-6">
          <div class="text-xs text-muted text-uppercase fw-bold">Consultation Fee</div>
          <div class="fw-bold text-dark fs-5">Rs. ${wizardState.doctor.fee.toLocaleString()}</div>
          <div class="text-xs text-success"><i class="fa-solid fa-shield-halved"></i> Pay at Hospital Counter (No pre-charge)</div>
        </div>
      </div>
    </div>
  `;
}

function confirmWizardDoctorBooking(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('patient-name-input');
    const phoneInput = document.getElementById('patient-phone-input');
    const ageInput = document.getElementById('patient-age-input');

    if (!nameInput?.value || !phoneInput?.value) {
        window.showToast?.('Incomplete Details', 'Please enter the patient full name and contact number.', 'warning');
        return;
    }

    wizardState.patientName = nameInput.value;
    wizardState.patientPhone = phoneInput.value;
    wizardState.patientAge = ageInput ? ageInput.value : "35";

    const bookingRef = `ISB-DOC-${Math.floor(10000 + Math.random() * 90000)}`;

    // Safe extraction of hospital name (handling object or string cases)
    let hospitalName = 'Shifa International';
    if (typeof wizardState.hospital === 'string') {
        hospitalName = wizardState.hospital;
    } else if (wizardState.hospital && typeof wizardState.hospital === 'object') {
        hospitalName = wizardState.hospital.name || 'Shifa International';
    }

    // Save to localStorage simulation
    const existing = JSON.parse(localStorage.getItem('patient_appointments') || '[]');
    const newAppointment = {
        id: bookingRef,
        doctorName: wizardState.doctor ? wizardState.doctor.name : 'Prof. Dr. Tariq Mahmood',
        specialty: wizardState.doctor ? wizardState.doctor.specialty : 'Cardiologist',
        hospital: hospitalName,
        date: wizardState.date || 'Tomorrow',
        time: wizardState.timeSlot || '10:30 AM',
        patientName: wizardState.patientName,
        fee: wizardState.doctor && wizardState.doctor.fee ? `Rs. ${wizardState.doctor.fee.toLocaleString()}` : 'Rs. 2,500',
        status: "Confirmed",
        timestamp: new Date().toISOString()
    };
    existing.unshift(newAppointment);
    localStorage.setItem('patient_appointments', JSON.stringify(existing));

    // Update modal details content
    const refElem = document.getElementById('success-booking-ref');
    const docElem = document.getElementById('success-doctor-name');
    const timeElem = document.getElementById('success-hosp-time');

    if (refElem) refElem.textContent = bookingRef;
    if (docElem) docElem.textContent = newAppointment.doctorName;
    if (timeElem) timeElem.textContent = `${newAppointment.hospital} | ${newAppointment.date} @ ${newAppointment.time}`;

    // Show Tailwind Success Modal properly
    const modalElem = document.getElementById('doctorBookingSuccessModal');
    if (modalElem) {
        modalElem.classList.remove('hidden');
        modalElem.style.display = 'flex';
    }
}

// Modal Close Function
function closeSuccessModal() {
    const modalElem = document.getElementById('doctorBookingSuccessModal');
    if (modalElem) {
        modalElem.classList.add('hidden');
        modalElem.style.display = 'none';
    }
}

// Home Nursing Booking Modal Simulation
function initNurseBookingModal() {
    const shiftRadios = document.querySelectorAll('.nurse-shift-option');
    const durationInput = document.getElementById('nurse-duration-days');
    const ratePerDayDisplay = document.getElementById('nurse-modal-daily-rate');
    const totalAmountDisplay = document.getElementById('nurse-modal-total-calc');

    let currentDailyRate = 3800;

    function calculateNurseCost() {
        if (!totalAmountDisplay) return;
        const days = parseInt(durationInput?.value || '1', 10);
        const total = currentDailyRate * days;
        totalAmountDisplay.textContent = `Rs. ${total.toLocaleString()}`;
    }

    if (durationInput) {
        durationInput.addEventListener('input', calculateNurseCost);
    }

    // Pre-fill nurse details when opening modal
    window.openNurseBookingModal = function (nurseName, pncNumber, ratePerDay, specialty) {
        currentDailyRate = parseInt(ratePerDay, 10) || 3800;
        const titleEl = document.getElementById('modal-nurse-name');
        const badgeEl = document.getElementById('modal-nurse-pnc');
        const specEl = document.getElementById('modal-nurse-specialty');

        if (titleEl) titleEl.textContent = nurseName;
        if (badgeEl) badgeEl.textContent = `PNC Reg #${pncNumber}`;
        if (specEl) specEl.textContent = specialty;
        if (ratePerDayDisplay) ratePerDayDisplay.textContent = `Rs. ${currentDailyRate.toLocaleString()} / shift`;

        calculateNurseCost();

        const modalElem = document.getElementById('nurseBookingModal');
        if (modalElem && window.bootstrap) {
            const modal = new bootstrap.Modal(modalElem);
            modal.show();
        }
    };

    const form = document.getElementById('nurse-booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nurseName = document.getElementById('modal-nurse-name')?.textContent || "Sister Rabia Bibi";
            const nurseSpec = document.getElementById('modal-nurse-specialty')?.textContent || "Post-Operative Care";
            const address = document.getElementById('nurse-patient-address')?.value || "Sector F-8/3, Islamabad";
            const shift = document.querySelector('input[name="nurseShift"]:checked')?.value || "12-Hour Day Shift";
            const days = document.getElementById('nurse-duration-days')?.value || "7";
            const bookingRef = `ISB-NUR-${Math.floor(10000 + Math.random() * 90000)}`;

            const activeNurses = JSON.parse(localStorage.getItem('patient_nurse_bookings') || '[]');
            activeNurses.unshift({
                id: bookingRef,
                nurseName: nurseName,
                specialization: nurseSpec,
                shift: shift,
                duration: `${days} Days`,
                location: address,
                status: "Active / Assigned",
                startDate: new Date().toLocaleDateString(),
                totalFee: totalAmountDisplay?.textContent || "Rs. 26,600"
            });
            localStorage.setItem('patient_nurse_bookings', JSON.stringify(activeNurses));

            // Close modal
            const modalElem = document.getElementById('nurseBookingModal');
            if (modalElem && window.bootstrap) {
                bootstrap.Modal.getInstance(modalElem)?.hide();
            }

            window.showToast?.('Nurse Booked Successfully!', `Assigned ${nurseName} for ${shift}. Care starts on your selected date. Ref: #${bookingRef}`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard-patient.html?tab=nurses';
            }, 1500);
        });
    }
}

// Pre-load parameters from URL query string (e.g. from Landing page search)
function initURLParamsPreload() {
    const urlParams = new URLSearchParams(window.location.search);
    const specialtyParam = urlParams.get('specialty');
    const cityParam = urlParams.get('city');

    if (cityParam) {
        wizardState.city = cityParam;
        const cityRadio = document.querySelector(`input[name="wizardCity"][value="${cityParam}"]`);
        if (cityRadio) cityRadio.checked = true;
    }

    if (specialtyParam) {
        wizardState.specialty = specialtyParam;
    }
}

// Expose functions to window
window.goToWizardStep = goToWizardStep;
window.selectWizardSpecialty = selectWizardSpecialty;
window.selectWizardDoctor = selectWizardDoctor;
window.selectWizardHospital = selectWizardHospital;
window.selectWizardSlot = selectWizardSlot;
window.confirmWizardDoctorBooking = confirmWizardDoctorBooking;
