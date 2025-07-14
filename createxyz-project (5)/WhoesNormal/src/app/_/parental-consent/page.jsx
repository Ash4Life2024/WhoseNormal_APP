"use client";
import React from "react";

function MainComponent() {
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    childName: "",
    childAge: "",
    childEmail: "",
    acknowledgment: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.acknowledgment) {
      setError("Please acknowledge the consent statement");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/parental-consent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit consent form");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl w-full text-center">
          <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600">
            Your parental consent form has been submitted successfully. We'll
            review it and send a confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Parental Consent Form
          </h1>

          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Why We Need Your Consent
            </h2>
            <p className="text-gray-600">
              We're committed to creating a safe, supportive environment for
              children ages 9-13. Your consent helps us:
            </p>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li className="flex items-center">
                <i className="fas fa-shield-alt text-blue-500 mr-2"></i>Protect
                your child's privacy
              </li>
              <li className="flex items-center">
                <i className="fas fa-user-shield text-blue-500 mr-2"></i>Ensure
                age-appropriate content
              </li>
              <li className="flex items-center">
                <i className="fas fa-users text-blue-500 mr-2"></i>Create a
                monitored, safe social environment
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Full Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  required
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  required
                  value={formData.parentEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Full Name
                </label>
                <input
                  type="text"
                  name="childName"
                  required
                  value={formData.childName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Age
                </label>
                <input
                  type="number"
                  name="childAge"
                  min="9"
                  max="13"
                  required
                  value={formData.childAge}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Email (Optional)
              </label>
              <input
                type="email"
                name="childEmail"
                value={formData.childEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acknowledgment"
                  checked={formData.acknowledgment}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-[#357AFF] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I acknowledge that I am the parent/legal guardian of the child
                  named above. I understand and consent to the collection and
                  use of their personal information as described in the privacy
                  policy. I can withdraw this consent at any time by contacting
                  support.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#357AFF] text-white py-3 rounded-lg font-medium hover:bg-[#2E69DE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Consent Form"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;