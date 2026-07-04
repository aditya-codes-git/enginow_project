/**
 * Abstracted Email Service
 * Easily replaceable with SMTP, SendGrid, SES, Resend, or Mailgun.
 */

export const sendAdminOnboardingNotification = async (application) => {
  // In development/test mode, we write the email context to stdout.
  console.log(`[Email Service] Administrator Notification Sent:
--------------------------------------------------
New Organizer Application received!
Application ID: ${application._id}
Applicant Name: ${application.applicantName}
Organization: ${application.organizationName} (${application.organizationType})
Email: ${application.email}
Phone: ${application.phone}
Submitted At: ${application.createdAt}
--------------------------------------------------`);
};

export const sendApplicantOnboardingConfirmation = async (application) => {
  console.log(`[Email Service] Confirmation Email Sent to ${application.email}:
--------------------------------------------------
Dear ${application.applicantName},

Thank you for applying to become an organizer on Enginow.
Our team has received your application (ID: ${application._id}) for ${application.organizationName}.
We will review your submission and contact you shortly using the email address you provided.

Best regards,
The Enginow Team
--------------------------------------------------`);
};

export default {
  sendAdminOnboardingNotification,
  sendApplicantOnboardingConfirmation,
};
