"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEffect, setFilterEffect] = useState("none");
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch("/api/streams/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch streams");
        }

        const data = await response.json();
        setStreams(data.streams);
      } catch (err) {
        setError("Could not load streams");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const startStream = async () => {
    if (!user) {
      window.location.href = "/account/signin?callbackUrl=/live";
      return;
    }

    try {
      const response = await fetch("/api/streams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to start stream");
      }

      const data = await response.json();
      setSelectedStream(data.stream);
    } catch (err) {
      setError("Could not start stream");
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedStream) return;

    try {
      const response = await fetch("/api/streams/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamId: selectedStream.id,
          message: messageInput,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setChatMessages((prev) => [
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

  const sendReaction = (type) => {
    setReactions((prev) => [
      ...prev,
      {
        type,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Live Streams</h1>
            <button
              onClick={startStream}
              className="bg-[#357AFF] text-white px-6 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-video mr-2"></i>Start Streaming
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
          <div className="col-span-2">
            {selectedStream ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  <video
                    className="w-full h-full object-cover"
                    style={{
                      filter: filterEffect !== "none" ? filterEffect : "none",
                    }}
                  >
                    <source src={selectedStream.url} type="video/mp4" />
                  </video>
                  <div className="absolute bottom-4 right-4 space-x-2">
                    {[
                      "grayscale",
                      "sepia",
                      "blur(2px)",
                      "brightness(1.2)",
                      "none",
                    ].map((effect) => (
                      <button
                        key={effect}
                        onClick={() => setFilterEffect(effect)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filterEffect === effect
                            ? "bg-[#357AFF] text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {effect === "none" ? "Normal" : effect}
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {reactions.slice(-5).map((reaction, i) => (
                      <div key={reaction.timestamp} className="animate-float">
                        {reaction.type}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedStream.title}
                  </h2>
                  <p className="text-gray-600">{selectedStream.description}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <i className="fas fa-video text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">Select a stream to watch</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Live Chat</h2>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
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
              <div className="mt-4 flex justify-center space-x-4">
                {["❤️", "👍", "😊", "🎉"].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => sendReaction(reaction)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Active Streams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
              </div>
            ) : (
              streams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-800">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stream.viewerCount} watching
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .animate-float {
          animation: float 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;