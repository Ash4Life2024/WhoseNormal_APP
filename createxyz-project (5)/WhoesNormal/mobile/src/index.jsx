"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: authLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDorsey, setShowDorsey] = useState(false);
  const [dorseyMessage, setDorseyMessage] = useState("");
  const [dorseyTyping, setDorseyTyping] = useState(false);
  const [slideAnimation] = useState(new RNAnimated.Value(0));
  const [fadeAnimation] = useState(new RNAnimated.Value(0));
  const router = useRouter();
  const [userStatus, setUserStatus] = useState(null);

  const moods = [
    { emoji: "🌈", label: "Amazing" },
    { emoji: "⭐", label: "Super" },
    { emoji: "🦸", label: "Hero" },
    { emoji: "🎮", label: "Playful" },
    { emoji: "🎨", label: "Creative" },
    { emoji: "🎵", label: "Musical" },
  ];

  const reactions = [
    { emoji: "❤️", label: "Love it!", animation: "bounce" },
    { emoji: "🌟", label: "Amazing!", animation: "spin" },
    { emoji: "🤗", label: "Hug", animation: "pulse" },
    { emoji: "🎉", label: "Celebrate!", animation: "pop" },
    { emoji: "👑", label: "Royal", animation: "shine" },
  ];

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/kids/posts/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: 1,
          limit: 20,
          mood: currentMood?.label,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching posts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Oops! Could not load the fun feed! Try again! 🎮");
    } finally {
      setLoading(false);
    }
  }, [currentMood, user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        "/account/signin?callbackUrl=/kids-mental-health-social-media"
      );
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const response = await fetch("/api/verify-child-access", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Access verification failed");
        }

        const data = await response.json();
        setUserStatus(data.status);

        if (data.status !== "approved") {
          router.push("/parental-consent");
        }
      } catch (error) {
        console.error("Error verifying access:", error);
        router.push("/parental-consent");
      }
    };

    verifyAccess();
  }, [router]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.spring(slideAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      RNAnimated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnimation, fadeAnimation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const getDorseyResponse = async (content) => {
    setDorseyTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context:
            "You are Dorsey, a fun and supportive AI friend who helps kids express themselves positively. Keep responses short, playful and encouraging.",
        }),
      });

      if (!response.ok) throw new Error("Failed to get Dorsey's response");
      const data = await response.json();
      setDorseyMessage(data.response || "That's awesome! Keep sharing! 🌟");
    } catch (err) {
      console.error(err);
      setDorseyMessage("Oops! I got tongue-tied! 🙈");
    } finally {
      setDorseyTyping(false);
    }
  };

  const handlePost = async () => {
    if (!user) {
      setError("Please sign in to share your thoughts!");
      return;
    }

    if (!newPost.trim()) return;

    try {
      await getDorseyResponse(newPost);
      setShowDorsey(true);

      const response = await fetch("/api/kids/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPost,
          mood: currentMood?.label,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error creating post: ${response.status} ${response.statusText}`
        );
      }

      setNewPost("");
      setCurrentMood(null);
      await fetchPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Oops! Couldn't share your magic! Try again! ✨");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    if (!user) {
      setError("Please sign in to react to posts!");
      return;
    }

    try {
      const response = await fetch("/api/kids/posts/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          reactionType,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error adding reaction: ${response.status} ${response.statusText}`
        );
      }
      await fetchPosts();
    } catch (err) {
      console.error("Failed to add reaction:", err);
      setError("Oops! Couldn't add your reaction! Try again! 🎨");
    }
  };

  const DorseyBubble = () => (
    <RNView
      style={{
        position: "absolute",
        bottom: 90,
        right: 20,
        maxWidth: "80%",
        backgroundColor: "#3b82f6",
        padding: 16,
        borderRadius: 20,
        borderBottomRightRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
      }}
    >
      <RNView
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <RNText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Dorsey 🤖
        </RNText>
        {dorseyTyping && (
          <RNView style={{ marginLeft: 8 }}>
            <RNActivityIndicator size="small" color="#fff" />
          </RNView>
        )}
      </RNView>
      <RNText style={{ color: "#fff", fontSize: 14 }}>
        {dorseyMessage || "Hey there! I'm Dorsey, your friendly AI buddy! 👋"}
      </RNText>
      <RNTouchableOpacity
        onPress={() => setShowDorsey(false)}
        style={{ position: "absolute", top: 8, right: 8 }}
      >
        <RNText style={{ color: "#fff", opacity: 0.7 }}>✕</RNText>
      </RNTouchableOpacity>
    </RNView>
  );

  if (!userStatus || userStatus !== "approved") {
    return (
      <RNSafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
        <RNStatusBar style="light" />
        <RNView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <RNActivityIndicator size="large" color="#3b82f6" />
          <RNText style={{ color: "#fff", marginTop: 12, textAlign: "center" }}>
            Checking access permissions...
          </RNText>
        </RNView>
      </RNSafeAreaView>
    );
  }

  if (authLoading || loading) {
    return (
      <RNSafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#111",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNActivityIndicator size="large" color="#3b82f6" />
        <RNText style={{ color: "#fff", marginTop: 16 }}>
          Loading your magical space... ✨
        </RNText>
      </RNSafeAreaView>
    );
  }

  if (error) {
    return (
      <RNSafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#111",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RNText style={{ color: "#fff", textAlign: "center", margin: 20 }}>
          {error}
        </RNText>
        <RNTouchableOpacity
          onPress={() => {
            setError(null);
            fetchPosts();
          }}
          style={{
            backgroundColor: "#3b82f6",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <RNText style={{ color: "#fff" }}>Try Again 🌟</RNText>
        </RNTouchableOpacity>
      </RNSafeAreaView>
    );
  }

  return (
    <RNSafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <RNStatusBar style="light" />
      <RNScrollView
        refreshControl={
          <RNRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <RNLinearGradient
          colors={["#1a1a1a", "#000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <></>
        </RNLinearGradient>
      </RNScrollView>
      {showDorsey && <DorseyBubble />}
    </RNSafeAreaView>
  );
}

export default MainComponent;