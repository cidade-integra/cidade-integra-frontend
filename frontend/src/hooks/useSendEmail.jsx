import { useState } from "react";

const useSendEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendEmail = async (to, subject, text, html) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const functionUrl =
        process.env.REACT_APP_EMAIL_FUNCTION_URL ||
        "https://us-central1-your-project-id.cloudfunctions.net/sendEmailNotification";

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, text, html }),
      });

      const data = await response.text();
      setIsSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to send email");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmail, isLoading, error, isSuccess };
};

export default useSendEmail;
