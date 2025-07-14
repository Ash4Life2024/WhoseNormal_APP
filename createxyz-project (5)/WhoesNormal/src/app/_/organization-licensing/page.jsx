"use client";
import React from "react";

function MainComponent() {
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    contactName: "",
    email: "",
    phone: "",
    licenseType: "",
    seats: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const licenseTypes = {
    basic: {
      name: "Basic",
      price: 10,
      features: [
        "Access to core platform features",
        "Basic analytics dashboard",
        "Email support",
        "Standard security features",
      ],
    },
    professional: {
      name: "Professional",
      price: 20,
      features: [
        "All Basic features",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: 30,
      features: [
        "All Professional features",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "Advanced security features",
        "Onboarding assistance",
      ],
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/organization/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit your request. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl w-full text-center">
          <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600">
            Your licensing request has been submitted successfully. Our team
            will contact you shortly to finalize the details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Organization Licensing
          </h1>
          <p className="text-gray-600">
            Empower your organization with our comprehensive licensing solutions
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(licenseTypes).map(([key, license]) => (
            <div
              key={key}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {license.name}
              </h2>
              <div className="text-3xl text-[#357AFF] mb-4">
                ${license.price}
                <span className="text-sm text-gray-600">/user/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-grow">
                {license.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, licenseType: key }))
                }
                className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Request Organization License
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  required
                  value={formData.orgName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <select
                  name="orgType"
                  required
                  value={formData.orgType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="school">School</option>
                  <option value="healthcare">Healthcare Provider</option>
                  <option value="company">Company</option>
                  <option value="nonprofit">Non-Profit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  required
                  min="5"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#357AFF] text-white py-3 rounded-lg font-medium hover:bg-[#2E69DE] transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;