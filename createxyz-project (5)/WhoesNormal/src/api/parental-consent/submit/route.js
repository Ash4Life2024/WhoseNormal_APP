async function handler({
  parentName,
  parentEmail,
  childName,
  childAge,
  childEmail,
  acknowledgment,
}) {
  if (
    !parentName ||
    !parentEmail ||
    !childName ||
    !childAge ||
    !acknowledgment
  ) {
    return { error: "Missing required fields" };
  }

  const age = parseInt(childAge);
  if (isNaN(age) || age < 9 || age > 13) {
    return { error: "Child must be between 9 and 13 years old" };
  }

  try {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }

    const result = await sql`
      INSERT INTO users (
        user_id,
        display_name,
        age_group,
        is_child,
        parent_name,
        parent_email,
        child_age,
        parental_consent,
        parent_approved,
        consent_date,
        account_status
      ) VALUES (
        ${session.user.id},
        ${childName},
        'teen',
        true,
        ${parentName},
        ${parentEmail},
        ${age},
        true,
        true,
        NOW(),
        'approved'
      )
      RETURNING id`;

    if (childEmail) {
      await fetch("https://api.create.xyz/v1/send-email", {
        method: "POST",
        body: JSON.stringify({
          to: childEmail,
          subject: "Welcome to Our Platform!",
          text: `Hi ${childName}! Your parent ${parentName} has approved your account. You can now start using our platform!`,
        }),
      });
    }

    await fetch("https://api.create.xyz/v1/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: parentEmail,
        subject: "Parental Consent Confirmation",
        text: `Dear ${parentName}, thank you for providing consent for ${childName} to use our platform. We've recorded your consent on ${new Date().toLocaleDateString()}.`,
      }),
    });

    return {
      success: true,
      userId: result[0].id,
    };
  } catch (error) {
    console.error("Error processing parental consent:", error);
    return { error: "Failed to process consent form" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}