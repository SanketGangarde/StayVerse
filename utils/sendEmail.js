const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

async function sendBookingConfirmation({
  to,
  username,
  booking,
  listing,
  checkin,
  checkout,
  guests,
  nights,
  totalAmount,
  paymentId,
}) {
  return brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.MAIL_FROM_NAME,
      email: process.env.MAIL_FROM_EMAIL,
    },
    to: [
      {
        email: to,
        name: username || "Guest",
      },
    ],
    subject: `Booking Confirmation - ${listing.title}`,
    textContent: `
Hello ${username || "Guest"},

Your booking has been confirmed!

Booking ID: ${booking._id}
Property: ${listing.title}
Check-in: ${new Date(checkin).toDateString()}
Check-out: ${new Date(checkout).toDateString()}
Guests: ${guests}
Nights: ${nights}
Total Paid: INR ${totalAmount}
Payment ID: ${paymentId}

Thank you for booking with StayVerse!
`,
  });
}

module.exports = { sendBookingConfirmation };
