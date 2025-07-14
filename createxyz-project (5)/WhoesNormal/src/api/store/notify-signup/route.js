async function handler({ email }) {
  if (!email || !email.includes("@")) {
    return {
      error: "Valid email address is required",
    };
  }

  try {
    // Check if email already exists
    const existingSignup = await sql`
      SELECT id FROM investor_tracking 
      WHERE email = ${email}
    `;

    if (existingSignup.length > 0) {
      return {
        error: "Email already registered for notifications",
      };
    }

    // Insert new signup
    await sql`
      INSERT INTO investor_tracking 
      (email, status, notes)
      VALUES 
      (${email}, 'new', 'Store launch notification signup')
    `;

    // Send confirmation email
    const response = await fetch("https://api.resend.com/v1/email/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "store@yourdomain.com",
        to: email,
        subject: "Store Launch Notification Signup Confirmed",
        html: `
          <h2>Thanks for your interest!</h2>
          <p>You're now signed up to receive notifications when our store launches.</p>
          <p>We'll keep you updated on our progress and let you know as soon as we go live.</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send confirmation email");
    }

    return {
      success: true,
      message: "Successfully signed up for store launch notifications",
    };
  } catch (error) {
    console.error("Store notification signup error:", error);
    return {
      error: "Failed to process signup. Please try again later.",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}