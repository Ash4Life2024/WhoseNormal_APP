async function handler() {
  const results = {
    database: { status: "unknown", error: null },
    auth: { status: "unknown", error: null },
    session: { status: "unknown", error: null },
    api: { status: "unknown", error: null },
    security: { status: "unknown", error: null },
  };

  try {
    const dbResult = await sql`SELECT 1 as test`;
    results.database.status = dbResult?.[0]?.test === 1 ? "ok" : "failed";
  } catch (e) {
    results.database.status = "failed";
    results.database.error = e.message;
  }

  try {
    const session = getSession();
    results.session.status = session ? "ok" : "failed";
  } catch (e) {
    results.session.status = "failed";
    results.session.error = e.message;
  }

  try {
    const authUsers = await sql`SELECT COUNT(*) as count FROM auth_users`;
    results.auth.status = authUsers?.[0]?.count >= 0 ? "ok" : "failed";
  } catch (e) {
    results.auth.status = "failed";
    results.auth.error = e.message;
  }

  try {
    const response = await fetch(
      "https://api.giphy.com/v1/gifs/search?q=test&limit=1"
    );
    results.api.status = response.ok ? "ok" : "failed";
  } catch (e) {
    results.api.status = "failed";
    results.api.error = e.message;
  }

  try {
    const securityChecks = await sql`
      SELECT COUNT(*) as count 
      FROM security_audit_log 
      WHERE created_at > NOW() - INTERVAL '24 hours'
      AND severity = 'critical'
    `;
    results.security.status =
      securityChecks?.[0]?.count === 0 ? "ok" : "warning";
  } catch (e) {
    results.security.status = "failed";
    results.security.error = e.message;
  }

  return {
    success: Object.values(results).every((r) => r.status === "ok"),
    results,
  };
}
export async function POST(request) {
  return handler(await request.json());
}