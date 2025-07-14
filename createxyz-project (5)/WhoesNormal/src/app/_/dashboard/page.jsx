"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [mood, setMood] = useState("");
  const [activities, setActivities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [friendUpdates, setFriendUpdates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [travelPlans, setTravelPlans] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    tripsSaved: 0,
    tripPoints: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [activitiesRes, challengesRes, friendsRes, eventsRes, travelRes] =
          await Promise.all([
            fetch("/api/activities/list", { method: "POST" }),
            fetch("/api/challenges/list", { method: "POST" }),
            fetch("/api/friends/updates", { method: "POST" }),
            fetch("/api/events/list", { method: "POST" }),
            fetch("/api/trip-plans/list", { method: "POST" }),
          ]);

        if (
          !activitiesRes.ok ||
          !challengesRes.ok ||
          !friendsRes.ok ||
          !eventsRes.ok ||
          !travelRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [
          activitiesData,
          challengesData,
          friendsData,
          eventsData,
          travelData,
        ] = await Promise.all([
          activitiesRes.json(),
          challengesRes.json(),
          friendsRes.json(),
          eventsRes.json(),
          travelRes.json(),
        ]);

        setActivities(activitiesData.activities || []);
        setChallenges(challengesData.challenges || []);
        setFriendUpdates(friendsData.updates || []);
        setEvents(eventsData.events || []);
        setTravelPlans(travelData.trips || []);
        setStats({
          totalTrips: travelData.stats?.totalTrips || 0,
          upcomingTrips: travelData.stats?.upcomingTrips || 0,
          tripsSaved: travelData.stats?.tripsSaved || 0,
          tripPoints: travelData.stats?.tripPoints || 0,
        });
      } catch (err) {
        setError("Could not load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const submitMood = async (selectedMood) => {
    try {
      const response = await fetch("/api/mood/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit mood");
      }

      setMood(selectedMood);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Track your journey and connect with others
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <a
                href="/daily-vibe"
                className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE]"
              >
                <i className="fas fa-smile-beam mr-2"></i>Daily Vibe
              </a>
              <a
                href="/travel-planner"
                className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE]"
              >
                <i className="fas fa-plane mr-2"></i>Plan Trip
              </a>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Total Trips</h3>
              <i className="fas fa-suitcase text-[#357AFF] text-xl"></i>
            </div>
            <p className="text-3xl font-bold text-[#357AFF]">
              {stats.totalTrips}
            </p>
            <p className="text-sm text-gray-500 mt-2">Lifetime adventures</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Upcoming</h3>
              <i className="fas fa-calendar text-[#357AFF] text-xl"></i>
            </div>
            <p className="text-3xl font-bold text-[#357AFF]">
              {stats.upcomingTrips}
            </p>
            <p className="text-sm text-gray-500 mt-2">Planned trips</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Saved Places</h3>
              <i className="fas fa-bookmark text-[#357AFF] text-xl"></i>
            </div>
            <p className="text-3xl font-bold text-[#357AFF]">
              {stats.tripsSaved}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Bookmarked destinations
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Trip Points</h3>
              <i className="fas fa-star text-[#357AFF] text-xl"></i>
            </div>
            <p className="text-3xl font-bold text-[#357AFF]">
              {stats.tripPoints}
            </p>
            <p className="text-sm text-gray-500 mt-2">Reward points earned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Upcoming Trips
            </h2>
            <div className="space-y-4">
              {travelPlans.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#357AFF] rounded-lg flex items-center justify-center">
                      <i className="fas fa-plane-departure text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-gray-500">{trip.dates}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-[#357AFF] hover:text-[#2E69DE]">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-[#357AFF] hover:text-[#2E69DE]">
                      <i className="fas fa-share-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Friend Activity
            </h2>
            <div className="space-y-4">
              {friendUpdates.map((update) => (
                <div key={update.id} className="flex items-start space-x-3">
                  <img
                    src={update.userImage || "/default-avatar.png"}
                    alt={update.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-gray-800">
                      <span className="font-medium">{update.userName}</span>{" "}
                      {update.action}
                    </p>
                    <p className="text-sm text-gray-500">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Daily Challenges
            </h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`fas ${challenge.icon} text-[#357AFF]`}></i>
                    <span className="font-medium">{challenge.name}</span>
                  </div>
                  <span className="text-sm bg-[#357AFF] text-white px-3 py-1 rounded-full">
                    {challenge.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#357AFF] rounded-lg flex items-center justify-center">
                      <i className={`fas ${event.icon} text-white`}></i>
                    </div>
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                  <button className="text-[#357AFF] hover:text-[#2E69DE]">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;