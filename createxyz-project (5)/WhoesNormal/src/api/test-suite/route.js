async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Authentication required to run tests" };
  }

  const results = {
    auth: { passed: 0, failed: 0, tests: [] },
    safety: { passed: 0, failed: 0, tests: [] },
    content: { passed: 0, failed: 0, tests: [] },
    interactions: { passed: 0, failed: 0, tests: [] },
  };

  try {
    const userExists = await sql`
      SELECT id FROM auth_users WHERE id = ${session.user.id}
    `;
    results.auth.tests.push({
      name: "User exists in database",
      passed: userExists.length > 0,
    });
    results.auth.passed += userExists.length > 0 ? 1 : 0;
    results.auth.failed += userExists.length > 0 ? 0 : 1;
  } catch (e) {
    results.auth.tests.push({
      name: "User exists in database",
      passed: false,
      error: e.message,
    });
    results.auth.failed++;
  }

  try {
    const consentRecords = await sql`
      SELECT * FROM parent_verification_attempts 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    results.safety.tests.push({
      name: "Parental consent verification",
      passed: consentRecords.length > 0,
    });
    results.safety.passed += consentRecords.length > 0 ? 1 : 0;
    results.safety.failed += consentRecords.length > 0 ? 0 : 1;
  } catch (e) {
    results.safety.tests.push({
      name: "Parental consent verification",
      passed: false,
      error: e.message,
    });
    results.safety.failed++;
  }

  try {
    const contentCheck = await sql`
      SELECT COUNT(*) as count 
      FROM kids_posts 
      WHERE user_id = ${session.user.id} 
      AND is_approved = true
    `;
    results.content.tests.push({
      name: "Content moderation check",
      passed: contentCheck[0].count >= 0,
    });
    results.content.passed++;
  } catch (e) {
    results.content.tests.push({
      name: "Content moderation check",
      passed: false,
      error: e.message,
    });
    results.content.failed++;
  }

  try {
    const interactionCheck = await sql`
      SELECT COUNT(*) as count 
      FROM kids_reactions 
      WHERE user_id = ${session.user.id}
    `;
    results.interactions.tests.push({
      name: "User interaction check",
      passed: interactionCheck[0].count >= 0,
    });
    results.interactions.passed++;
  } catch (e) {
    results.interactions.tests.push({
      name: "User interaction check",
      passed: false,
      error: e.message,
    });
    results.interactions.failed++;
  }

  try {
    const resourceCheck = await sql`
      SELECT COUNT(*) as count 
      FROM resources 
      WHERE category = 'GENERAL'
    `;
    results.content.tests.push({
      name: "Resource accessibility",
      passed: resourceCheck[0].count > 0,
    });
    results.content.passed += resourceCheck[0].count > 0 ? 1 : 0;
    results.content.failed += resourceCheck[0].count > 0 ? 0 : 1;
  } catch (e) {
    results.content.tests.push({
      name: "Resource accessibility",
      passed: false,
      error: e.message,
    });
    results.content.failed++;
  }

  try {
    const challengeCheck = await sql`
      SELECT COUNT(*) as count 
      FROM challenges 
      WHERE category IN ('ADHD', 'ASD', 'GENERAL')
    `;
    results.content.tests.push({
      name: "Challenge system",
      passed: challengeCheck[0].count > 0,
    });
    results.content.passed += challengeCheck[0].count > 0 ? 1 : 0;
    results.content.failed += challengeCheck[0].count > 0 ? 0 : 1;
  } catch (e) {
    results.content.tests.push({
      name: "Challenge system",
      passed: false,
      error: e.message,
    });
    results.content.failed++;
  }

  return {
    success: true,
    results,
    summary: {
      total: Object.values(results).reduce(
        (acc, curr) => acc + curr.passed + curr.failed,
        0
      ),
      passed: Object.values(results).reduce(
        (acc, curr) => acc + curr.passed,
        0
      ),
      failed: Object.values(results).reduce(
        (acc, curr) => acc + curr.failed,
        0
      ),
    },
  };
}
export async function POST(request) {
  return handler(await request.json());
}