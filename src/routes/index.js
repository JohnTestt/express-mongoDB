import express from 'express';
import Paciente from '../models/Pacientes.js';

const router = express.Router();

// CREATE
router.post('/pacientes', async (req, res) => {
  const { name, mail, phone, age } = req.body;
  if (!name || !mail || !phone || age == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newPaciente = new Paciente({ name, mail, phone, age });
    await newPaciente.save();
    return res.status(201).json(newPaciente);
  } catch (err) {
    console.error("Error creating patient:", err);
    return res.status(500).json({ message: "Unable to create patient" });
  }
});

// READ ALL
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    return res.status(200).json(pacientes);
  } catch (err) {
    console.error("Error fetching patients:", err);
    return res.status(500).json({ message: "Unable to fetch patients" });
  }
});

// READ ONE
router.get('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json(paciente);
  } catch (err) {
    console.error("Error fetching patient:", err);
    return res.status(500).json({ message: "Unable to fetch patient" });
  }
});

// UPDATE
router.put('/pacientes/:id', async (req, res) => {
  const { name, mail, phone, age } = req.body;
  try {
    const updated = await Paciente.findByIdAndUpdate(
      req.params.id,
      { name, mail, phone, age },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating patient:", err);
    return res.status(500).json({ message: "Unable to update patient" });
  }
});

// DELETE
router.delete('/pacientes/:id', async (req, res) => {
  try {
    const deleted = await Paciente.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }
    // Pode retornar o objeto ou apenas o ID
    return res.status(200).json({ message: "Patient deleted", id: deleted._id });
  } catch (err) {
    console.error("Error deleting patient:", err);
    return res.status(500).json({ message: "Unable to delete patient" });
  }
});

export default router;
