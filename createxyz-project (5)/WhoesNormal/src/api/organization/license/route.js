async function handler({
  action,
  organizationName,
  organizationType,
  licenseType,
  seatsLimit,
  contactName,
  contactEmail,
  billingDetails,
  licenseId,
  startDate,
  endDate,
}) {
  switch (action) {
    case "create":
      if (
        !organizationName ||
        !organizationType ||
        !licenseType ||
        !seatsLimit ||
        !contactName ||
        !contactEmail
      ) {
        return { error: "Missing required fields" };
      }

      const newLicense = await sql`
        INSERT INTO organization_licenses (
          organization_name,
          organization_type,
          license_type,
          seats_limit,
          contact_name,
          contact_email,
          billing_details,
          start_date,
          end_date,
          status
        ) VALUES (
          ${organizationName},
          ${organizationType},
          ${licenseType},
          ${seatsLimit},
          ${contactName},
          ${contactEmail},
          ${billingDetails || {}},
          ${startDate || new Date()},
          ${endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)},
          'active'
        ) RETURNING *`;

      return { license: newLicense[0] };

    case "update":
      if (!licenseId) {
        return { error: "License ID required" };
      }

      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      if (seatsLimit) {
        updateFields.push(`seats_limit = $${paramCount}`);
        updateValues.push(seatsLimit);
        paramCount++;
      }
      if (billingDetails) {
        updateFields.push(`billing_details = $${paramCount}`);
        updateValues.push(billingDetails);
        paramCount++;
      }
      if (endDate) {
        updateFields.push(`end_date = $${paramCount}`);
        updateValues.push(endDate);
        paramCount++;
      }

      if (updateFields.length === 0) {
        return { error: "No fields to update" };
      }

      updateValues.push(licenseId);
      const updatedLicense = await sql(
        `UPDATE organization_licenses 
        SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *`,
        updateValues
      );

      return { license: updatedLicense[0] };

    case "get":
      if (!licenseId) {
        return { error: "License ID required" };
      }

      const license = await sql`
        SELECT * FROM organization_licenses 
        WHERE id = ${licenseId}`;

      return { license: license[0] };

    case "list":
      const licenses = await sql`
        SELECT * FROM organization_licenses 
        ORDER BY created_at DESC`;

      return { licenses };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}