"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    content: "",
    isAnonymous: false,
    type: "general",
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: filter !== "all" ? filter : undefined }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError("Could not load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      setPosts((prev) => [data.post, ...prev]);
      setNewPost({ content: "", isAnonymous: false, type: "general" });
    } catch (err) {
      setError("Could not create post");
      console.error(err);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      await fetch("/api/posts/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reactionType }),
      });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactions: [...post.reactions, { type: reactionType }],
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Reality Check
          </h1>
          <p className="text-gray-600">
            A safe space to share your experiences and support others
          </p>
        </header>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              rows="4"
            />

            <div className="flex items-center space-x-4">
              <select
                value={newPost.type}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, type: e.target.value }))
                }
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              >
                <option value="general">General</option>
                <option value="anxiety">Anxiety</option>
                <option value="depression">Depression</option>
                <option value="relationships">Relationships</option>
                <option value="school">School</option>
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPost.isAnonymous}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      isAnonymous: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-[#357AFF] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Post anonymously
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#357AFF] text-white py-3 rounded-lg font-medium hover:bg-[#2E69DE] transition-colors"
            >
              Share
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Community Posts
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
            >
              <option value="all">All Posts</option>
              <option value="anxiety">Anxiety</option>
              <option value="depression">Depression</option>
              <option value="relationships">Relationships</option>
              <option value="school">School</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {!post.isAnonymous && (
                        <img
                          src={post.author_image || "/default-avatar.png"}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="font-medium">
                        {post.isAnonymous ? "Anonymous" : post.author_name}
                      </span>
                      <span className="text-sm text-gray-500">{post.type}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{post.content}</p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReaction(post.id, "been-there")}
                      className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <i className="fas fa-heart mr-2"></i>
                      I've Been There
                    </button>
                    <button
                      onClick={() => handleReaction(post.id, "hug")}
                      className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    >
                      <i className="fas fa-hands-helping mr-2"></i>
                      Virtual Hug
                    </button>
                    <button
                      onClick={() => handleReaction(post.id, "support")}
                      className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    >
                      <i className="fas fa-star mr-2"></i>
                      Stay Strong
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;