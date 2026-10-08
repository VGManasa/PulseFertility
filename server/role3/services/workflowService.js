const workflowRules = require("../rules/workflowRules");

let db = null;


// ===============================
// CONNECT MONGODB TO WORKFLOW
// ===============================

function setDatabase(database) {
  db = database;
}


// ===============================
// PROCESS WORKFLOW EVENT
// ===============================

async function processEvent(event) {

  const { type, patient } = event;

  let result;

  switch (type) {

    case workflowRules.appointmentReminder.trigger:

      result = {
        action: workflowRules.appointmentReminder.action,
        patientId: patient.id,
        message: `Hello ${patient.name}, this is a reminder that you have an appointment tomorrow.`,
        priority: "NORMAL"
      };

      break;


    case workflowRules.missedAppointment.trigger:

      result = {
        action: workflowRules.missedAppointment.action,
        patientId: patient.id,
        message: `We noticed that you missed your appointment. Please contact the clinic to reschedule.`,
        priority: "HIGH"
      };

      break;


    case workflowRules.reportUploaded.trigger:

      result = {
        action: workflowRules.reportUploaded.action,
        patientId: patient.id,
        message: `Your latest investigation report is now available. Please check with the clinic for the next steps.`,
        priority: "NORMAL"
      };

      break;


    case workflowRules.paymentPending.trigger:

      result = {
        action: workflowRules.paymentPending.action,
        patientId: patient.id,
        message: `This is a reminder that you have a pending payment with the clinic.`,
        priority: "NORMAL"
      };

      break;


    case workflowRules.treatmentFollowup.trigger:

      result = {
        action: workflowRules.treatmentFollowup.action,
        patientId: patient.id,
        message: `Your treatment follow-up is due. Please contact the clinic if you need assistance.`,
        priority: "HIGH"
      };

      break;


    case workflowRules.emergency.trigger:

      result = {
        action: workflowRules.emergency.action,
        patientId: patient.id,
        message: null,
        priority: "URGENT",
        escalate: true
      };

      break;


    default:

      result = {
        action: "NO_ACTION",
        patientId: patient.id,
        message: null,
        priority: "NORMAL"
      };
  }


  // ===============================
  // SAVE EVENT TO MONGODB
  // ===============================

  if (db) {

    await db.collection("workflowEvents").insertOne({

      eventType: type,

      patient: patient,

      result: result,

      createdAt: new Date()

    });

  }


  return result;
}


// ===============================
// GET PATIENT STATUS
// ===============================

async function getPatientStatus(patient) {

  const result = {

    patientId: patient.id,

    patientName: patient.name,

    treatmentStage:
      patient.treatmentStage || "REGISTERED",

    status: "ACTIVE"

  };


  // ===============================
  // SAVE PATIENT TO MONGODB
  // ===============================

  if (db) {

    await db.collection("patients").updateOne(

      {
        patientId: patient.id
      },

      {
        $set: {

          patientId: patient.id,

          patientName: patient.name,

          treatmentStage:
            patient.treatmentStage || "REGISTERED",

          status: "ACTIVE",

          updatedAt: new Date()

        }
      },

      {
        upsert: true
      }

    );

  }


  return result;
}


// ===============================
// EXPORT FUNCTIONS
// ===============================

module.exports = {

  setDatabase,

  processEvent,

  getPatientStatus

};