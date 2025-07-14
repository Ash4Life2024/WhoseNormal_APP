async function handler({ email }) {
  if (!email || !email.includes("@")) {
    return { error: "Valid email address is required" };
  }

  try {
    await sql`
      INSERT INTO investor_tracking (email, downloaded_at)
      VALUES (${email}, NOW())
    `;

    const pitchDeckUrl = "https://storage.create.xyz/pitch-deck-2024.pdf";

    return {
      success: true,
      downloadUrl: pitchDeckUrl,
    };
  } catch (error) {
    return { error: "Failed to process request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}