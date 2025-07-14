async function handler({ ip, method, path, headers, body }) {
  const rateLimit = await sql`
    SELECT * FROM rate_limits 
    WHERE ip_address = ${ip} 
    AND endpoint = ${path}
    AND last_request_at > NOW() - INTERVAL '1 hour'
  `;

  if (rateLimit.length > 0) {
    const requests = rateLimit[0].request_count;
    if (requests > 100) {
      await sql`
        INSERT INTO ip_blacklist (ip_address, reason, block_count)
        VALUES (${ip}, 'Rate limit exceeded', 1)
        ON CONFLICT (ip_address) 
        DO UPDATE SET 
          block_count = ip_blacklist.block_count + 1,
          last_blocked_at = NOW()
      `;

      await sql`
        INSERT INTO security_audit_log (
          event_type, 
          event_details, 
          ip_address, 
          user_agent,
          severity
        ) VALUES (
          'RATE_LIMIT_EXCEEDED',
          ${JSON.stringify({ requests, threshold: 100, timeWindow: "1 hour" })},
          ${ip},
          ${headers["user-agent"]},
          'high'
        )
      `;

      return { error: "Rate limit exceeded", status: 429 };
    }

    await sql`
      UPDATE rate_limits 
      SET request_count = request_count + 1,
      last_request_at = NOW()
      WHERE ip_address = ${ip} 
      AND endpoint = ${path}
    `;
  } else {
    await sql`
      INSERT INTO rate_limits (
        ip_address, 
        endpoint, 
        request_count
      ) VALUES (
        ${ip}, 
        ${path}, 
        1
      )
    `;
  }

  const blacklisted = await sql`
    SELECT * FROM ip_blacklist 
    WHERE ip_address = ${ip}
    AND (expires_at IS NULL OR expires_at > NOW())
  `;

  if (blacklisted.length > 0) {
    return { error: "IP address blocked", status: 403 };
  }

  const suspicious = detectSuspiciousActivity({ method, path, headers, body });
  if (suspicious) {
    await sql`
      INSERT INTO security_threats (
        threat_type,
        severity,
        source_ip,
        user_agent,
        request_data
      ) VALUES (
        ${suspicious.type},
        ${suspicious.severity},
        ${ip},
        ${headers["user-agent"]},
        ${JSON.stringify({ path, method, headers, body })}
      )
    `;

    if (suspicious.severity === "high") {
      return {
        error: "Request blocked due to suspicious activity",
        status: 403,
      };
    }
  }

  return {
    allowed: true,
    status: 200,
    warnings: suspicious ? [suspicious] : [],
  };
}

function detectSuspiciousActivity({ method, path, headers, body }) {
  if (
    typeof body === "string" &&
    /(\b(union|select|insert|delete|from|where|drop)\b)/i.test(body)
  ) {
    return {
      type: "SQL_INJECTION_ATTEMPT",
      severity: "high",
    };
  }

  if (method === "POST" && !headers["content-type"]) {
    return {
      type: "MISSING_CONTENT_TYPE",
      severity: "medium",
    };
  }

  if (
    headers["user-agent"] &&
    /^(curl|wget|postman)/i.test(headers["user-agent"])
  ) {
    return {
      type: "SUSPICIOUS_USER_AGENT",
      severity: "low",
    };
  }

  if (body && JSON.stringify(body).length > 1000000) {
    return {
      type: "LARGE_PAYLOAD",
      severity: "medium",
    };
  }

  return null;
}
export async function POST(request) {
  return handler(await request.json());
}