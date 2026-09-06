/**
 * Islamabad & Rawalpindi Healthcare Portal - dashboard.js
 * Patient Dashboard dynamic tab switching & action handlers (Cleaned Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardActions();
});

// Tab navigation handler
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dash-nav-link');
  const tabPanes = document.querySelectorAll('.dash-content-pane');

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

  switchTab(activeTabParam);
}

// Action handlers for buttons and modals
function cancelAppointment(aptId) {
  if (confirm(`Are you sure you want to cancel appointment #${aptId}? Cancellation is free before 2 hours.`)) {
    // Add your backend AJAX / Route call here to delete/cancel in database
    const element = document.getElementById(`apt-${aptId}`);
    if (element) element.remove();
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