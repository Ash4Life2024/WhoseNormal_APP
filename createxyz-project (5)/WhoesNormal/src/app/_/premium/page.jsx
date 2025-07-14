"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  const plans = [
    {
      id: "basic",
      name: "Basic Premium",
      price: "4.99",
      period: "month",
      features: [
        "Ad-free experience",
        "Basic resource library",
        "100 coins monthly",
        "Priority support",
      ],
      color: "#357AFF",
    },
    {
      id: "pro",
      name: "Pro Premium",
      price: "9.99",
      period: "month",
      features: [
        "All Basic features",
        "Extended resource library",
        "300 coins monthly",
        "24/7 priority support",
        "Exclusive events access",
      ],
      color: "#7C3AFF",
      popular: true,
    },
    {
      id: "family",
      name: "Family Premium",
      price: "14.99",
      period: "month",
      features: [
        "Up to 4 child accounts",
        "All Pro features",
        "500 coins monthly",
        "Family dashboard",
        "Parental controls",
      ],
      color: "#FF3A8C",
    },
  ];

  const coinPackages = [
    { id: "coins_100", amount: 100, price: "0.99", bonus: 0 },
    { id: "coins_500", amount: 500, price: "4.99", bonus: 50 },
    { id: "coins_1000", amount: 1000, price: "9.99", bonus: 150 },
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      window.location.href = "/account/signin?callbackUrl=/premium";
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscription/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process subscription");
      }

      setCurrentPlan(planId);
    } catch (err) {
      setError("Could not process subscription. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const purchaseCoins = async (packageId) => {
    if (!user) {
      window.location.href = "/account/signin?callbackUrl=/premium";
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/coins/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to purchase coins");
      }
    } catch (err) {
      setError("Could not process coin purchase. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Premium Features
          </h1>
          <p className="text-xl text-gray-600">
            Unlock exclusive benefits and enhance your experience
          </p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl p-6 shadow-lg ${
                plan.popular ? "ring-2 ring-[#357AFF]" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-[#357AFF] text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h2>
              <div
                className="text-3xl font-bold mb-4"
                style={{ color: plan.color }}
              >
                ${plan.price}
                <span className="text-sm text-gray-500">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || currentPlan === plan.id}
                className={`w-full py-3 rounded-lg transition-colors ${
                  currentPlan === plan.id
                    ? "bg-green-100 text-green-800"
                    : `bg-[${plan.color}] text-white hover:opacity-90`
                }`}
              >
                {currentPlan === plan.id ? "Current Plan" : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Virtual Currency Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coinPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6"
              >
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {pkg.amount} Coins
                </div>
                {pkg.bonus > 0 && (
                  <div className="text-green-500 mb-4">
                    +{pkg.bonus} bonus coins!
                  </div>
                )}
                <div className="text-3xl font-bold text-[#357AFF] mb-4">
                  ${pkg.price}
                </div>
                <button
                  onClick={() => purchaseCoins(pkg.id)}
                  disabled={loading}
                  className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Premium Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <i className="fas fa-ad text-4xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Ad-Free Experience
              </h3>
              <p className="text-gray-600">
                Enjoy uninterrupted access to all features
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-book text-4xl text-blue-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Exclusive Resources
              </h3>
              <p className="text-gray-600">
                Access premium learning materials and tools
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-coins text-4xl text-yellow-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Monthly Coin Bonus
              </h3>
              <p className="text-gray-600">
                Get bonus coins with your subscription
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;