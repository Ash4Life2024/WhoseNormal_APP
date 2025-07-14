"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    theme: "gaming",
    description: "",
    maxParticipants: 10,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (err) {
        setError("Could not load hangout rooms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRooms((prev) => [...prev, data.room]);
      setShowCreateModal(false);
      setNewRoom({
        name: "",
        theme: "gaming",
        description: "",
        maxParticipants: 10,
      });
    } catch (err) {
      setError("Could not create room");
      console.error(err);
    }
  };

  const joinRoom = async (roomId) => {
    if (!user) {
      window.location.href = "/account/signin?callbackUrl=/hangouts";
      return;
    }

    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        throw new Error("Failed to join room");
      }

      const room = rooms.find((r) => r.id === roomId);
      setSelectedRoom(room);
    } catch (err) {
      setError("Could not join room");
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    try {
      const response = await fetch("/api/rooms/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          message: messageInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: user.name,
          message: messageInput,
          timestamp: new Date(),
        },
      ]);
      setMessageInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Virtual Hangouts
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#357AFF] text-white px-6 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>Create Room
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Active Rooms
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => joinRoom(room.id)}
                    className="p-4 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {room.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          room.theme === "gaming"
                            ? "bg-purple-100 text-purple-800"
                            : room.theme === "music"
                            ? "bg-green-100 text-green-800"
                            : room.theme === "support"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {room.theme}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{room.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <i className="fas fa-users mr-1"></i>
                      {room.participants}/{room.maxParticipants}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-span-2">
            {selectedRoom ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedRoom.name}
                    </h2>
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <i className="fas fa-user-circle text-2xl text-gray-400"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{msg.user}</p>
                        <p className="text-gray-600">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-[#357AFF] text-white px-4 rounded-lg hover:bg-[#2E69DE] transition-colors"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">
                  Select a room to join the conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create New Room
            </h2>
            <form onSubmit={createRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={newRoom.theme}
                  onChange={(e) =>
                    setNewRoom((prev) => ({ ...prev, theme: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                >
                  <option value="gaming">Gaming</option>
                  <option value="music">Music</option>
                  <option value="support">Support</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRoom.description}
                  onChange={(e) =>
                    setNewRoom((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={newRoom.maxParticipants}
                  onChange={(e) =>
                    setNewRoom((prev) => ({
                      ...prev,
                      maxParticipants: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                  min="2"
                  max="50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;