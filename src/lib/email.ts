import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: EmailOptions) {
  await resend.emails.send({
    from: "Pouring at <noreply@transactional.pouring.at>",
    to,
    subject,
    text,
  });
}
