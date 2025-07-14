async function handler() {
  const results = {
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  };

  function addTestResult(name, passed, error = null) {
    results.tests.push({
      name,
      passed,
      error: error?.message || error,
      timestamp: new Date().toISOString(),
    });
    results.summary.total++;
    results.summary[passed ? "passed" : "failed"]++;
  }

  try {
    const dbTest = await sql`SELECT 1 as connection_test`;
    addTestResult("Database Connection", dbTest?.[0]?.connection_test === 1);
  } catch (error) {
    addTestResult("Database Connection", false, error);
  }

  try {
    const session = getSession();
    addTestResult("Session Access", Boolean(session));
  } catch (error) {
    addTestResult("Session Access", false, error);
  }

  try {
    const tableTest = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'auth_users'
      ) as table_exists`;
    addTestResult("Required Tables", tableTest?.[0]?.table_exists === true);
  } catch (error) {
    addTestResult("Required Tables", false, error);
  }

  return results;
}
export async function POST(request) {
  return handler(await request.json());
}