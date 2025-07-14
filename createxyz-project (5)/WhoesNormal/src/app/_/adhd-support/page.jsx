"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 5 }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts.filter((post) => post.type === "adhd"));
      } catch (err) {
        setError("Could not load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ADHD Support Space
          </h1>
          <p className="text-xl text-gray-600">
            A safe place to share, learn, and grow together
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Quick Resources
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-brain mr-2"></i>Focus Timer
              </button>
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-tasks mr-2"></i>Task Breakdown Tool
              </button>
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-calendar mr-2"></i>Daily Planner
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Today's Focus
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span>Break tasks into smaller steps</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span>Use timers for focused work</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span>Take regular movement breaks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Community Posts
          </h2>
          {loading && <div className="text-center">Loading posts...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={post.author_image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{post.author_name}</span>
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
          {user && (
            <a
              href="/account/signin"
              className="block mt-4 text-center text-[#357AFF] hover:text-[#2E69DE]"
            >
              Sign in to share your experience
            </a>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tips & Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">Time Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use the 2-minute rule</li>
                <li>Set timers for tasks</li>
                <li>Break work into chunks</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold mb-2">Organization</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Create designated spaces</li>
                <li>Use color coding</li>
                <li>Digital calendar reminders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;