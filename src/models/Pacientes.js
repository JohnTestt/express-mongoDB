import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
  
    age: {
        type: Number,
        required: true,
        min: [0, 'Age must be a positive number'],
        max: [110, 'Age seems unrealistic'],
    }

})

const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;

