async function handler({ error, context, stackTrace }) {
  if (!error) {
    return {
      success: false,
      message: "No error details provided",
    };
  }

  try {
    const errorDetails = {
      message: error,
      context: context || {},
      stackTrace: stackTrace || "",
      timestamp: new Date().toISOString(),
    };

    // Log error for tracking
    await sql`
      INSERT INTO security_audit_log 
      (event_type, event_details, created_at)
      VALUES 
      ('ERROR', ${JSON.stringify(errorDetails)}, NOW())
    `;

    // Construct prompt for Gemini
    const prompt = `
      Analyze this error and provide a solution:
      Error: ${error}
      Context: ${JSON.stringify(context)}
      Stack Trace: ${stackTrace}
      
      Please provide:
      1. Root cause analysis
      2. Immediate fix suggestion
      3. Long-term prevention steps
    `;

    // Call Gemini for analysis
    const response = await fetch("https://api.create.xyz/v1/gemini/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze error with AI");
    }

    const analysis = await response.json();

    // Return comprehensive error analysis
    return {
      success: true,
      error: {
        original: errorDetails,
        analysis: analysis.content,
        timestamp: errorDetails.timestamp,
      },
      suggestions: {
        immediate:
          analysis.content
            .split("Immediate fix suggestion:")[1]
            ?.split("Long-term")[0]
            ?.trim() || "No immediate fix available",
        longTerm:
          analysis.content.split("Long-term prevention steps:")[1]?.trim() ||
          "No long-term suggestions available",
      },
    };
  } catch (err) {
    // Fallback error response if AI analysis fails
    return {
      success: false,
      error: {
        original: error,
        message: "Failed to analyze error",
        fallback: true,
      },
      suggestions: {
        immediate:
          "Please check the error logs and contact support if the issue persists",
        longTerm: "Consider implementing better error monitoring and logging",
      },
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}