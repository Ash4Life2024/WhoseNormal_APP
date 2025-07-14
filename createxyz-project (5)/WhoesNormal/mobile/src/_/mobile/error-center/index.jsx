"use client";
import React from "react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!errorInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/error-resolver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: errorInput,
          context: context || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze error");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("Could not analyze the error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [errorInput, context]);

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <RNStatusBar style="dark" />
      <RNScrollView>
        <RNView style={{ padding: 20 }}>
          <RNText
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: 15,
            }}
          >
            Error Resolution Center 🔧
          </RNText>

          <RNView
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              marginBottom: 20,
            }}
          >
            <RNText
              style={{ fontSize: 16, color: "#4a5568", marginBottom: 10 }}
            >
              Describe the error you're experiencing:
            </RNText>
            <RNTextInput
              value={errorInput}
              onChangeText={setErrorInput}
              placeholder="What's not working?"
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 10,
                padding: 15,
                minHeight: 100,
                marginBottom: 15,
              }}
            />

            <RNText
              style={{ fontSize: 16, color: "#4a5568", marginBottom: 10 }}
            >
              Additional context (optional):
            </RNText>
            <RNTextInput
              value={context}
              onChangeText={setContext}
              placeholder="What were you doing when this happened?"
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 10,
                padding: 15,
                minHeight: 80,
                marginBottom: 15,
              }}
            />

            <RNTouchableOpacity
              onPress={handleSubmit}
              disabled={loading || !errorInput.trim()}
              style={{
                backgroundColor: errorInput.trim() ? "#4299e1" : "#a0aec0",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <RNText style={{ color: "white", fontWeight: "600" }}>
                {loading ? "Analyzing..." : "Analyze Error"}
              </RNText>
            </RNTouchableOpacity>
          </RNView>

          {error && (
            <RNView
              style={{
                backgroundColor: "#fed7d7",
                padding: 15,
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <RNText style={{ color: "#c53030" }}>{error}</RNText>
            </RNView>
          )}

          {analysis && (
            <RNView
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <RNText
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}
              >
                Analysis Results
              </RNText>

              <RNView style={{ marginBottom: 15 }}>
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#2d3748",
                    marginBottom: 5,
                  }}
                >
                  Immediate Fix:
                </RNText>
                <RNText style={{ color: "#4a5568" }}>
                  {analysis.suggestions?.immediate ||
                    "No immediate fix available"}
                </RNText>
              </RNView>

              <RNView>
                <RNText
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#2d3748",
                    marginBottom: 5,
                  }}
                >
                  Long-term Solution:
                </RNText>
                <RNText style={{ color: "#4a5568" }}>
                  {analysis.suggestions?.longTerm ||
                    "No long-term suggestions available"}
                </RNText>
              </RNView>
            </RNView>
          )}
        </RNView>
      </RNScrollView>
    </RNSafeAreaView>
  );
}

export default MainComponent;