async function handler({ testSuite = "all", userId = null }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized access" };
  }

  const results = {
    suite: testSuite,
    timestamp: new Date().toISOString(),
    tests: [],
  };

  if (testSuite === "auth" || testSuite === "all") {
    const authTests = await sql`
      SELECT COUNT(*) as valid_sessions 
      FROM auth_sessions 
      WHERE expires > NOW()
    `;

    const authAccounts = await sql`
      SELECT COUNT(*) as total_accounts 
      FROM auth_accounts
    `;

    results.tests.push({
      name: "Active Sessions Check",
      passed: authTests[0].valid_sessions > 0,
      details: `Found ${authTests[0].valid_sessions} valid sessions`,
    });

    results.tests.push({
      name: "Auth Accounts Verification",
      passed: authAccounts[0].total_accounts > 0,
      details: `Found ${authAccounts[0].total_accounts} registered accounts`,
    });
  }

  if (testSuite === "users" || testSuite === "all") {
    const targetUser = userId || session.user.id;
    const userDetails = await sql`
      SELECT u.*, up.points, up.level
      FROM auth_users u
      LEFT JOIN user_points up ON u.id = up.user_id
      WHERE u.id = ${targetUser}
    `;

    const userVerification = await sql`
      SELECT COUNT(*) as verified_count
      FROM parent_verification_attempts
      WHERE user_id = ${targetUser} AND verified_at IS NOT NULL
    `;

    results.tests.push({
      name: "User Profile Integrity",
      passed: userDetails.length > 0,
      details: "User profile data is accessible",
    });

    results.tests.push({
      name: "User Points System",
      passed: userDetails[0]?.points !== undefined,
      details: `User level: ${userDetails[0]?.level || "N/A"}`,
    });

    results.tests.push({
      name: "Parental Verification",
      passed: userVerification[0].verified_count > 0,
      details: `Verification status: ${
        userVerification[0].verified_count > 0 ? "Verified" : "Pending"
      }`,
    });
  }

  if (testSuite === "security" || testSuite === "all") {
    const securityAudit = await sql`
      SELECT COUNT(*) as recent_events
      FROM security_audit_log
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `;

    const errorLogs = await sql`
      SELECT COUNT(*) as active_errors
      FROM system_errors
      WHERE status = 'active'
      AND severity IN ('high', 'critical')
    `;

    results.tests.push({
      name: "Security Audit Log",
      passed: securityAudit[0].recent_events >= 0,
      details: `${securityAudit[0].recent_events} events in last 24h`,
    });

    results.tests.push({
      name: "Critical Error Check",
      passed: errorLogs[0].active_errors === 0,
      details: `${errorLogs[0].active_errors} active critical errors`,
    });
  }

  results.summary = {
    total: results.tests.length,
    passed: results.tests.filter((t) => t.passed).length,
    failed: results.tests.filter((t) => !t.passed).length,
  };

  return results;
}
export async function POST(request) {
  return handler(await request.json());
}