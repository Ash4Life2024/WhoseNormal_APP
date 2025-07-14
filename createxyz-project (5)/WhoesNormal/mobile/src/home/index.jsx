"use client";
import React from "react";

function MainComponent() {
  const [currentMood, setCurrentMood] = useState(null);
  const router = useRouter();

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😤", label: "Frustrated" },
  ];

  const dailyAffirmation =
    "You are exactly where you need to be right now. Your feelings are valid.";

  const supportSpaces = [
    { title: "Anxiety Support", icon: "🫂", path: "/anxiety-support" },
    { title: "Depression Talk", icon: "💭", path: "/depression-talk" },
    { title: "General Chat", icon: "💝", path: "/general-chat" },
    { title: "Crisis Help", icon: "🆘", path: "/crisis-help" },
  ];

  const safeFeedPosts = [
    {
      id: 1,
      author: "Sarah M.",
      content: "Remember, it's okay to take things one day at a time.",
    },
    {
      id: 2,
      author: "James K.",
      content: "Today I practiced self-care by taking a peaceful walk.",
    },
  ];

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <RNStatusBar style="dark" />

      <RNScrollView>
        <RNView style={{ padding: 20 }}>
          <RNView style={{ alignItems: "center", marginBottom: 30 }}>
            <RNText
              style={{ fontSize: 28, fontWeight: "bold", color: "#4A4A4A" }}
            >
              Who's Normal
            </RNText>
            <RNText style={{ fontSize: 16, color: "#666", marginTop: 5 }}>
              You're not alone in this journey
            </RNText>
          </RNView>

          <RNView
            style={{
              backgroundColor: "#FFF",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <RNText
              style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}
            >
              Daily Affirmation
            </RNText>
            <RNText
              style={{ fontSize: 16, color: "#4A4A4A", fontStyle: "italic" }}
            >
              {dailyAffirmation}
            </RNText>
          </RNView>

          <RNView
            style={{
              backgroundColor: "#FFF",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <RNText
              style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}
            >
              How are you feeling today?
            </RNText>
            <RNView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              {moods.map((mood) => (
                <RNTouchableOpacity
                  key={mood.label}
                  onPress={() => setCurrentMood(mood.label)}
                  style={{
                    padding: 10,
                    backgroundColor:
                      currentMood === mood.label ? "#E8F0FE" : "#F8F8F8",
                    borderRadius: 10,
                    margin: 5,
                    width: 80,
                    alignItems: "center",
                  }}
                >
                  <RNText style={{ fontSize: 24 }}>{mood.emoji}</RNText>
                  <RNText style={{ fontSize: 12, marginTop: 5 }}>
                    {mood.label}
                  </RNText>
                </RNTouchableOpacity>
              ))}
            </RNView>
          </RNView>

          <RNView
            style={{
              backgroundColor: "#FFF",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <RNText
              style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}
            >
              Support Spaces
            </RNText>
            <RNView style={{ gap: 10 }}>
              {supportSpaces.map((space) => (
                <RNTouchableOpacity
                  key={space.title}
                  onPress={() => router.push(space.path)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 15,
                    backgroundColor: "#F8F8F8",
                    borderRadius: 10,
                  }}
                >
                  <RNText style={{ fontSize: 20, marginRight: 10 }}>
                    {space.icon}
                  </RNText>
                  <RNText style={{ fontSize: 16 }}>{space.title}</RNText>
                </RNTouchableOpacity>
              ))}
            </RNView>
          </RNView>

          <RNView
            style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 15 }}
          >
            <RNText
              style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}
            >
              Safe Space Feed
            </RNText>
            {safeFeedPosts.map((post) => (
              <RNView
                key={post.id}
                style={{
                  padding: 15,
                  backgroundColor: "#F8F8F8",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <RNText style={{ fontWeight: "600", marginBottom: 5 }}>
                  {post.author}
                </RNText>
                <RNText style={{ color: "#4A4A4A" }}>{post.content}</RNText>
              </RNView>
            ))}
          </RNView>
        </RNView>
      </RNScrollView>
    </RNSafeAreaView>
  );
}

export default MainComponent;