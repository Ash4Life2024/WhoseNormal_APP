"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 3 }),
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Designed for Neurodiverse Minds: ADHD, Autism & More
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A mental health-friendly social network where everyone belongs
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              We believe everyone deserves a place to belong — especially young
              people navigating life with ADHD, autism, or simply feeling
              misunderstood.
            </p>
          </div>

          {!userLoading && !user && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/account/signup"
                className="bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
              >
                Start Your Journey
              </a>
              <a
                href="/account/signin"
                className="bg-white text-[#357AFF] border-2 border-[#357AFF] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Welcome Back
              </a>
            </div>
          )}
        </header>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-sparkles text-yellow-400 mr-2"></i>
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Connect with people who "get it"</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Share your story and support others</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Build healthy habits and track your moods</span>
              </li>
            </ul>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Stay motivated with fun challenges and rewards</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Always feel safe with strong community protections</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-users text-green-400 mr-2"></i>
            Who This Space Is For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧒</span>
                <span>
                  Kids (with parent approval) who want a safe, friendly social
                  world
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧑‍🎓</span>
                <span>
                  Teens looking for real connection — no pressure, no judgment
                </span>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧠</span>
                <span>
                  Anyone on the ADHD or Autism Spectrum looking for
                  understanding
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💬</span>
                <span>
                  People who want to give and receive support, share advice, or
                  just hang out
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-fire text-orange-400 mr-2"></i>
            Cool Features You'll Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center">
                <span className="text-xl mr-3">📸</span>
                <span>Share posts & photos</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">💬</span>
                <span>Join virtual hangouts</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">💡</span>
                <span>Track your mood</span>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center">
                <span className="text-xl mr-3">⏲️</span>
                <span>Focus timer tools</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">🏅</span>
                <span>Earn points & badges</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">🎯</span>
                <span>Weekly challenges</span>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center">
                <span className="text-xl mr-3">💖</span>
                <span>Safe venting spaces</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">📚</span>
                <span>ADHD & ASD resources</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">💬</span>
                <span>Private messaging</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-shield-alt text-purple-400 mr-2"></i>
            Safety Comes First
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔐</span>
                <span>Parental Approval required for younger users</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧹</span>
                <span>
                  Content Moderation to keep the community kind and safe
                </span>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔒</span>
                <span>Private Spaces to share feelings when you need to</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📜</span>
                <span>Community Guidelines designed to protect and uplift</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-heart text-red-400 mr-2"></i>
            Our Mission
          </h2>
          <p className="text-gray-700 mb-6">
            To create a global mental health-friendly social space where anyone
            — especially neurodivergent users and those facing mental health
            struggles — can thrive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✔️</span>
                <span>Share thoughts without fear of stigma</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✔️</span>
                <span>Find real friends who understand</span>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✔️</span>
                <span>Access support tools and resources</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✔️</span>
                <span>Build positive daily habits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
            Why It's Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🌱</span>
                <span>Mental health first, social second</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧸</span>
                <span>Safety built in, not as an afterthought</span>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">👏</span>
                <span>Community driven, not algorithm-driven</span>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💬</span>
                <span>Empathy over entertainment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            You're Not Alone
          </h2>
          <p className="text-gray-700 mb-6">
            No matter where you are or how you feel today, there's a whole
            community waiting to walk beside you. Come as you are — grow at your
            pace.
          </p>
          {!userLoading && !user && (
            <a
              href="/account/signup"
              className="inline-block bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              Join Our Community Today
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;