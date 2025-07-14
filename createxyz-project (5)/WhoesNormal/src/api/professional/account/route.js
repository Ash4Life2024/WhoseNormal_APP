async function handler({
  action,
  userId,
  profession,
  licenseNumber,
  specializations,
  clientId,
  notes,
}) {
  if (action === "create") {
    if (!userId || !profession || !licenseNumber) {
      return { error: "Missing required fields" };
    }

    const existingAccount = await sql`
      SELECT id FROM professional_accounts 
      WHERE user_id = ${userId}
    `;

    if (existingAccount.length > 0) {
      return { error: "Professional account already exists" };
    }

    const account = await sql`
      INSERT INTO professional_accounts (
        user_id, 
        profession, 
        license_number, 
        specializations,
        verification_status
      )
      VALUES (
        ${userId}, 
        ${profession}, 
        ${licenseNumber}, 
        ${specializations || []}, 
        'pending'
      )
      RETURNING *
    `;

    return { account: account[0] };
  }

  if (action === "get") {
    if (!userId) {
      return { error: "User ID required" };
    }

    const account = await sql`
      SELECT * FROM professional_accounts 
      WHERE user_id = ${userId}
    `;

    return { account: account[0] || null };
  }

  if (action === "addClient") {
    if (!userId || !clientId) {
      return { error: "Missing required fields" };
    }

    const professionalAccount = await sql`
      SELECT id FROM professional_accounts 
      WHERE user_id = ${userId}
    `;

    if (!professionalAccount.length) {
      return { error: "Professional account not found" };
    }

    const existingClient = await sql`
      SELECT id FROM professional_clients
      WHERE professional_id = ${professionalAccount[0].id}
      AND client_id = ${clientId}
    `;

    if (existingClient.length) {
      return { error: "Client already added" };
    }

    const client = await sql`
      INSERT INTO professional_clients (
        professional_id,
        client_id,
        notes
      )
      VALUES (
        ${professionalAccount[0].id},
        ${clientId},
        ${notes || {}}
      )
      RETURNING *
    `;

    return { client: client[0] };
  }

  if (action === "listClients") {
    if (!userId) {
      return { error: "User ID required" };
    }

    const clients = await sql`
      SELECT pc.*, au.name, au.email 
      FROM professional_clients pc
      JOIN professional_accounts pa ON pa.id = pc.professional_id
      JOIN auth_users au ON au.id = pc.client_id
      WHERE pa.user_id = ${userId}
    `;

    return { clients };
  }

  return { error: "Invalid action" };
}
export async function POST(request) {
  return handler(await request.json());
}