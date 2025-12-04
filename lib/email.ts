import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "FireSaleHomes <noreply@firesalehomes.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@firesalehomes.com";

export type SellerLeadEmailData = {
  propertyAddress: string;
  timeline: string;
  condition: string;
  reason: string;
  name: string;
  contact: string;
};

export async function sendNewSellerLeadNotification(data: SellerLeadEmailData): Promise<void> {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping email notification");
    console.log("[Email] Would have sent seller lead notification:", data);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Seller Lead: ${data.propertyAddress}`,
      html: `
        <h2>New Motivated Seller Lead</h2>
        <p>A new property has been submitted on FireSaleHomes.</p>
        
        <h3>Property Details</h3>
        <ul>
          <li><strong>Address:</strong> ${data.propertyAddress}</li>
          <li><strong>Timeline:</strong> ${data.timeline}</li>
          <li><strong>Condition:</strong> ${data.condition}</li>
          <li><strong>Reason for selling:</strong> ${data.reason}</li>
        </ul>
        
        <h3>Seller Contact</h3>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Contact:</strong> ${data.contact}</li>
        </ul>
        
        <p style="color: #666; font-size: 12px;">
          This email was sent automatically by FireSaleHomes.
        </p>
      `,
    });
    console.log("[Email] Seller lead notification sent successfully");
  } catch (error) {
    console.error("[Email] Failed to send seller lead notification:", error);
  }
}

export async function sendSellerConfirmation(email: string, name: string): Promise<void> {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping seller confirmation");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your property submission - FireSaleHomes",
      html: `
        <h2>Thanks for submitting your property, ${name}!</h2>
        
        <p>We have received your property details and are reviewing them now.</p>
        
        <h3>What happens next?</h3>
        <ol>
          <li>Our team reviews your submission (usually within 24 hours)</li>
          <li>We share your listing with our network of pre-vetted cash buyers</li>
          <li>Interested buyers will reach out to discuss offers</li>
        </ol>
        
        <p>Remember: You are under no obligation to accept any offer. This is about giving you options.</p>
        
        <p>Questions? Reply to this email and we will get back to you.</p>
        
        <p>Best,<br>The FireSaleHomes Team</p>
        
        <p style="color: #666; font-size: 12px;">
          FireSaleHomes is a marketplace platform, not a real estate broker.
        </p>
      `,
    });
    console.log("[Email] Seller confirmation sent successfully");
  } catch (error) {
    console.error("[Email] Failed to send seller confirmation:", error);
  }
}

export async function sendUnlockConfirmation(
  investorEmail: string,
  investorName: string,
  propertyAddress: string,
  sellerName: string,
  sellerContact: string
): Promise<void> {
  if (!resend) {
    console.log("[Email] Resend not configured, skipping unlock confirmation");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: investorEmail,
      subject: `Lead Unlocked: ${propertyAddress} - FireSaleHomes`,
      html: `
        <h2>Lead Unlocked Successfully</h2>

        <p>Hi ${investorName},</p>

        <p>You have unlocked the following motivated seller lead:</p>

        <h3>Property</h3>
        <p><strong>${propertyAddress}</strong></p>

        <h3>Seller Contact Info</h3>
        <ul>
          <li><strong>Name:</strong> ${sellerName}</li>
          <li><strong>Contact:</strong> ${sellerContact}</li>
        </ul>

        <p><strong>You have 48-hour exclusive access.</strong> No other investor can unlock this lead during this time.</p>

        <p>Good luck with your deal!</p>

        <p>Best,<br>The FireSaleHomes Team</p>
      `,
    });
    console.log("[Email] Unlock confirmation sent successfully");
  } catch (error) {
    console.error("[Email] Failed to send unlock confirmation:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/investor/reset-password?token=${resetToken}`;

  if (!resend) {
    console.log("[Email] Resend not configured, skipping password reset email");
    console.log("[Email] Reset URL would be:", resetUrl);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password - FireSaleHomes",
      html: `
        <h2>Password Reset Request</h2>

        <p>Hi ${name},</p>

        <p>We received a request to reset your password for your FireSaleHomes investor account.</p>

        <p>Click the button below to set a new password:</p>

        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 600;">
            Reset Password
          </a>
        </p>

        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>

        <p><strong>This link expires in 1 hour.</strong></p>

        <p>If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>

        <p>Best,<br>The FireSaleHomes Team</p>
      `,
    });
    console.log("[Email] Password reset email sent successfully");
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
  }
}

