"use client";
import React from "react";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😄", label: "Excited" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😕", label: "Confused" },
  ];

  const reactions = ["👍", "❤️", "🌟", "🎮", "🦸‍♂️"];

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 20 }),
      });

      if (!response.ok) {
        throw new Error("Could not get posts");
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
      setError("Could not load the fun feed!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPost,
          type: "kids",
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create post");
      }

      setNewPost("");
      fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Oops! Could not share your post. Try again!");
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      await fetch("/api/posts/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          type: "like",
          action: "add",
        }),
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <RNSafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <RNView
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNText
            style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}
          >
            Please ask a parent to help you sign in! 👋
          </RNText>
          <RNTouchableOpacity
            onPress={() => router.push("/account/signin")}
            style={{
              backgroundColor: "#4299e1",
              padding: 15,
              borderRadius: 10,
              width: 200,
              alignItems: "center",
            }}
          >
            <RNText style={{ color: "white", fontWeight: "600" }}>
              Sign In
            </RNText>
          </RNTouchableOpacity>
        </RNView>
      </RNSafeAreaView>
    );
  }

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <RNStatusBar style="dark" />
      <RNScrollView>
        <RNView style={{ padding: 20 }}>
          <RNView style={{ marginBottom: 20 }}>
            <RNText
              style={{ fontSize: 24, fontWeight: "600", color: "#2d3748" }}
            >
              Kids Fun Feed! 🎈
            </RNText>
          </RNView>

          <RNView style={{ marginBottom: 20 }}>
            <RNText style={{ fontSize: 16, marginBottom: 10 }}>
              How are you feeling today?
            </RNText>
            <RNView style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {moods.map((mood) => (
                <RNTouchableOpacity
                  key={mood.label}
                  onPress={() => setCurrentMood(mood)}
                  style={{
                    padding: 10,
                    backgroundColor:
                      currentMood?.label === mood.label ? "#e9f5f9" : "#f7fafc",
                    borderRadius: 10,
                    alignItems: "center",
                    width: 80,
                  }}
                >
                  <RNText style={{ fontSize: 24 }}>{mood.emoji}</RNText>
                  <RNText style={{ fontSize: 12 }}>{mood.label}</RNText>
                </RNTouchableOpacity>
              ))}
            </RNView>
          </RNView>

          <RNView
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
              marginBottom: 20,
            }}
          >
            <RNTextInput
              value={newPost}
              onChangeText={setNewPost}
              placeholder="Share something fun..."
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
              onPress={handlePost}
              disabled={!newPost.trim()}
              style={{
                backgroundColor: newPost.trim() ? "#4299e1" : "#a0aec0",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <RNText style={{ color: "white", fontWeight: "600" }}>
                Share with Friends! 🚀
              </RNText>
            </RNTouchableOpacity>
          </RNView>

          {error && (
            <RNView
              style={{
                padding: 10,
                backgroundColor: "#fed7d7",
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <RNText style={{ color: "#c53030" }}>{error}</RNText>
            </RNView>
          )}

          {loading ? (
            <RNActivityIndicator color="#4299e1" />
          ) : (
            <RNView style={{ gap: 15 }}>
              {posts.map((post) => (
                <RNView
                  key={post.id}
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 15,
                  }}
                >
                  <RNView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <RNText style={{ fontSize: 16, fontWeight: "500" }}>
                      {post.author_name || "Friend"}
                    </RNText>
                  </RNView>
                  <RNText style={{ fontSize: 16, marginBottom: 15 }}>
                    {post.content}
                  </RNText>
                  <RNView style={{ flexDirection: "row", gap: 10 }}>
                    {reactions.map((reaction) => (
                      <RNTouchableOpacity
                        key={reaction}
                        onPress={() => handleReaction(post.id, reaction)}
                        style={{
                          padding: 8,
                          backgroundColor: "#f7fafc",
                          borderRadius: 20,
                        }}
                      >
                        <RNText style={{ fontSize: 20 }}>{reaction}</RNText>
                      </RNTouchableOpacity>
                    ))}
                  </RNView>
                </RNView>
              ))}
            </RNView>
          )}
        </RNView>
      </RNScrollView>
    </RNSafeAreaView>
  );
}

export default MainComponent;