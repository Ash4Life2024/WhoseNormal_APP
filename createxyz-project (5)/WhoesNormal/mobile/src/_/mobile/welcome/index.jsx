"use client";
import React from "react";

function MainComponent() {
  const [positiveCount, setPositiveCount] = useState(1234);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: user, loading: userLoading } = useUser();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 5 }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleShare = useCallback(async () => {
    if (!user) {
      router.push("/account/signin");
      return;
    }

    if (message.trim()) {
      try {
        const response = await fetch("/api/posts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message }),
        });

        if (!response.ok) {
          throw new Error("Failed to create post");
        }

        setMessage("");
        fetchPosts();
        setPositiveCount((prev) => prev + 1);
      } catch (err) {
        console.error(err);
        setError("Failed to share your message");
      }
    }
  }, [message, user, router, fetchPosts]);

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <RNStatusBar style="dark" />
      <RNScrollView>
        <RNView style={{ padding: 20 }}>
          <RNView style={{ alignItems: "center", marginBottom: 30 }}>
            <RNText
              style={{ fontSize: 28, color: "#2d3748", fontWeight: "600" }}
            >
              Together We Grow Stronger 🌱
            </RNText>
            <RNText
              style={{
                fontSize: 16,
                color: "#718096",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              A safe space for sharing, supporting and healing
            </RNText>

            {!userLoading && !user && (
              <RNView style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
                <RNTouchableOpacity
                  onPress={() => router.push("/account/signin")}
                  style={{
                    backgroundColor: "#4299e1",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                  }}
                >
                  <RNText style={{ color: "white", fontWeight: "600" }}>
                    Sign In
                  </RNText>
                </RNTouchableOpacity>
                <RNTouchableOpacity
                  onPress={() => router.push("/account/signup")}
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#4299e1",
                  }}
                >
                  <RNText style={{ color: "#4299e1", fontWeight: "600" }}>
                    Sign Up
                  </RNText>
                </RNTouchableOpacity>
              </RNView>
            )}

            {!userLoading && user && (
              <RNView style={{ marginTop: 15 }}>
                <RNText style={{ color: "#4299e1", fontSize: 16 }}>
                  Welcome back{user.name ? `, ${user.name}` : ""}! 👋
                </RNText>
              </RNView>
            )}
          </RNView>

          <RNView
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              marginBottom: 20,
            }}
          >
            <RNText
              style={{ fontSize: 18, color: "#2d3748", marginBottom: 15 }}
            >
              Share Your Positivity ✨
            </RNText>
            <RNTextInput
              value={message}
              onChangeText={setMessage}
              placeholder={
                user
                  ? "Share something positive..."
                  : "Sign in to share your thoughts..."
              }
              multiline
              editable={!!user}
              style={{
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 10,
                padding: 15,
                minHeight: 100,
                marginBottom: 15,
                opacity: user ? 1 : 0.7,
              }}
            />
            <RNTouchableOpacity
              onPress={handleShare}
              disabled={!message.trim() || !user}
              style={{
                backgroundColor: "#4299e1",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                opacity: message.trim() && user ? 1 : 0.7,
              }}
            >
              <RNText style={{ color: "white", fontWeight: "600" }}>
                {user ? "Share" : "Sign In to Share"}
              </RNText>
            </RNTouchableOpacity>
          </RNView>

          {loading ? (
            <RNActivityIndicator color="#4299e1" />
          ) : error ? (
            <RNText style={{ color: "red", textAlign: "center" }}>
              {error}
            </RNText>
          ) : (
            <RNView style={{ gap: 15 }}>
              {posts.map((post) => (
                <RNView
                  key={post.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 15,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <RNView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    {post.author_image ? (
                      <RNImage
                        source={{ uri: post.author_image }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <RNView
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "#e2e8f0",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                      >
                        <RNText style={{ fontSize: 20 }}>
                          {post.author_name
                            ? post.author_name[0].toUpperCase()
                            : "?"}
                        </RNText>
                      </RNView>
                    )}
                    <RNView>
                      <RNText style={{ fontWeight: "600" }}>
                        {post.author_name || "Anonymous"}
                      </RNText>
                      <RNText style={{ fontSize: 12, color: "#718096" }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </RNText>
                    </RNView>
                  </RNView>
                  <RNText
                    style={{ fontSize: 16, color: "#2d3748", marginBottom: 15 }}
                  >
                    {post.content}
                  </RNText>
                </RNView>
              ))}
            </RNView>
          )}

          <RNView
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f7fafc",
              padding: 20,
              borderRadius: 15,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <RNText style={{ fontSize: 16, color: "#4a5568" }}>
              Positive Interactions:
            </RNText>
            <RNText
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#4299e1",
                marginLeft: 10,
              }}
            >
              {positiveCount.toLocaleString()}
            </RNText>
          </RNView>
        </RNView>
      </RNScrollView>
    </RNSafeAreaView>
  );
}

export default MainComponent;