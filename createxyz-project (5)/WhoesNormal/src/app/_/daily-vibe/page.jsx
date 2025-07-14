"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [streamingMessage, setStreamingMessage] = useState("");
  const { data: user } = useUser();

  const handleFinish = useCallback((message) => {
    setStreamingMessage("");
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateDailyContent = async () => {
    try {
      setLoading(true);

      const postsResponse = await fetch(
        "/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content:
                  "Generate 5 uplifting and positive social media posts about mental health awareness and personal growth. Include author names and timestamps. Format as JSON array with fields: author_name, content, timestamp, author_image (leave as null).",
              },
            ],
            json_schema: {
              name: "positive_posts",
              schema: {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        author_name: { type: "string" },
                        content: { type: "string" },
                        timestamp: { type: "string" },
                        author_image: { type: ["string", "null"] },
                        id: { type: "string" },
                      },
                      required: [
                        "author_name",
                        "content",
                        "timestamp",
                        "author_image",
                        "id",
                      ],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["posts"],
                additionalProperties: false,
              },
            },
          }),
        }
      );

      if (!postsResponse.ok) {
        throw new Error("Failed to generate posts");
      }

      const postsData = await postsResponse.json();
      setPosts(postsData?.result?.posts || []);

      const storiesResponse = await fetch(
        "/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content:
                  "Generate 4 brief, uplifting stories about people overcoming mental health challenges. Format as JSON array with fields: title, excerpt.",
              },
            ],
            json_schema: {
              name: "featured_stories",
              schema: {
                type: "object",
                properties: {
                  stories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        excerpt: { type: "string" },
                        id: { type: "string" },
                      },
                      required: ["title", "excerpt", "id"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["stories"],
                additionalProperties: false,
              },
            },
          }),
        }
      );

      if (!storiesResponse.ok) {
        throw new Error("Failed to generate stories");
      }

      const storiesData = await storiesResponse.json();
      setFeaturedStories(storiesData?.result?.stories || []);

      setMentors([
        {
          id: "1",
          name: "Dr. Temple Grandin",
          specialty: "Autism Advocate & Professor",
          image: "/default-avatar.png",
        },
        {
          id: "2",
          name: "Simone Biles",
          specialty: "Mental Health & Sports Psychology",
          image: "/default-avatar.png",
        },
        {
          id: "3",
          name: "Michael Phelps",
          specialty: "Depression & Anxiety Support",
          image: "/default-avatar.png",
        },
      ]);

      const challengesResponse = await fetch(
        "/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content:
                  "Generate 4 mental health community challenges with progress metrics. Format as JSON array with fields: title, participants (number), progress (percentage).",
              },
            ],
            json_schema: {
              name: "community_challenges",
              schema: {
                type: "object",
                properties: {
                  challenges: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        participants: { type: "number" },
                        progress: { type: "number" },
                        id: { type: "string" },
                      },
                      required: ["title", "participants", "progress", "id"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["challenges"],
                additionalProperties: false,
              },
            },
          }),
        }
      );

      if (!challengesResponse.ok) {
        throw new Error("Failed to generate challenges");
      }

      const challengesData = await challengesResponse.json();
      setChallenges(challengesData?.result?.challenges || []);
    } catch (err) {
      setError("Could not load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateDailyContent();
  }, []);

  const calculateSupportScore = useCallback(() => {
    const baseScore = 100;
    const hourMultiplier = new Date().getHours();
    setUserScore(baseScore + hourMultiplier * 5);
  }, []);

  useEffect(() => {
    calculateSupportScore();
    const scoreInterval = setInterval(calculateSupportScore, 300000);
    return () => clearInterval(scoreInterval);
  }, [calculateSupportScore]);

  const handlePostInteraction = async (postId, type) => {
    try {
      const response = await fetch("/api/posts/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, type, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to interact with post");
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              [type === "support" ? "supports" : "comments"]:
                (post[type === "support" ? "supports" : "comments"] || 0) + 1,
            };
          }
          return post;
        })
      );

      calculateSupportScore();
    } catch (err) {
      console.error("Error interacting with post:", err);
      setError("Failed to interact with post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#357AFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 font-playfair">
            Daily Vibe
          </h1>
          <p className="text-xl text-gray-600 font-crimson-text">
            Your daily dose of positivity and support
          </p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md inline-block">
            <p className="text-lg font-crimson-text">
              {currentDateTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
                Today's Positivity Feed
              </h2>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-100 pb-6 mb-6 last:border-0"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={post.author_image || "/default-avatar.png"}
                      alt={`${post.author_name}'s profile`}
                      className="w-12 h-12 rounded-full border-4 border-[#357AFF]"
                    />
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-800 font-playfair">
                        {post.author_name}
                      </h3>
                      <p className="text-sm text-gray-500 font-crimson-text">
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-crimson-text">
                    {post.content}
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => handlePostInteraction(post.id, "support")}
                      className="text-[#357AFF] hover:text-[#2E69DE] transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-heart mr-2"></i>
                      <span className="font-crimson-text">
                        Support ({post.supports || 0})
                      </span>
                    </button>
                    <button
                      onClick={() => handlePostInteraction(post.id, "comment")}
                      className="text-[#357AFF] hover:text-[#2E69DE] transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-comment mr-2"></i>
                      <span className="font-crimson-text">
                        Comment ({post.comments || 0})
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
                Weekly Featured Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 transform hover:scale-105 transition-transform duration-200"
                  >
                    <h3 className="font-bold text-lg mb-2 font-playfair">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4 font-crimson-text">
                      {story.excerpt}
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = `/story/${story.id}`)
                      }
                      className="text-[#357AFF] hover:text-[#2E69DE] transition-colors duration-200 font-crimson-text"
                    >
                      Read More
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
                Your Support Score
              </h2>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-[#357AFF] flex items-center justify-center mb-4 support-score">
                  <span className="text-4xl font-bold text-[#357AFF] font-playfair">
                    {userScore}
                  </span>
                </div>
                <p className="text-gray-600 font-crimson-text">
                  Keep spreading positivity!
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-crimson-text">
                    Score increases with your positive interactions!
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
                Community Challenges
              </h2>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium font-crimson-text">
                      {challenge.title}
                    </span>
                    <span className="text-sm text-gray-500 font-crimson-text">
                      {challenge.participants} joined
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#357AFF] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => (window.location.href = "/challenges")}
                className="mt-4 w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors duration-200 font-crimson-text"
              >
                Join a Challenge
              </button>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
                Featured Mentors
              </h2>
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex items-center transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/mentor/${mentor.id}`)
                    }
                  >
                    <img
                      src={mentor.image}
                      alt={`Mentor ${mentor.name}`}
                      className="w-12 h-12 rounded-full border-4 border-[#357AFF]"
                    />
                    <div className="ml-4">
                      <h3 className="font-bold font-playfair">{mentor.name}</h3>
                      <p className="text-sm text-gray-500 font-crimson-text">
                        {mentor.specialty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .support-score {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;