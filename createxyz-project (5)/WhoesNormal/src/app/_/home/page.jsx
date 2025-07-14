"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activities, setActivities] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const [activitiesRes, workshopsRes] = await Promise.all([
          fetch("/api/list-journals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, limit: 5 }),
          }),
          fetch("/api/list-workshops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ limit: 3 }),
          }),
        ]);

        if (!activitiesRes.ok || !workshopsRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const [activitiesData, workshopsData] = await Promise.all([
          activitiesRes.json(),
          workshopsRes.json(),
        ]);

        setActivities(activitiesData.journals || []);
        setWorkshops(workshopsData.workshops || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Could not load your personalized content");
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#357AFF]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your dashboard
          </p>
          <a
            href="/account/signin"
            className="bg-[#357AFF] text-white px-6 py-3 rounded-lg hover:bg-[#2E69DE]"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={user.image || "/default-avatar.png"}
              alt="Profile picture"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user.name}
              </h1>
              <p className="text-gray-600">Let's continue your journey</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <a
                href="/focus-timer"
                className="block bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] text-center"
              >
                <i className="fas fa-clock mr-2"></i>Start Focus Timer
              </a>
              <a
                href="/daily-vibe"
                className="block bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] text-center"
              >
                <i className="fas fa-sun mr-2"></i>Daily Vibe Check
              </a>
              <a
                href="/support-groups"
                className="block bg-[#357AFF] text-white py-2 px-4 rounded-lg hover:bg-[#2E69DE] text-center"
              >
                <i className="fas fa-users mr-2"></i>Join Support Group
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upcoming Workshops
            </h2>
            {workshops.map((workshop, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className="font-medium text-gray-800">{workshop.title}</h3>
                <p className="text-sm text-gray-600">{workshop.date}</p>
                <a
                  href={`/workshop/${workshop.id}`}
                  className="text-[#357AFF] text-sm hover:underline"
                >
                  Learn more
                </a>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Goals</span>
                  <span>4/7 completed</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-[#357AFF] rounded-full w-[57%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Focus Time</span>
                  <span>2.5 hrs this week</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-[#357AFF] rounded-full w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <i
                    className={`fas fa-${
                      activity.type === "journal" ? "book" : "star"
                    } text-[#357AFF]`}
                  ></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;