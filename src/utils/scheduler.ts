import cron from "node-cron";
import { PetDetail } from "../models/petDetails.model";
import { sendEmail } from "./emails";

/**
 * Schedule daily reminders at 00:00
 */
export const scheduleDailyReminders = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily email reminders...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // For querying the exact day

      // Find all PetDetails where date is today
      const reminders = await PetDetail.find({
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      }).populate({
        path: "petId",
        populate: { path: "owner" }, // populate owner info from Pet → User
      });

      for (const reminder of reminders) {
        const pet = reminder.petId as any; // populated pet
        if (!pet?.owner) continue; // skip if owner not found

        const owner = pet.owner as any; // populated user
        const email = owner.email;
        const petName = pet.name;

        const htmlContent = `
          <p>Hi ${owner.name},</p>
          <p>This is a reminder for your pet "<strong>${petName}</strong>" scheduled for today.</p>
          <p><strong>Type:</strong> ${reminder.type}</p>
          <p><strong>Description:</strong> ${reminder.description}</p>
          <p>Have a great day! 🐾</p>
        `;

        try {
          await sendEmail(email, `Reminder: ${reminder.type} for ${petName}`, htmlContent);
          console.log(`Reminder email sent to ${email} for pet ${petName}`);
        } catch (err) {
          console.error("Failed to send reminder email:", err);
        }
      }
    } catch (err) {
      console.error("Error running daily reminders:", err);
    }
  });
};
