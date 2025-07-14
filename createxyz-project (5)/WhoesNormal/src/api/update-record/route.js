async function handler({ recordId, fields }) {
  try {
    if (!recordId) {
      return {
        success: false,
        error: "Record ID is required",
      };
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: fields,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error?.message || "Failed to update record",
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        id: result.id,
        ...result.fields,
      },
    };
  } catch (error) {
    console.error("Error updating record:", error);
    return {
      success: false,
      error: error.message || "Failed to update record",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}