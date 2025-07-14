async function handler({ category }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  try {
    let testQuery = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.category,
        t.challenge_type,
        t.duration_minutes,
        t.points,
        COALESCE(p.status, 'NOT_STARTED') as status
      FROM challenges t
      LEFT JOIN user_challenge_progress p 
        ON t.id = p.challenge_id 
        AND p.user_id = $1
    `;

    const queryParams = [session.user.id];

    if (category) {
      testQuery += ` WHERE t.category = $2`;
      queryParams.push(category);
    }

    testQuery += ` ORDER BY t.created_at DESC`;

    const tests = await sql(testQuery, queryParams);

    if (!tests.length) {
      return {
        success: true,
        message: category
          ? `No tests found for category ${category}`
          : "No tests available",
        tests: [],
      };
    }

    const results = await sql.transaction(async (txn) => {
      const testResults = [];

      for (const test of tests) {
        if (test.status !== "COMPLETED") {
          await txn(
            "INSERT INTO user_challenge_progress (user_id, challenge_id, status, started_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) ON CONFLICT (user_id, challenge_id) DO UPDATE SET status = $3, started_at = CURRENT_TIMESTAMP",
            [session.user.id, test.id, "IN_PROGRESS"]
          );
        }

        testResults.push({
          id: test.id,
          title: test.title,
          description: test.description,
          category: test.category,
          type: test.challenge_type,
          duration: test.duration_minutes,
          points: test.points,
          status: test.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
        });
      }

      return testResults;
    });

    return {
      success: true,
      tests: results,
    };
  } catch (error) {
    console.error("Test execution error:", error);
    return {
      success: false,
      error: "Failed to execute tests",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}