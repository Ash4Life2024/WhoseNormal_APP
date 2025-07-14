async function handler({ fields }) {
  try {
    if (!fields) {
      return {
        success: false,
        error: "Fields are required",
      };
    }

    const requestBody = {
      records: [
        {
          fields: fields,
        },
      ],
    };

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error?.message || "Failed to create record",
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        id: result.records[0].id,
        ...result.records[0].fields,
      },
    };
  } catch (error) {
    console.error("Error creating record:", error);
    return {
      success: false,
      error: error.message || "Failed to create record",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}