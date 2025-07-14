async function handler() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Failed to fetch records" };
    }

    const result = await response.json();

    const records = result.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return {
      success: true,
      data: records,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: error.message || "Failed to process records",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}