"use client";
import React from "react";

function MainComponent() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [analyticsData, setAnalyticsData] = useState(null);

  const subscriptionTiers = [
    {
      name: "Free",
      price: "0",
      features: {
        "Community Access": true,
        "Basic Posts": true,
        "Daily Mood Check-ins": true,
        "Community Support": true,
        "Ad-Free Experience": false,
        "Premium Resources": false,
        "Expert Sessions": false,
        "Audio Therapy": false,
        "Virtual Currency Rewards": "50/month",
        "Custom Themes": false,
        "Priority Support": false,
        "Early Access": false,
      },
      color: "bg-gray-500",
    },
    {
      name: "Premium",
      price: "7.99",
      features: {
        "Community Access": true,
        "Basic Posts": true,
        "Daily Mood Check-ins": true,
        "Community Support": true,
        "Ad-Free Experience": true,
        "Premium Resources": true,
        "Expert Sessions": "2/month",
        "Audio Therapy": true,
        "Virtual Currency Rewards": "200/month",
        "Custom Themes": true,
        "Priority Support": false,
        "Early Access": false,
      },
      color: "bg-[#357AFF]",
      popular: true,
    },
    {
      name: "Ultimate",
      price: "14.99",
      features: {
        "Community Access": true,
        "Basic Posts": true,
        "Daily Mood Check-ins": true,
        "Community Support": true,
        "Ad-Free Experience": true,
        "Premium Resources": true,
        "Expert Sessions": "Unlimited",
        "Audio Therapy": true,
        "Virtual Currency Rewards": "500/month",
        "Custom Themes": true,
        "Priority Support": true,
        "Early Access": true,
      },
      color: "bg-[#FFD700]",
    },
  ];

  const coinPackages = [
    { amount: "100", price: "0.99", bonus: "0" },
    { amount: "500", price: "4.99", bonus: "50" },
    { amount: "1000", price: "9.99", bonus: "150" },
    { amount: "2000", price: "19.99", bonus: "400" },
  ];

  const [merchandise, setMerchandise] = useState([]);
  const [merchandiseCategories, setMerchandiseCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const response = await fetch("/api/merchandise/list", {
          method: "POST",
        });
        if (!response.ok) throw new Error("Failed to fetch merchandise");
        const data = await response.json();
        setMerchandise(data.merchandise);
        setMerchandiseCategories(data.categories);
      } catch (err) {
        console.error(err);
        setError("Could not load merchandise");
      }
    };

    fetchMerchandise();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/revenue", {
          method: "POST",
        });
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Premium Features
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of your mental wellness journey
          </p>
        </header>

        <nav className="bg-white rounded-lg shadow-md p-2">
          <ul className="flex justify-center space-x-4">
            {[
              "subscriptions",
              "virtual-currency",
              "merchandise",
              "analytics",
            ].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab
                      ? "bg-[#357AFF] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {activeTab === "subscriptions" && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-white rounded-xl p-6 shadow-lg ${
                    tier.popular ? "ring-2 ring-[#357AFF]" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="bg-[#357AFF] text-white text-sm py-1 px-3 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-3xl font-bold mb-6">
                    ${tier.price}
                    <span className="text-sm text-gray-500">/month</span>
                  </p>
                  <div className="space-y-3 mb-6">
                    {Object.entries(tier.features).map(([feature, value]) => (
                      <div
                        key={feature}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600">{feature}</span>
                        {typeof value === "boolean" ? (
                          value ? (
                            <i className="fas fa-check text-green-500"></i>
                          ) : (
                            <i className="fas fa-times text-red-500"></i>
                          )
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSubscribe(tier.name)}
                    className={`w-full py-3 rounded-lg text-white ${tier.color} hover:opacity-90 transition-opacity`}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : tier.price === "0"
                      ? "Current Plan"
                      : "Subscribe Now"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "virtual-currency" && (
          <section className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Virtual Currency
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {coinPackages.map((pack) => (
                <div
                  key={pack.amount}
                  className="text-center p-6 border rounded-lg hover:border-[#357AFF] transition-colors"
                >
                  <i className="fas fa-coins text-[#FFD700] text-3xl mb-4"></i>
                  <p className="text-2xl font-bold mb-2">{pack.amount} Coins</p>
                  {pack.bonus > 0 && (
                    <p className="text-green-500 text-sm mb-2">
                      +{pack.bonus} Bonus
                    </p>
                  )}
                  <p className="text-xl text-gray-600 mb-4">${pack.price}</p>
                  <button className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "merchandise" && (
          <section className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Merchandise
            </h2>
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    selectedCategory === "all"
                      ? "bg-[#357AFF] text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  All
                </button>
                {merchandiseCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedCategory === category.id
                        ? "bg-[#357AFF] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {merchandise
                .filter(
                  (item) =>
                    selectedCategory === "all" ||
                    item.category_id === selectedCategory
                )
                .map((item) => (
                  <div key={item.id} className="text-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xl text-gray-600 mb-4">${item.price}</p>
                    <button className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors">
                      Add to Cart
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}

        {activeTab === "analytics" && analyticsData && (
          <section className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Revenue Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Subscriptions
                </h3>
                <p className="text-3xl font-bold text-[#357AFF]">
                  ${analyticsData.subscriptionRevenue}
                </p>
                <p className="text-sm text-gray-600">
                  Monthly recurring revenue
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Virtual Currency
                </h3>
                <p className="text-3xl font-bold text-[#FFD700]">
                  ${analyticsData.virtualCurrencyRevenue}
                </p>
                <p className="text-sm text-gray-600">Total purchases</p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Merchandise
                </h3>
                <p className="text-3xl font-bold text-[#9C27B0]">
                  ${analyticsData.merchandiseRevenue}
                </p>
                <p className="text-sm text-gray-600">Total sales</p>
              </div>
            </div>
          </section>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;