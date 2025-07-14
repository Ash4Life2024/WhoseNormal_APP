"use client";
import React from "react";

function MainComponent() {
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientsRes, sessionsRes] = await Promise.all([
          fetch("/api/clients/list", { method: "POST" }),
          fetch("/api/sessions/list", { method: "POST" }),
        ]);

        if (!clientsRes.ok || !sessionsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [clientsData, sessionsData] = await Promise.all([
          clientsRes.json(),
          sessionsRes.json(),
        ]);

        setClients(clientsData.clients || []);
        setSessions(sessionsData.sessions || []);
      } catch (err) {
        setError("Could not load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Professional Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your practice and support your clients
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#357AFF] text-white p-3 rounded-lg">
                        <i className="fas fa-calendar"></i>
                      </div>
                      <div>
                        <h3 className="font-medium">{session.clientName}</h3>
                        <p className="text-sm text-gray-500">
                          {session.date} - {session.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-[#357AFF] hover:bg-blue-50 rounded-lg">
                        <i className="fas fa-video"></i>
                      </button>
                      <button className="p-2 text-[#357AFF] hover:bg-blue-50 rounded-lg">
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Client Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{client.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          client.status === "improving"
                            ? "bg-green-100 text-green-800"
                            : client.status === "stable"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Last session: {client.lastSession}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {client.progress}% progress
                      </span>
                      <button className="text-[#357AFF] hover:underline text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-[#357AFF] text-white p-3 rounded-lg hover:bg-[#2E69DE] transition-colors">
                  <i className="fas fa-plus mr-2"></i>New Session
                </button>
                <button className="w-full bg-[#357AFF] text-white p-3 rounded-lg hover:bg-[#2E69DE] transition-colors">
                  <i className="fas fa-user-plus mr-2"></i>Add Client
                </button>
                <button className="w-full bg-[#357AFF] text-white p-3 rounded-lg hover:bg-[#2E69DE] transition-colors">
                  <i className="fas fa-notes-medical mr-2"></i>Progress Notes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Professional Resources
              </h2>
              <div className="space-y-3">
                <a
                  href="/resources/assessment"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-clipboard-list text-[#357AFF] mr-2"></i>
                  Assessment Tools
                </a>
                <a
                  href="/resources/therapy"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-brain text-[#357AFF] mr-2"></i>Therapy
                  Guides
                </a>
                <a
                  href="/resources/research"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-book text-[#357AFF] mr-2"></i>Research
                  Papers
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Analytics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Clients</span>
                  <span className="font-bold">{clients.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Weekly Sessions</span>
                  <span className="font-bold">{sessions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="font-bold">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;