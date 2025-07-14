"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [selectedModel, setSelectedModel] = useState("CHAT_GPT");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 100,
    topP: 1,
  });

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setResponse(message);
      setStreamingMessage("");
    },
  });

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        selectedModel === "CHAT_GPT"
          ? "/integrations/chat-gpt/conversationgpt4"
          : "/integrations/google-gemini-1-5/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      handleStreamResponse(response);
    } catch (err) {
      setError("Failed to get AI response");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Models</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedModel("CHAT_GPT")}
                className={`w-full p-4 rounded-lg border ${
                  selectedModel === "CHAT_GPT"
                    ? "bg-[#357AFF] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <i className="fas fa-robot mr-2"></i>
                ChatGPT 4
              </button>
              <button
                onClick={() => setSelectedModel("GOOGLE_GEMINI")}
                className={`w-full p-4 rounded-lg border ${
                  selectedModel === "GOOGLE_GEMINI"
                    ? "bg-[#357AFF] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <i className="fas fa-microchip mr-2"></i>
                Google Gemini
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="font-bold text-gray-800">Settings</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) =>
                    setSettings({ ...settings, temperature: e.target.value })
                  }
                  className="w-full"
                />
                <div className="text-sm text-gray-600 text-right">
                  {settings.temperature}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) =>
                    setSettings({ ...settings, maxTokens: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                AI Builder
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border min-h-[120px]"
                    placeholder="Enter your prompt here..."
                  />
                </div>

                <button
                  onClick={handleTest}
                  disabled={loading || !prompt}
                  className="bg-[#357AFF] text-white px-6 py-3 rounded-lg hover:bg-[#2E69DE] disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-play mr-2"></i>
                  )}
                  Test Response
                </button>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  <h3 className="font-bold text-gray-800 mb-4">Response</h3>
                  <div className="whitespace-pre-wrap">
                    {streamingMessage ||
                      response ||
                      "Response will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;