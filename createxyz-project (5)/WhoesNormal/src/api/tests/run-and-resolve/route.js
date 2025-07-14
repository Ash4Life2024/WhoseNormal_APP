async function handler({
  testCategories = ["auth", "safety", "content", "interactions"],
} = {}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  try {
    const results = {
      timestamp: new Date().toISOString(),
      summary: { total: 0, passed: 0, failed: 0 },
      categories: {},
    };

    const testResults = await sql.transaction(async (txn) => {
      const categoryResults = [];

      if (testCategories.includes("auth")) {
        const authTests = await txn`
          SELECT COUNT(*) as total,
                 SUM(CASE WHEN account_locked = true THEN 1 ELSE 0 END) as locked,
                 SUM(CASE WHEN failed_login_attempts > 3 THEN 1 ELSE 0 END) as high_fails
          FROM users`;
        categoryResults.push({
          category: "auth",
          tests: [
            {
              name: "account_security",
              passed: authTests[0].locked === 0,
              details: `${authTests[0].locked} locked accounts found`,
            },
            {
              name: "login_attempts",
              passed: authTests[0].high_fails === 0,
              details: `${authTests[0].high_fails} accounts with high failed attempts`,
            },
          ],
        });
      }

      if (testCategories.includes("safety")) {
        const safetyTests = await txn`
          SELECT COUNT(*) as total,
                 COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_errors
          FROM system_errors 
          WHERE status = 'active'`;
        categoryResults.push({
          category: "safety",
          tests: [
            {
              name: "active_errors",
              passed: safetyTests[0].total === 0,
              details: `${safetyTests[0].total} active system errors`,
            },
            {
              name: "critical_issues",
              passed: safetyTests[0].critical_errors === 0,
              details: `${safetyTests[0].critical_errors} critical errors found`,
            },
          ],
        });
      }

      if (testCategories.includes("content")) {
        const contentTests = await txn`
          SELECT COUNT(*) as total,
                 COUNT(CASE WHEN is_approved = false THEN 1 END) as unapproved
          FROM kids_posts`;
        categoryResults.push({
          category: "content",
          tests: [
            {
              name: "content_moderation",
              passed: contentTests[0].unapproved === 0,
              details: `${contentTests[0].unapproved} posts pending approval`,
            },
          ],
        });
      }

      if (testCategories.includes("interactions")) {
        const interactionTests = await txn`
          SELECT COUNT(*) as total,
                 COUNT(DISTINCT user_id) as unique_users
          FROM positive_interactions
          WHERE created_at > NOW() - INTERVAL '24 hours'`;
        categoryResults.push({
          category: "interactions",
          tests: [
            {
              name: "user_engagement",
              passed: interactionTests[0].unique_users > 0,
              details: `${interactionTests[0].unique_users} users engaged in last 24h`,
            },
          ],
        });
      }

      return categoryResults;
    });

    testResults.forEach((category) => {
      results.categories[category.category] = {
        tests: category.tests,
        summary: {
          total: category.tests.length,
          passed: category.tests.filter((t) => t.passed).length,
          failed: category.tests.filter((t) => !t.passed).length,
        },
      };

      results.summary.total += category.tests.length;
      results.summary.passed += category.tests.filter((t) => t.passed).length;
      results.summary.failed += category.tests.filter((t) => !t.passed).length;
    });

    await sql`
      INSERT INTO security_audit_log 
      (user_id, event_type, event_details, severity)
      VALUES 
      (${session.user.id}, 'TEST_RUN', ${JSON.stringify(results)}, 
       ${results.summary.failed > 0 ? "medium" : "low"})`;

    return results;
  } catch (error) {
    await sql`
      INSERT INTO system_errors 
      (error_code, error_message, severity, component)
      VALUES 
      ('TEST_FAILURE', ${error.message}, 'high', 'test_runner')`;

    return {
      error: "Failed to run tests",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}