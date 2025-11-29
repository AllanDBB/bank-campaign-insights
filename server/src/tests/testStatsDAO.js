import mongoose from "mongoose";
import DocumentStatsDAO from "../daos/DocumentStatsDAO.js"; 
import Document from "../models/Document.js";

const MONGO_URI = "mongodb://localhost:27017/banking_dashboard"; // AJUSTA ESTO

async function runTest() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Conectado.");

    console.log("Ejecutando agregación...");
    const result = await DocumentStatsDAO.getAggregatedStats();

    console.log("Resultado:");
    console.dir(result, { depth: null });     // Muestra bien el objeto

  } catch (err) {
    console.error("Error ejecutando prueba:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Conexión cerrada.");
  }
}

runTest();
