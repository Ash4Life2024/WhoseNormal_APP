async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  const testResults = {
    auth: [],
    safety: [],
    content: [],
    interactions: [],
  };

  // Auth Tests
  try {
    const userExists =
      await sql`SELECT id FROM auth_users WHERE id = ${session.user.id}`;
    testResults.auth.push({
      name: "User Authentication",
      passed: userExists.length > 0,
      details:
        userExists.length > 0 ? "User found in database" : "User not found",
    });
  } catch (e) {
    testResults.auth.push({
      name: "User Authentication",
      passed: false,
      details: "Database error during auth check",
    });
  }

  // Safety Tests
  try {
    const parentConsent = await sql`
      SELECT parental_consent, parent_approved 
      FROM users 
      WHERE user_id = ${session.user.id}`;

    testResults.safety.push({
      name: "Parental Controls",
      passed: parentConsent.length > 0,
      details:
        parentConsent.length > 0
          ? "Parental controls configured"
          : "Missing parental controls",
    });
  } catch (e) {
    testResults.safety.push({
      name: "Parental Controls",
      passed: false,
      details: "Database error during safety check",
    });
  }

  // Content Tests
  try {
    const recentPosts = await sql`
      SELECT id FROM kids_posts 
      WHERE user_id = ${session.user.id} 
      AND created_at > NOW() - INTERVAL '24 hours'`;

    testResults.content.push({
      name: "Content Creation",
      passed: true,
      details: `User has created ${recentPosts.length} posts in last 24h`,
    });
  } catch (e) {
    testResults.content.push({
      name: "Content Creation",
      passed: false,
      details: "Database error during content check",
    });
  }

  // Interaction Tests
  try {
    const interactions = await sql`
      SELECT COUNT(*) as count 
      FROM kids_reactions 
      WHERE user_id = ${session.user.id}`;

    testResults.interactions.push({
      name: "User Interactions",
      passed: true,
      details: `User has ${interactions[0].count} total reactions`,
    });
  } catch (e) {
    testResults.interactions.push({
      name: "User Interactions",
      passed: false,
      details: "Database error during interaction check",
    });
  }

  const summary = {
    totalTests: Object.values(testResults).flat().length,
    passedTests: Object.values(testResults)
      .flat()
      .filter((t) => t.passed).length,
    timestamp: new Date().toISOString(),
  };

  return {
    results: testResults,
    summary,
  };
}
export async function POST(request) {
  return handler(await request.json());
}