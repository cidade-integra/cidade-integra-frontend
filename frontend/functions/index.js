/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.notificarMudancaStatus = functions.firestore
  .document("denuncias/{denunciaId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Verifica se o status mudou
    if (beforeData.status === afterData.status) {
      return null; // Nada a fazer se o status não mudou
    }

    const emailCidadao = afterData.emailCidadao;
    const denunciaId = context.params.denunciaId;

    // Mapeia status para mensagens amigáveis
    const statusMessages = {
      pendente: "sua denúncia foi criada com sucesso",
      em_análise: "sua denúncia está sendo analisada",
      resolvido: "sua denúncia foi resolvida com sucesso",
      rejeitado: "sua denúncia foi rejeitada",
    };

    const assunto = `Atualização da sua denúncia #${denunciaId}`;
    const mensagemStatus =
      statusMessages[afterData.status] ||
      `o status da sua denúncia foi alterado para ${afterData.status}`;

    const msg = {
      to: emailCidadao,
      from: "juniiorbarbieri95@gmail.com", // E-mail verificado no SendGrid
      subject: assunto,
      html: `
        <h1>Atualização da sua denúncia</h1>
        <p>Olá,</p>
        <p>Informamos que ${mensagemStatus}.</p>
        <p><strong>ID da denúncia:</strong> ${denunciaId}</p>
        <p><strong>Título:</strong> ${afterData.titulo}</p>
        <p><strong>Novo status:</strong> ${afterData.status}</p>
        <p>Acompanhe pelo nosso sistema ou responda este e-mail caso tenha dúvidas.</p>
        <p>Atenciosamente,<br>Equipe de Atendimento</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`E-mail de notificação enviado para ${emailCidadao}`);

      // Opcional: Registrar no Firestore que o e-mail foi enviado
      //await change.after.ref.update({
       // notificacaoEnviada: admin.firestore.FieldValue.serverTimestamp(),
      // }); 

      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Falha ao enviar notificação"
      );
    }
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
