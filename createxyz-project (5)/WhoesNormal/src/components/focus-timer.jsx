"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  initialDuration = 25, 
  onComplete = () => {},
  onBreak = () => {}
}) {
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
        onComplete();
        setIsBreak(true);
        setTimeLeft(5 * 60);
        onBreak();
      } else {
        setIsBreak(false);
        setTimeLeft(initialDuration * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, initialDuration, isBreak, onComplete, onBreak]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialDuration * 60);
    setIsBreak(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((initialDuration * 60 - timeLeft) / (initialDuration * 60)) * 100;

  return (
    <div className="w-[300px] bg-white rounded-2xl p-6 shadow-lg">
      <div className="relative h-[300px] w-[300px] -mt-6 -ml-6 flex items-center justify-center">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="120"
            className="stroke-[#eee] fill-none"
            strokeWidth="12"
          />
          <circle
            cx="150"
            cy="150"
            r="120"
            className="stroke-[#357AFF] fill-none"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-500 mt-2">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </span>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <button
            onClick={toggleTimer}
            className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
          >
            {isRunning ? (
              <i className="fas fa-pause"></i>
            ) : (
              <i className="fas fa-play"></i>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Sessions completed: {completedSessions}
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [notifications, setNotifications] = useState([]);

  const handleComplete = () => {
    setNotifications(prev => [...prev, "Focus session completed! Time for a break."]);
  };

  const handleBreak = () => {
    setNotifications(prev => [...prev, "Break time! Stretch and relax."]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Focus Timer</h2>
        
        <MainComponent 
          initialDuration={25}
          onComplete={handleComplete}
          onBreak={handleBreak}
        />

        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow text-gray-700 animate-fade-in"
            >
              {notification}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
});
}