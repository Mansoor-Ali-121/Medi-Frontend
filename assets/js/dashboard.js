/**
 * Islamabad & Rawalpindi Healthcare Portal - dashboard.js
 * Patient Dashboard dynamic tab switching, live care updates & booking management
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardData();
  initDashboardActions();
});

// Tab navigation handler
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dash-nav-link');
  const tabPanes = document.querySelectorAll('.dash-content-pane');

  // Check URL param ?tab=
  const urlParams = new URLSearchParams(window.location.search);
  const activeTabParam = urlParams.get('tab') || 'appointments';

  function switchTab(targetId) {
    tabLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-tab-target');
      link.classList.toggle('active', linkTarget === targetId);
    });

    tabPanes.forEach(pane => {
      pane.style.display = (pane.id === `dash-pane-${targetId}`) ? 'block' : 'none';
    });
  }

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-tab-target');
      if (target) {
        switchTab(target);
      }
    });
  });

  // Activate default or param tab
  switchTab(activeTabParam);
}

// Populate appointments and nursing bookings from localStorage or fallback defaults
function initDashboardData() {
  renderAppointmentsList();
  renderNurseBookingsList();
  renderFavoritesList();
}

function renderAppointmentsList() {
  const container = document.getElementById('dashboard-appointments-list');
  if (!container) return;

  const defaultAppointments = [
    {
      id: "ISB-DOC-82194",
      doctorName: "Prof. Dr. Tariq Mahmood",
      specialty: "Cardiologist",
      hospital: "Shifa International Hospital H-8, Islamabad",
      date: "Tomorrow, Sep 2",
      time: "10:30 AM",
      patientName: "Muhammad Usman",
      fee: "Rs. 3,500",
      status: "Confirmed"
    },
    {
      id: "ISB-DOC-71932",
      doctorName: "Dr. Ayesha Siddiqa",
      specialty: "Gynecologist",
      hospital: "Maroof International Hospital F-10, Islamabad",
      date: "Sep 8, 2026",
      time: "02:30 PM",
      patientName: "Zainab Usman",
      fee: "Rs. 3,000",
      status: "Confirmed"
    }
  ];

  const stored = JSON.parse(localStorage.getItem('patient_appointments') || 'null');
  const appointments = (stored && stored.length > 0) ? stored : defaultAppointments;

  // Update stat counter
  const badgeCount = document.getElementById('stat-upcoming-count');
  if (badgeCount) badgeCount.textContent = appointments.length;

  container.innerHTML = appointments.map(apt => `
    <div class="appointment-item-card" id="apt-${apt.id}">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="status-badge-pill status-${apt.status.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending'}">
            <i class="fa-solid fa-circle-check"></i> ${apt.status}
          </span>
          <span class="text-xs text-muted fw-bold">Ref: #${apt.id}</span>
        </div>
        <div class="fw-bold text-dark fs-6">${apt.fee}</div>
      </div>

      <div class="row g-3 align-items-center">
        <div class="col-md-5">
          <div class="d-flex align-items-center gap-3">
            <div class="doctor-photo-box" style="width: 54px; height: 54px; font-size: 1.4rem;">
              <i class="fa-solid fa-user-doctor"></i>
            </div>
            <div>
              <h6 class="fw-bold text-dark mb-0">${apt.doctorName}</h6>
              <div class="text-xs text-primary fw-semibold">${apt.specialty}</div>
              <div class="text-xs text-muted"><i class="fa-solid fa-hospital me-1"></i> ${apt.hospital}</div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="text-xs text-muted text-uppercase fw-semibold">Date & Consultation Time</div>
          <div class="fw-bold text-dark text-sm"><i class="fa-regular fa-calendar me-1 text-primary"></i> ${apt.date} at ${apt.time}</div>
          <div class="text-xs text-muted mt-1"><i class="fa-regular fa-user me-1"></i> Patient: ${apt.patientName || 'Muhammad Usman'}</div>
        </div>

        <div class="col-md-3 text-md-end">
          <div class="d-flex gap-2 justify-content-md-end">
            <button class="btn btn-sm btn-outline-danger" onclick="cancelAppointment('${apt.id}')" title="Cancel Appointment">
              <i class="fa-solid fa-xmark me-1"></i> Cancel
            </button>
            <button class="btn btn-sm btn-outline-primary" onclick="rescheduleAppointment('${apt.id}')" title="Reschedule">
              <i class="fa-regular fa-clock me-1"></i> Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderNurseBookingsList() {
  const container = document.getElementById('dashboard-nurses-list');
  if (!container) return;

  const defaultNurses = [
    {
      id: "ISB-NUR-94821",
      nurseName: "Sister Rabia Bibi (BScN, PNC Certified)",
      specialization: "Post-Operative & Wound Care",
      shift: "12-Hour Day Shift (08:00 AM - 08:00 PM)",
      duration: "14 Days Package",
      location: "House 24, Street 19, Sector F-8/2, Islamabad",
      status: "Active / On Duty",
      startDate: "Aug 28, 2026",
      totalFee: "Rs. 53,200",
      vitalsLogged: { bp: "120/80 mmHg", pulse: "74 bpm", spo2: "98%", sugar: "110 mg/dL" }
    }
  ];

  const stored = JSON.parse(localStorage.getItem('patient_nurse_bookings') || 'null');
  const nurseBookings = (stored && stored.length > 0) ? stored : defaultNurses;

  container.innerHTML = nurseBookings.map(care => `
    <div class="active-care-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="active-pulse-dot"></span>
          <span class="status-badge-pill status-active"><i class="fa-solid fa-shield-heart"></i> ${care.status}</span>
          <span class="text-xs text-muted fw-bold">Care Order: #${care.id}</span>
        </div>
        <div class="fw-bold text-success fs-6">${care.totalFee}</div>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="nurse-avatar-box" style="width: 64px; height: 64px; font-size: 1.6rem;">
              <i class="fa-solid fa-user-nurse"></i>
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-1">${care.nurseName}</h5>
              <div class="text-xs text-secondary fw-bold mb-1">${care.specialization}</div>
              <div class="text-xs text-muted"><i class="fa-regular fa-clock me-1"></i> ${care.shift}</div>
            </div>
          </div>

          <div class="p-3 bg-white rounded-3 border">
            <div class="row g-2 text-xs">
              <div class="col-sm-6">
                <span class="text-muted">Home Location:</span>
                <div class="fw-semibold text-dark text-truncate">${care.location}</div>
              </div>
              <div class="col-sm-6">
                <span class="text-muted">Care Duration:</span>
                <div class="fw-semibold text-dark">${care.duration} (Started: ${care.startDate})</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-xs text-uppercase fw-bold text-muted">Latest Patient Vitals</span>
                <span class="badge bg-success text-white" style="font-size: 0.65rem;">Updated 1 hr ago</span>
              </div>
              <div class="row g-2 text-center text-xs">
                <div class="col-3 p-1 bg-light rounded">
                  <div class="text-muted">BP</div>
                  <div class="fw-bold text-dark">${care.vitalsLogged?.bp || '120/80'}</div>
                </div>
                <div class="col-3 p-1 bg-light rounded">
                  <div class="text-muted">Pulse</div>
                  <div class="fw-bold text-dark">${care.vitalsLogged?.pulse || '76 bpm'}</div>
                </div>
                <div class="col-3 p-1 bg-light rounded">
                  <div class="text-muted">SpO2</div>
                  <div class="fw-bold text-primary">${care.vitalsLogged?.spo2 || '99%'}</div>
                </div>
                <div class="col-3 p-1 bg-light rounded">
                  <div class="text-muted">Sugar</div>
                  <div class="fw-bold text-dark">${care.vitalsLogged?.sugar || '105'}</div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-sm btn-outline-success flex-grow-1" onclick="contactNurseDuty('${care.nurseName}')">
                <i class="fa-solid fa-phone me-1"></i> Call Nurse
              </button>
              <button class="btn btn-sm btn-outline-primary flex-grow-1" onclick="logDailyVitals('${care.id}')">
                <i class="fa-solid fa-notes-medical me-1"></i> Add Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFavoritesList() {
  const container = document.getElementById('dashboard-favorites-list');
  if (!container) return;

  container.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6 col-lg-4">
        <div class="health-card p-3">
          <span class="badge-pmdc mb-2"><i class="fa-solid fa-certificate"></i> Doctor</span>
          <h6 class="fw-bold text-dark mb-1">Prof. Dr. Tariq Mahmood</h6>
          <div class="text-xs text-primary mb-2">Cardiologist (Shifa International)</div>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="text-xs text-muted"><i class="fa-solid fa-star text-warning me-1"></i> 4.9 (184)</span>
            <a href="doctors.html" class="btn btn-sm btn-primary-health py-1 px-3" style="font-size: 0.75rem;">Book</a>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="health-card p-3">
          <span class="badge-pnc mb-2"><i class="fa-solid fa-user-nurse"></i> Home Nurse</span>
          <h6 class="fw-bold text-dark mb-1">Sister Rabia Bibi</h6>
          <div class="text-xs text-secondary mb-2">Post-Operative & Geriatric Care</div>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="text-xs text-muted"><i class="fa-solid fa-star text-warning me-1"></i> 4.95 (48 jobs)</span>
            <a href="nurses.html" class="btn btn-sm btn-secondary-health py-1 px-3" style="font-size: 0.75rem;">Re-Hire</a>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="health-card p-3">
          <span class="badge bg-light text-dark border mb-2"><i class="fa-solid fa-hospital"></i> Hospital</span>
          <h6 class="fw-bold text-dark mb-1">Maroof International Hospital</h6>
          <div class="text-xs text-muted mb-2">F-10 Markaz, Islamabad (24/7 Emergency)</div>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="text-xs text-danger fw-semibold"><i class="fa-solid fa-truck-medical"></i> Trauma Center</span>
            <a href="hospitals.html" class="btn btn-sm btn-outline-health py-1 px-3" style="font-size: 0.75rem;">Explore</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Action handlers
function cancelAppointment(aptId) {
  if (confirm(`Are you sure you want to cancel appointment #${aptId}? Cancellation is free before 2 hours.`)) {
    const existing = JSON.parse(localStorage.getItem('patient_appointments') || '[]');
    const updated = existing.filter(a => a.id !== aptId);
    localStorage.setItem('patient_appointments', JSON.stringify(updated));
    renderAppointmentsList();
    window.showToast?.('Appointment Cancelled', `Appointment #${aptId} has been successfully cancelled.`, 'info');
  }
}

function rescheduleAppointment(aptId) {
  window.showToast?.('Reschedule Requested', `Opening availability calendar for appointment #${aptId}...`, 'info');
  setTimeout(() => {
    window.location.href = 'doctors.html';
  }, 1000);
}

function contactNurseDuty(nurseName) {
  window.showToast?.('Calling Assigned Nurse', `Connecting secured call to ${nurseName}...`, 'success');
}

function logDailyVitals(careId) {
  const bp = prompt("Enter patient Blood Pressure reading (e.g., 120/80):", "118/78");
  if (bp) {
    window.showToast?.('Vitals Updated', `Logged BP reading (${bp}) to Patient Chart for care #${careId}.`, 'success');
  }
}

function downloadInvoiceMock(invoiceId, amount) {
  window.showToast?.('Generating Receipt', `Downloading official PDF invoice #${invoiceId} for ${amount}...`, 'success');
}

function initDashboardActions() {
  window.cancelAppointment = cancelAppointment;
  window.rescheduleAppointment = rescheduleAppointment;
  window.contactNurseDuty = contactNurseDuty;
  window.logDailyVitals = logDailyVitals;
  window.downloadInvoiceMock = downloadInvoiceMock;
}
