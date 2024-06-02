const express = require('express');
const router = express.Router();
const CleaningSchedule = require('../models/CleaningSchedule');

// Get cleaning schedule for a specific hostel
router.get('/hostels/:hostelId/cleaning-schedule', async (req, res) => {
  try {
    const schedule = await CleaningSchedule.find({ hostelId: req.params.hostelId });
    res.json(schedule);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create or update a cleaning schedule entry
router.post('/hostels/:hostelId/cleaning-schedule', async (req, res) => {
  try {
    const { date, roomNumber, cleaned } = req.body;
    let scheduleEntry = await CleaningSchedule.findOne({ hostelId: req.params.hostelId, date, roomNumber });
    
    if (scheduleEntry) {
      // Update existing entry
      scheduleEntry.cleaned = cleaned;
    } else {
      // Create new entry
      scheduleEntry = new CleaningSchedule({ hostelId: req.params.hostelId, date, roomNumber, cleaned });
    }
    
    await scheduleEntry.save();
    res.status(201).send(scheduleEntry);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a cleaning schedule entry (if needed)
router.delete('/hostels/:hostelId/cleaning-schedule/:entryId', async (req, res) => {
  try {
    await CleaningSchedule.findByIdAndDelete(req.params.entryId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
