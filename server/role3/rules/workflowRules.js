const workflowRules = {
  appointmentReminder: {
    trigger: "APPOINTMENT_UPCOMING",
    conditions: {
      hoursBeforeAppointment: 24
    },
    action: "SEND_APPOINTMENT_REMINDER"
  },

  missedAppointment: {
    trigger: "APPOINTMENT_MISSED",
    action: "SEND_MISSED_APPOINTMENT_FOLLOWUP"
  },

  reportUploaded: {
    trigger: "REPORT_UPLOADED",
    action: "NOTIFY_REPORT_AVAILABLE"
  },

  paymentPending: {
    trigger: "PAYMENT_PENDING",
    action: "SEND_PAYMENT_REMINDER"
  },

  treatmentFollowup: {
    trigger: "TREATMENT_FOLLOWUP_DUE",
    action: "CREATE_FOLLOWUP_TASK"
  },

  emergency: {
    trigger: "EMERGENCY_DETECTED",
    action: "ESCALATE_TO_STAFF"
  }
};

module.exports = workflowRules;