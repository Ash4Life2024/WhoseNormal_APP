"use client";
import React from "react";

function MainComponent() {
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, challengesRes, mentorsRes, storiesRes] =
          await Promise.all([
            fetch("/api/posts/list", { method: "POST" }),
            fetch("/api/challenges/list", { method: "POST" }),
            fetch("/api/mentors/list", { method: "POST" }),
            fetch("/api/featured-stories/list", { method: "POST" }),
          ]);

        if (
          !postsRes.ok ||
          !challengesRes.ok ||
          !mentorsRes.ok ||
          !storiesRes.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [postsData, challengesData, mentorsData, storiesData] =
          await Promise.all([
            postsRes.json(),
            challengesRes.json(),
            mentorsRes.json(),
            storiesRes.json(),
          ]);

        setPosts(postsData.posts || []);
        setChallenges(challengesData.challenges || []);
        setMentors(mentorsData.mentors || []);
        setFeaturedStories(storiesData.stories || []);
      } catch (err) {
        setError("Could not load content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Daily Vibe
          </h1>
          <p className="text-xl text-gray-600">
            Your daily dose of positivity and support
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
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
                      <h3 className="font-bold text-gray-800">
                        {post.author_name}
                      </h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.content}</p>
                  <div className="mt-4 flex items-center space-x-4">
                    <button className="text-[#357AFF] hover:text-[#2E69DE]">
                      <i className="fas fa-heart mr-2"></i>Support
                    </button>
                    <button className="text-[#357AFF] hover:text-[#2E69DE]">
                      <i className="fas fa-comment mr-2"></i>Comment
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Weekly Featured Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4"
                  >
                    <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.excerpt}</p>
                    <button className="text-[#357AFF] hover:text-[#2E69DE]">
                      Read More
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Support Score
              </h2>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-[#357AFF] flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-[#357AFF]">
                    {userScore}
                  </span>
                </div>
                <p className="text-gray-600">Keep spreading positivity!</p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Community Challenges
              </h2>
              {challenges.map((challenge) => (
                <div key={challenge.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{challenge.title}</span>
                    <span className="text-sm text-gray-500">
                      {challenge.participants} joined
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#357AFF] h-2 rounded-full"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Featured Mentors
              </h2>
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="flex items-center">
                    <img
                      src={mentor.image || "/default-avatar.png"}
                      alt={`Mentor ${mentor.name}`}
                      className="w-12 h-12 rounded-full border-4 border-[#357AFF]"
                    />
                    <div className="ml-4">
                      <h3 className="font-bold">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">
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