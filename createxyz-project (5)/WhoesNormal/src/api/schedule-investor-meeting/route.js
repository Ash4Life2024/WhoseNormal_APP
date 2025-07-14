async function handler({ email, preferredMeetingTime }) {
  if (!email || !preferredMeetingTime) {
    return {
      error: "Email and preferred meeting time are required",
    };
  }

  try {
    const [investor] = await sql`
      INSERT INTO investor_tracking (
        email, 
        meeting_requested_at, 
        meeting_scheduled_at,
        status
      )
      VALUES (
        ${email},
        CURRENT_TIMESTAMP,
        ${new Date(preferredMeetingTime)},
        'pending'
      )
      RETURNING *
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "meetings@yourdomain.com",
        to: process.env.FOUNDER_EMAIL,
        subject: "New Investor Meeting Request",
        html: `
          New meeting request received:<br>
          Email: ${email}<br>
          Preferred Time: ${new Date(preferredMeetingTime).toLocaleString()}<br>
          <br>
          Please review and confirm the meeting time.
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email notification");
    }

    return {
      success: true,
      message:
        "Meeting request received successfully. Our team will contact you shortly to confirm the meeting time.",
      meetingDetails: {
        requestId: investor.id,
        status: investor.status,
        requestedTime: investor.meeting_scheduled_at,
      },
    };
  } catch (error) {
    return {
      error: "Failed to process meeting request",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}