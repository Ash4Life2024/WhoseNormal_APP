async function handler({ testType = "all", component = null }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  const results = {
    success: true,
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    details: [],
  };

  const testSuite = {
    auth: async () => {
      const authTests = [
        {
          name: "Session Validation",
          run: async () => {
            const user =
              await sql`SELECT * FROM auth_users WHERE id = ${session.user.id}`;
            return {
              success: user.length > 0,
              message: user.length ? "Valid session" : "Invalid session",
            };
          },
        },
        {
          name: "User Permissions",
          run: async () => {
            const perms = await sql`
              SELECT * FROM auth_accounts 
              WHERE "userId" = ${session.user.id}
            `;
            return {
              success: perms.length > 0,
              message: "Permission check completed",
            };
          },
        },
      ];
      return authTests;
    },
    integration: async () => {
      const integrationTests = [
        {
          name: "Database Connection",
          run: async () => {
            try {
              await sql`SELECT 1`;
              return {
                success: true,
                message: "Database connection successful",
              };
            } catch (e) {
              return { success: false, message: "Database connection failed" };
            }
          },
        },
        {
          name: "User Data Integrity",
          run: async () => {
            const userCheck = await sql`
              SELECT u.id, COUNT(a.id) as account_count 
              FROM auth_users u 
              LEFT JOIN auth_accounts a ON u.id = a."userId"
              WHERE u.id = ${session.user.id}
              GROUP BY u.id
            `;
            return {
              success: userCheck.length > 0,
              message: "Data integrity verified",
            };
          },
        },
      ];
      return integrationTests;
    },
  };

  try {
    let testsToRun = [];

    if (testType === "all" || !testType) {
      testsToRun = [
        ...(await testSuite.auth()),
        ...(await testSuite.integration()),
      ];
    } else if (testType === "auth") {
      testsToRun = await testSuite.auth();
    } else if (testType === "integration") {
      testsToRun = await testSuite.integration();
    }

    if (component) {
      testsToRun = testsToRun.filter((test) =>
        test.name.toLowerCase().includes(component.toLowerCase())
      );
    }

    results.totalTests = testsToRun.length;

    for (const test of testsToRun) {
      try {
        const result = await test.run();
        results.details.push({
          name: test.name,
          success: result.success,
          message: result.message,
        });

        if (result.success) {
          results.passed++;
        } else {
          results.failed++;
          results.success = false;
        }
      } catch (error) {
        results.failed++;
        results.success = false;
        results.details.push({
          name: test.name,
          success: false,
          message: `Test error: ${error.message}`,
        });
      }
    }

    results.skipped = results.totalTests - (results.passed + results.failed);

    return results;
  } catch (error) {
    return {
      success: false,
      error: `Test runner failed: ${error.message}`,
      details: [],
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}