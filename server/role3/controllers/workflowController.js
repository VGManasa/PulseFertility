const {
  processEvent,
  getPatientStatus
} = require("../services/workflowService");


async function handleWorkflowEvent(req, res) {
  try {

    const event = req.body;

    if (!event || !event.type) {
      return res.status(400).json({
        success: false,
        message: "Event type is required"
      });
    }

    const result = await processEvent(event);

    res.json({
      success: true,
      result
    });

  } catch (error) {

    console.error("Workflow event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process workflow event"
    });

  }
}


async function handlePatientStatus(req, res) {
  try {

    const patient = req.body;

    if (!patient || !patient.id || !patient.name) {
      return res.status(400).json({
        success: false,
        message: "Patient id and name are required"
      });
    }

    const result = await getPatientStatus(patient);

    res.json({
      success: true,
      result
    });

  } catch (error) {

    console.error("Patient status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get patient status"
    });

  }
}


module.exports = {
  handleWorkflowEvent,
  handlePatientStatus
};