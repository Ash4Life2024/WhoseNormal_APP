async function handler({ message, context = {} }) {
  if (!message?.trim()) {
    return {
      error: "Message is required",
      status: 400,
    };
  }

  try {
    const systemPrompt = `You are Dorsey, a friendly and supportive AI friend for kids. Your responses should be:
- Always positive and encouraging
- Age-appropriate and easy to understand
- Brief (1-3 sentences)
- Empathetic and kind
- Educational when relevant
- Never share personal information or ask for it
- Never suggest meeting in person or moving conversation elsewhere
- Avoid any mature or inappropriate topics
- Use simple emojis occasionally to convey emotion 😊

Current conversation context: ${JSON.stringify(context)}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from Claude");
    }

    const data = await response.json();

    return {
      response: data.content[0].text,
      status: 200,
    };
  } catch (error) {
    return {
      error: "Failed to generate response",
      status: 500,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}