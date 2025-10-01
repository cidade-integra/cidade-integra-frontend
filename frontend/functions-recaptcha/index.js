import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import fetch from "node-fetch";
import * as functions from "firebase-functions";
import { se } from "date-fns/locale";

// Pega a chave secreta do Firebase Functions config
const secretKey = functions.config().recaptcha.secret_key;

console.log(secretKey);

export const verifyRecaptcha = onRequest(async (req, res) => {
  const { token } = req.body;
  
  if (!token) return res.status(400).send({ success: false, message: "Token não fornecido" });

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    logger.info("reCAPTCHA response:", data);

    if (data.success) return res.status(200).send({ success: true });
    return res.status(400).send({ success: false, errors: data["error-codes"] });
  } catch (error) {
    logger.error("Erro no reCAPTCHA:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
});