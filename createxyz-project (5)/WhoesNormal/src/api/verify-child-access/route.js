async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return {
      error: "Authentication required",
      status: 401,
    };
  }

  try {
    const user = await sql`
      SELECT 
        is_child,
        child_age,
        parent_approved,
        account_status,
        parental_consent
      FROM users 
      WHERE user_id = ${session.user.id}
    `;

    if (!user.length) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    const userData = user[0];

    if (!userData.is_child) {
      return {
        allowed: true,
        message: "Adult account - access granted",
        status: 200,
      };
    }

    const isAgeAppropriate =
      userData.child_age >= 9 && userData.child_age <= 13;
    const hasParentalConsent =
      userData.parental_consent && userData.parent_approved;
    const isAccountApproved = userData.account_status === "approved";

    const allowed = isAgeAppropriate && hasParentalConsent && isAccountApproved;

    return {
      allowed,
      status: 200,
      message: allowed ? "Access granted" : "Access denied",
      details: {
        ageAppropriate: isAgeAppropriate,
        parentalConsent: hasParentalConsent,
        accountApproved: isAccountApproved,
      },
    };
  } catch (error) {
    return {
      error: "Failed to verify access",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}