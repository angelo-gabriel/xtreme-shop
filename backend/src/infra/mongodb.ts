import mongoose from "mongoose";

import { env } from "../config/env.js";

export async function connectMongo() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}
