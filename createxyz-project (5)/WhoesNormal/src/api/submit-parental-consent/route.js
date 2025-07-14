async function handler({
  parentName,
  parentEmail,
  childName,
  childAge,
  childEmail,
  parentIdentity,
  termsAccepted,
  privacyAccepted,
  dataCollectionConsent,
  communicationConsent,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!termsAccepted || !privacyAccepted || !dataCollectionConsent) {
    return { error: "Required consents must be accepted" };
  }

  const age = parseInt(childAge);
  if (isNaN(age) || age < 9 || age > 13) {
    return { error: "Child must be between 9 and 13 years old" };
  }

  try {
    const verificationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const result = await sql.transaction([
      sql`
        INSERT INTO parent_verification_attempts (
          user_id, verification_code, expires_at
        ) VALUES (
          ${session.user.id}, ${verificationCode}, ${expiresAt}
        ) RETURNING id
      `,
      sql`
        INSERT INTO users (
          user_id, display_name, age_group, parent_name, parent_email,
          child_age, terms_accepted, privacy_accepted, parent_verification_code,
          parent_verification_expiry, account_status
        ) VALUES (
          ${session.user.id}, ${childName}, 'teen',
          ${parentName}, ${parentEmail}, ${age},
          ${termsAccepted}, ${privacyAccepted}, ${verificationCode},
          ${expiresAt}, 'pending'
        )
      `,
      sql`
        INSERT INTO security_audit_log (
          user_id, event_type, event_details
        ) VALUES (
          ${session.user.id},
          'PARENTAL_CONSENT_SUBMITTED',
          ${JSON.stringify({
            parentName,
            parentEmail,
            childName,
            childAge,
            verificationRequested: new Date(),
          })}
        )
      `,
    ]);

    const emailEndpoint = "https://api.create.xyz/v1/send-email";
    await fetch(emailEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: parentEmail,
        subject: "Verify Parental Consent",
        text: `Your verification code is: ${verificationCode}\nThis code will expire in 24 hours.`,
      }),
    });

    return {
      success: true,
      message: "Verification code sent to parent email",
    };
  } catch (error) {
    await sql`
      INSERT INTO security_audit_log (
        user_id, event_type, event_details
      ) VALUES (
        ${session.user.id},
        'PARENTAL_CONSENT_ERROR',
        ${JSON.stringify({ error: error.message })}
      )
    `;

    return { error: "Failed to process consent submission" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}