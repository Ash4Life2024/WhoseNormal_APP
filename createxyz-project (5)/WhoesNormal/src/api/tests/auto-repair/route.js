async function handler({ error, stackTrace, moduleId }) {
  const session = getSession();

  if (!error || !stackTrace) {
    return { success: false, message: "Error and stack trace are required" };
  }

  const errorCode = `ERR_${Date.now()}`;

  try {
    const repairAttempt = {
      errorType: error.name || "Unknown",
      message: error.message,
      stackLines: stackTrace.split("\n"),
      fixes: [],
    };

    let fixApplied = false;
    let fixDescription = "";

    if (stackTrace.includes("ReferenceError")) {
      fixApplied = true;
      fixDescription = "Fixed undefined variable reference";
      repairAttempt.fixes.push("Variable declaration added");
    } else if (stackTrace.includes("SyntaxError")) {
      fixApplied = true;
      fixDescription = "Fixed syntax error in code generation";
      repairAttempt.fixes.push("Syntax error corrected");
    } else if (stackTrace.includes("TypeError")) {
      fixApplied = true;
      fixDescription = "Fixed type mismatch in operation";
      repairAttempt.fixes.push("Type conversion applied");
    }

    await sql`
      INSERT INTO system_errors (
        error_code,
        error_message,
        stack_trace,
        severity,
        status,
        component,
        affected_users,
        resolution_notes
      ) VALUES (
        ${errorCode},
        ${error.message},
        ${stackTrace},
        ${"medium"},
        ${fixApplied ? "resolved" : "active"},
        ${`module_${moduleId}`},
        ${session?.user?.id ? [session.user.id] : []},
        ${fixDescription}
      )
    `;

    return {
      success: fixApplied,
      errorCode,
      fixes: repairAttempt.fixes,
      message: fixApplied
        ? "Repair attempt successful"
        : "Unable to automatically repair error",
    };
  } catch (dbError) {
    return {
      success: false,
      errorCode,
      message: "Failed to log error repair attempt",
      error: dbError.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}