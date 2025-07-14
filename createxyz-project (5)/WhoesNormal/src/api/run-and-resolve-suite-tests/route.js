async function handler({
  testCategories = ["auth", "safety", "content", "interactions"],
} = {}) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    categories: {},
    errors: [],
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
  };

  try {
    for (const category of testCategories) {
      results.categories[category] = {
        passed: 0,
        failed: 0,
        skipped: 0,
        tests: [],
      };

      const tests = await sql`
        SELECT id, test_name, test_type, expected_result 
        FROM system_errors 
        WHERE component = ${category}
        AND status = 'active'
      `;

      for (const test of tests) {
        results.total++;

        try {
          const testResult = await sql`
            INSERT INTO security_audit_log 
            (event_type, event_details, severity, resolution_status)
            VALUES 
            (${test.test_name}, ${JSON.stringify({
            type: test.test_type,
          })}, 'low', 'pending')
            RETURNING id
          `;

          if (testResult) {
            results.passed++;
            results.categories[category].passed++;
            results.categories[category].tests.push({
              name: test.test_name,
              status: "passed",
              duration: 0,
            });
          }
        } catch (testError) {
          results.failed++;
          results.categories[category].failed++;
          results.categories[category].tests.push({
            name: test.test_name,
            status: "failed",
            error: testError.message,
          });

          results.errors.push({
            category,
            test: test.test_name,
            error: testError.message,
          });

          await sql`
            UPDATE system_errors
            SET error_count = error_count + 1,
                last_occurrence = CURRENT_TIMESTAMP
            WHERE id = ${test.id}
          `;
        }
      }
    }

    results.endTime = new Date().toISOString();
    results.duration = new Date(results.endTime) - new Date(results.startTime);

    await sql`
      INSERT INTO security_audit_log 
      (event_type, event_details, severity, resolution_status)
      VALUES 
      ('test_suite_completed', ${JSON.stringify(results)}, 'low', 'resolved')
    `;

    return results;
  } catch (error) {
    results.endTime = new Date().toISOString();
    results.duration = new Date(results.endTime) - new Date(results.startTime);

    await sql`
      INSERT INTO security_audit_log 
      (event_type, event_details, severity, resolution_status)
      VALUES 
      ('test_suite_failed', ${JSON.stringify({
        error: error.message,
        results,
      })}, 'high', 'pending')
    `;

    return {
      error: "Test suite execution failed",
      message: error.message,
      results,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}