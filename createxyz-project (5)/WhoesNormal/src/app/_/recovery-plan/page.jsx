"use client";
import React from "react";

function MainComponent() {
  const [moodData, setMoodData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [journalLocked, setJournalLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [journalStyle, setJournalStyle] = useState({
    cover:
      "https://ucarecdn.com/5b8f0ca2-2026-41ba-bcfd-9cf4004a9388/-/format/auto/",
    pages:
      "https://ucarecdn.com/704e080f-ead2-40d9-b955-ad475f19b963/-/format/auto/",
  });

  const [journalCovers, journalPages] = [
    [
      "https://ucarecdn.com/5b8f0ca2-2026-41ba-bcfd-9cf4004a9388/-/format/auto/",
      "https://ucarecdn.com/48d8dfb5-32d9-4831-996f-8a096de170f9/-/format/auto/",
      "https://ucarecdn.com/b720f6b5-39a0-467c-9085-bf6383b3ab33/-/format/auto/",
      "https://ucarecdn.com/3c0b3e96-0232-4d0a-93d9-018797e8c8ca/-/format/auto/",
      "https://ucarecdn.com/b504fef1-ed44-460b-9123-11c6188cd84c/-/format/auto/",
    ],
    [
      "https://ucarecdn.com/704e080f-ead2-40d9-b955-ad475f19b963/-/format/auto/",
      "https://ucarecdn.com/f545e020-00ba-4c9e-b37d-239bc458087f/-/format/auto/",
      "https://ucarecdn.com/fe9c73b9-bb9b-4cd5-9a40-6dc43e7e5cd3/-/format/auto/",
      "https://ucarecdn.com/2a6cf7e6-a26f-4382-80cf-a4d842c494eb/-/format/auto/",
    ],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodResponse, journalResponse, quoteResponse] =
          await Promise.all([
            fetch("/api/mood-entries/list", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }),
            fetch("/api/journals/list", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }),
            fetch("/api/daily-quotes/random", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }),
          ]);

        if (!moodResponse.ok || !journalResponse.ok || !quoteResponse.ok) {
          throw new Error("One or more API requests failed");
        }

        const [moodData, journalData, quoteData] = await Promise.all([
          moodResponse.json(),
          journalResponse.json(),
          quoteResponse.json(),
        ]);

        setMoodData(moodData.entries || []);
        setJournalEntries(journalData.journals || []);
        setDailyQuote(
          quoteData.quote || {
            quote:
              "Write it on your heart that every day is the best day in the year.",
            author: "Ralph Waldo Emerson",
          }
        );

        setError(null);
      } catch (err) {
        console.error("Data fetching error:", err);
        setError(
          err.message ||
            "Could not load your journal and mood data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const saveJournalStyle = async (cover, pages) => {
    try {
      const response = await fetch("/api/user-profiles/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journal_cover_style: cover,
          journal_page_style: pages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal style");
      }

      setJournalStyle({ cover, pages });
      setShowStylePicker(false);
    } catch (err) {
      setError("Could not save your journal style");
      console.error(err);
    }
  };

  const saveJournalEntry = async () => {
    try {
      const response = await fetch("/api/journals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: currentEntry,
          date: selectedDate,
          mood: "peaceful",
          is_private: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const updatedJournals = await fetch("/api/journals/list", {
        method: "POST",
      });
      const { journals } = await updatedJournals.json();
      setJournalEntries(journals || []);
      setCurrentEntry("");
      setShowJournalEntry(false);
    } catch (err) {
      setError("Could not save your journal entry");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {showStylePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Customize Your Journal
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-4">
                    Choose Cover Style
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {journalCovers.map((cover, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setJournalStyle((prev) => ({ ...prev, cover }))
                        }
                        className={`cursor-pointer rounded-lg overflow-hidden border-4 ${
                          journalStyle.cover === cover
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={cover}
                          alt={`Journal cover ${i + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4">
                    Choose Page Style
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {journalPages.map((page, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setJournalStyle((prev) => ({ ...prev, pages: page }))
                        }
                        className={`cursor-pointer rounded-lg overflow-hidden border-4 ${
                          journalStyle.pages === page
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={page}
                          alt={`Page style ${i + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowStylePicker(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      saveJournalStyle(journalStyle.cover, journalStyle.pages)
                    }
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save Style
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02]">
          <img
            src={journalStyle.cover}
            alt="Journal cover"
            className="w-full h-64 object-cover"
          />

          {dailyQuote && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <p className="text-2xl font-serif italic mb-4">
                  {dailyQuote.quote}
                </p>
                <p className="text-lg">― {dailyQuote.author}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowStylePicker(true)}
            className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 shadow-lg hover:bg-opacity-100"
          >
            <i className="fas fa-paint-brush text-blue-500"></i>
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-2xl backdrop-blur-lg bg-opacity-90">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
            Your Journey Calendar
          </h2>
          <div className="grid grid-cols-7 gap-3">
            {[...Array.from({ length: 31 })].map((_, i) => {
              const date = new Date(2025, 0, i + 1);
              const mood = moodData.find(
                (m) => new Date(m.created_at).getDate() === i + 1
              );
              const hasJournal = journalEntries.some(
                (j) => new Date(j.created_at).getDate() === i + 1
              );

              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowJournalEntry(true);
                  }}
                  className={`aspect-square rounded-xl p-2 cursor-pointer transform transition-all hover:scale-110 ${
                    hasJournal
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="h-full flex flex-col items-center justify-center relative group">
                    <span className="text-sm font-medium text-gray-700">
                      {i + 1}
                    </span>
                    {mood && (
                      <div className="absolute -bottom-1 w-full flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:animate-bounce"></div>
                      </div>
                    )}
                    {hasJournal && (
                      <div className="absolute -top-1 right-0">
                        <i className="fas fa-feather-alt text-xs text-blue-400"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-2xl relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowPinModal(true)}
              className="text-purple-500 hover:text-purple-600 transition-colors"
            >
              <i
                className={`fas ${journalLocked ? "fa-lock" : "fa-lock-open"}`}
              ></i>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-book-open text-purple-500 mr-2"></i>
            Your Journal
          </h2>

          {journalLocked ? (
            <div className="text-center py-12">
              <i className="fas fa-lock text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">
                Your journal is locked for privacy
              </p>
              <button
                onClick={() => setShowPinModal(true)}
                className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Unlock Journal
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4">
                {journalEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 rounded-lg p-4 transform transition-all hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-purple-600 font-medium">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-purple-400">
                        <i className="fas fa-feather-alt"></i>
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowJournalEntry(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-plus mr-2"></i>
                New Journal Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <div>{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;