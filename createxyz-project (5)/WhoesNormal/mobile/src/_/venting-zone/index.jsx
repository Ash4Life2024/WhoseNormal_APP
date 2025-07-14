"use client";
import React from "react";

function MainComponent() {
  const [ventText, setVentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [vents, setVents] = useState([]);

  const emotions = [
    { emoji: "😔", label: "Sad" },
    { emoji: "😢", label: "Crying" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😕", label: "Confused" },
  ];

  const handleSubmitVent = useCallback(() => {
    if (!ventText.trim() || !selectedEmotion) return;

    const newVent = {
      id: Date.now(),
      text: ventText,
      emotion: selectedEmotion,
      isAnonymous,
      comments: [],
      timestamp: new Date().toISOString(),
    };

    setVents((prev) => [newVent, ...prev]);
    setVentText("");
    setSelectedEmotion(null);
  }, [ventText, selectedEmotion, isAnonymous]);

  const addComment = useCallback((ventId, comment) => {
    setVents((prev) =>
      prev.map((vent) => {
        if (vent.id === ventId) {
          return {
            ...vent,
            comments: [...vent.comments, { id: Date.now(), text: comment }],
          };
        }
        return vent;
      })
    );
  }, []);

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <RNStatusBar style="dark" />
      <RNScrollView>
        <RNView style={{ padding: 20 }}>
          <RNView style={{ marginBottom: 20 }}>
            <RNText
              style={{ fontSize: 24, color: "#2d3748", fontWeight: "600" }}
            >
              Venting Zone 💭
            </RNText>
            <RNText style={{ fontSize: 16, color: "#718096", marginTop: 5 }}>
              A safe space to express your feelings
            </RNText>
          </RNView>

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
              Guidelines:
            </RNText>
            <RNText style={{ color: "#718096", fontSize: 14, marginBottom: 5 }}>
              • Be respectful and supportive
            </RNText>
            <RNText style={{ color: "#718096", fontSize: 14, marginBottom: 5 }}>
              • Keep personal information private
            </RNText>
            <RNText style={{ color: "#718096", fontSize: 14 }}>
              • Report any harmful content
            </RNText>
          </RNView>

          <RNView
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <RNText style={{ fontSize: 16, marginBottom: 10 }}>
              How are you feeling?
            </RNText>
            <RNView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 15,
              }}
            >
              {emotions.map((emotion) => (
                <RNTouchableOpacity
                  key={emotion.label}
                  onPress={() => setSelectedEmotion(emotion)}
                  style={{
                    padding: 10,
                    backgroundColor:
                      selectedEmotion?.label === emotion.label
                        ? "#e9f5f9"
                        : "#f7fafc",
                    borderRadius: 10,
                    alignItems: "center",
                    width: 80,
                  }}
                >
                  <RNText style={{ fontSize: 24 }}>{emotion.emoji}</RNText>
                  <RNText style={{ fontSize: 12, marginTop: 5 }}>
                    {emotion.label}
                  </RNText>
                </RNTouchableOpacity>
              ))}
            </RNView>

            <RNTextInput
              value={ventText}
              onChangeText={setVentText}
              placeholder="Share what's on your mind..."
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

            <RNView
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <RNTouchableOpacity
                onPress={() => setIsAnonymous(!isAnonymous)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <RNView
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: "#4299e1",
                    backgroundColor: isAnonymous ? "#4299e1" : "transparent",
                    marginRight: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isAnonymous && (
                    <RNIonicons name="checkmark" size={16} color="white" />
                  )}
                </RNView>
                <RNText style={{ color: "#4a5568" }}>Post Anonymously</RNText>
              </RNTouchableOpacity>
            </RNView>

            <RNTouchableOpacity
              onPress={handleSubmitVent}
              disabled={!ventText.trim() || !selectedEmotion}
              style={{
                backgroundColor:
                  ventText.trim() && selectedEmotion ? "#4299e1" : "#a0aec0",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <RNText style={{ color: "white", fontWeight: "600" }}>
                Share
              </RNText>
            </RNTouchableOpacity>
          </RNView>

          <RNView>
            {vents.map((vent) => (
              <RNView
                key={vent.id}
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <RNView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <RNText style={{ fontSize: 24, marginRight: 10 }}>
                    {vent.emotion.emoji}
                  </RNText>
                  <RNText style={{ color: "#718096" }}>
                    {vent.isAnonymous ? "Anonymous" : "User"} •{" "}
                    {new Date(vent.timestamp).toLocaleDateString()}
                  </RNText>
                </RNView>
                <RNText
                  style={{ fontSize: 16, color: "#2d3748", marginBottom: 15 }}
                >
                  {vent.text}
                </RNText>
                <RNView
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "#e2e8f0",
                    paddingTop: 15,
                  }}
                >
                  <RNText style={{ color: "#4a5568", marginBottom: 10 }}>
                    Supportive Comments ({vent.comments.length})
                  </RNText>
                  {vent.comments.map((comment) => (
                    <RNView key={comment.id} style={{ marginBottom: 10 }}>
                      <RNText style={{ color: "#718096" }}>
                        {comment.text}
                      </RNText>
                    </RNView>
                  ))}
                </RNView>
              </RNView>
            ))}
          </RNView>
        </RNView>
      </RNScrollView>
    </RNSafeAreaView>
  );
}

export default MainComponent;