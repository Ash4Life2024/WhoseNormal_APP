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
        setPosts(data.posts.filter((post) => post.type === "asd"));
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
        <header className="text-center bg-white rounded-xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ASD Support Space
          </h1>
          <p className="text-xl text-gray-600">
            A calm and understanding environment for the autism community
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sensory Tools
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-volume-off mr-2"></i>Quiet Mode
              </button>
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-adjust mr-2"></i>Light Settings
              </button>
              <button className="w-full bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] transition-colors">
                <i className="fas fa-sliders-h mr-2"></i>Sensory Preferences
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Visual Schedule
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <i className="fas fa-sun text-yellow-400"></i>
                <span>Morning Routine</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                <i className="fas fa-book text-green-500"></i>
                <span>Daily Activities</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                <i className="fas fa-moon text-purple-400"></i>
                <span>Evening Routine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Social Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">Going to the Store</h3>
              <img
                src="/store-social-story.png"
                alt="Illustrated guide showing steps for shopping"
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <button className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
                View Story
              </button>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold mb-2">Meeting New People</h3>
              <img
                src="/meeting-social-story.png"
                alt="Illustrated guide showing steps for meeting new people"
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <button className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
                View Story
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Community Experiences
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
          {!user && (
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
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <i className="fas fa-book-reader text-2xl text-blue-500 mb-2"></i>
              <h3 className="font-bold mb-2">Learning Resources</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Visual Guides</li>
                <li>Structured Learning</li>
                <li>Educational Tools</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <i className="fas fa-users text-2xl text-green-500 mb-2"></i>
              <h3 className="font-bold mb-2">Social Skills</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Conversation Guides</li>
                <li>Body Language</li>
                <li>Social Cues</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <i className="fas fa-heart text-2xl text-purple-500 mb-2"></i>
              <h3 className="font-bold mb-2">Self-Care</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Calming Techniques</li>
                <li>Sensory Breaks</li>
                <li>Routine Building</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;