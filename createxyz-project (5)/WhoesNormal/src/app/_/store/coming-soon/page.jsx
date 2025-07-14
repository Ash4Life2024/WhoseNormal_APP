"use client";
import React from "react";

function MainComponent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/store/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setEmail("");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F4F1] to-white">
      {/* Coming Soon Banner */}
      <div className="bg-[#4FB3CF] text-white py-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://ucarecdn.com/726faaf8-ad75-4cc0-868d-80b0ee63063a/-/format/auto/')] opacity-10 bg-repeat"></div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wider relative z-10 animate-banner">
          COMING SOON
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="text-center py-12 px-6 bg-gradient-to-r from-teal-50 to-[#E6F4F1]">
            <h2 className="text-4xl md:text-5xl font-bold text-teal-800 mb-4">
              Who's Normal Store
            </h2>
            <p className="text-xl text-teal-600 max-w-2xl mx-auto">
              A thoughtfully curated boutique featuring inclusive designs and
              neurodivergent-friendly products
            </p>
          </div>

          {/* Store Preview Section */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image Column */}
              <div className="relative group">
                <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="https://ucarecdn.com/e7471148-64d4-49f4-b6c8-53e82370e804/-/format/auto/"
                    alt="Preview of Who's Normal Store"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 rounded-xl">
                  <p className="text-white text-lg font-semibold">
                    Opening Fall 2025
                  </p>
                </div>
              </div>

              {/* Features Column */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-400">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">
                      <i className="fas fa-heart mr-2 text-teal-600"></i>
                      Sensory-Friendly Shopping
                    </h3>
                    <p className="text-teal-600">
                      Carefully designed space with your comfort in mind
                    </p>
                  </div>

                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-400">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">
                      <i className="fas fa-paint-brush mr-2 text-teal-600"></i>
                      Neurodivergent Artisans
                    </h3>
                    <p className="text-teal-600">
                      Supporting and showcasing talented creators
                    </p>
                  </div>

                  <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-400">
                    <h3 className="font-bold text-teal-800 text-lg mb-2">
                      <i className="fas fa-gift mr-2 text-teal-600"></i>
                      Inclusive Products
                    </h3>
                    <p className="text-teal-600">
                      Thoughtfully selected items for everyone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup Section */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="bg-gradient-to-r from-teal-50 to-[#E6F4F1] rounded-xl p-8">
                <h3 className="text-2xl font-bold text-teal-800 mb-6 text-center">
                  Be the First to Know
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-6 py-4 rounded-lg border-2 border-teal-200 focus:ring-2 focus:ring-teal-400 focus:border-transparent pr-12"
                    />
                    <i className="fas fa-envelope absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-400"></i>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-semibold text-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Subscribing...
                      </span>
                    ) : (
                      "Join the Waiting List"
                    )}
                  </button>

                  {status === "success" && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                      <i className="fas fa-check-circle mr-2"></i>
                      Thanks for joining our waiting list! We'll keep you
                      updated.
                    </div>
                  )}

                  {status === "error" && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      Oops! Something went wrong. Please try again.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes banner3D {
          0%, 100% {
            transform: perspective(500px) rotateX(0deg);
            text-shadow: 0 1px 0 #ccc,
                        0 2px 0 #c9c9c9,
                        0 3px 0 #bbb,
                        0 4px 0 #b9b9b9,
                        0 5px 0 #aaa,
                        0 6px 1px rgba(0,0,0,.1),
                        0 0 5px rgba(0,0,0,.1),
                        0 1px 3px rgba(0,0,0,.3),
                        0 3px 5px rgba(0,0,0,.2),
                        0 5px 10px rgba(0,0,0,.25);
          }
          50% {
            transform: perspective(500px) rotateX(20deg);
            text-shadow: 0 1px 0 #ccc,
                        0 2px 0 #c9c9c9,
                        0 3px 0 #bbb,
                        0 4px 0 #b9b9b9,
                        0 5px 0 #aaa,
                        0 6px 1px rgba(0,0,0,.1),
                        0 0 5px rgba(0,0,0,.1),
                        0 1px 3px rgba(0,0,0,.3),
                        0 3px 5px rgba(0,0,0,.2),
                        0 5px 10px rgba(0,0,0,.25),
                        0 10px 10px rgba(0,0,0,.2),
                        0 20px 20px rgba(0,0,0,.15);
          }
        }

        .animate-banner {
          animation: banner3D 2s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .bg-teal-50 {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .bg-teal-50:nth-child(2) {
          animation-delay: 0.2s;
        }

        .bg-teal-50:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;