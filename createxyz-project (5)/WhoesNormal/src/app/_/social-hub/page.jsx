"use client";
import React from "react";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [postsRes, storiesRes, streamsRes] = await Promise.all([
          fetch("/api/posts/list", { method: "POST" }),
          fetch("/api/stories/list", { method: "POST" }),
          fetch("/api/streams/list", { method: "POST" }),
        ]);

        if (!postsRes.ok || !storiesRes.ok || !streamsRes.ok) {
          throw new Error("Failed to fetch content");
        }

        const [postsData, storiesData, streamsData] = await Promise.all([
          postsRes.json(),
          storiesRes.json(),
          streamsRes.json(),
        ]);

        setPosts(postsData.posts || []);
        setStories(storiesData.stories || []);
        setLiveStreams(streamsData.streams || []);
      } catch (err) {
        setError("Could not load content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {!user && (
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 mb-4">
              Connect with others and share your journey
            </p>
            <a
              href="/account/signup"
              className="bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              Get Started
            </a>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full ring-2 ring-[#357AFF] p-1">
                  <img
                    src={story.author_image || "/default-avatar.png"}
                    alt={`${story.author_name}'s story`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <p className="text-xs text-center mt-1">{story.author_name}</p>
              </div>
            ))}
          </div>
        </div>

        {liveStreams.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Live Now</h2>
            <div className="grid grid-cols-1 gap-4">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="relative rounded-lg overflow-hidden"
                >
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    <i className="fas fa-circle text-xs mr-1"></i>LIVE
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
                    <p className="text-white font-bold">{stream.title}</p>
                    <p className="text-white text-sm">
                      {stream.viewer_count} watching
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.author_image || "/default-avatar.png"}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-800">{post.author_name}</p>
                  <p className="text-sm text-gray-500">{post.created_at}</p>
                </div>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg mb-4"
                />
              )}

              <p className="text-gray-800 mb-4">{post.content}</p>

              <div className="flex items-center justify-between text-gray-500">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-1">
                    <i className="fas fa-heart"></i>
                    <span>{post.likes_count}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <i className="fas fa-comment"></i>
                    <span>{post.comments_count}</span>
                  </button>
                </div>
                <button>
                  <i className="fas fa-share"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {user && (
          <div className="fixed bottom-4 right-4">
            <button className="bg-[#357AFF] text-white w-14 h-14 rounded-full shadow-lg hover:bg-[#2E69DE] transition-colors">
              <i className="fas fa-plus text-xl"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;