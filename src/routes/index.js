import express from 'express';
import Paciente from '../models/Paciente.js';

const router = express.Router();

// Route to create a new patient

router.post('/pacientes', async (req, res) => {
    const { name, mail, phone, age } = req.body;

    try {
        const {name, mail, age, phone} = req.body;
        const newPaciente = new Paciente({ name, mail, phone, age  });
        await newPaciente.save();

    } catch (error) {
        res.status(400).json({ message: " error the create pacient", error });
    }
}
);
// Route to get all patients

router.get('/pacientes', async (req, res) =>  {
    try {
        const pacientes = await Paciente.find();
        res.status(200).json(pacientes);
    } catch (error) {
        
        res.status(400).json({ message: "Internal server error", error });
    }
})

//Get a single patient by ID
router.get("/pacientes/:id", async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(paciente);
    } catch (error) {
        res.status(400).json({ message: "Error fetching patient", error });
    }
});

//  Update a patient by ID
router.put("/pacientes/:id", async (req, res) => {
    const { name, mail, phone, age } = req.body;

    try {
        const updatedPaciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            { name, mail, phone, age },
            { new: true, runValidators: true }
        );

        if (!updatedPaciente) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated", updatedPaciente });
    } catch (error) {
        res.status(400).json({ message: "Error updating patient", error });
    }
});

//  Delete a patient by ID
router.delete("/pacientes/:id", async (req, res) => {
    try {
        const deletedPaciente = await Paciente.findByIdAndDelete(req.params.id);
        if (!deletedPaciente) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ message: "Patient deleted" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting patient", error });
    }
});

export default router;
