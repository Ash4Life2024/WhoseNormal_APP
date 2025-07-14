"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Legal Documents
          </h1>
          <p className="text-gray-600">
            Access and download important legal documents and agreements
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <i className="fas fa-file-contract text-2xl text-[#357AFF] mr-3"></i>
              <h2 className="text-xl font-bold text-gray-800">
                Terms of Service
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our terms and conditions for using the platform, including user
              rights and responsibilities.
            </p>
            <a
              href="/legal/terms"
              className="block w-full bg-[#357AFF] text-white text-center py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Terms
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <i className="fas fa-user-shield text-2xl text-[#357AFF] mr-3"></i>
              <h2 className="text-xl font-bold text-gray-800">
                Privacy Policy
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Details about how we collect, use, and protect your personal
              information.
            </p>
            <a
              href="/legal/privacy"
              className="block w-full bg-[#357AFF] text-white text-center py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Policy
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <i className="fas fa-handshake text-2xl text-[#357AFF] mr-3"></i>
              <h2 className="text-xl font-bold text-gray-800">NDA Template</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Standard non-disclosure agreement template for business
              partnerships and collaborations.
            </p>
            <a
              href="/legal/nda"
              className="block w-full bg-[#357AFF] text-white text-center py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Template
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <i className="fas fa-copyright text-2xl text-[#357AFF] mr-3"></i>
              <h2 className="text-xl font-bold text-gray-800">
                Patent/Copyright Info
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Information about our intellectual property rights and patent
              documentation.
            </p>
            <a
              href="/legal/ip"
              className="block w-full bg-[#357AFF] text-white text-center py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Info
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg md:col-span-2">
            <div className="flex items-center mb-4">
              <i className="fas fa-handshake text-2xl text-[#357AFF] mr-3"></i>
              <h2 className="text-xl font-bold text-gray-800">
                Affiliate Agreement
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Terms and conditions for our affiliate program partnership.
            </p>
            <a
              href="/legal/affiliate"
              className="block w-full bg-[#357AFF] text-white text-center py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              <i className="fas fa-download mr-2"></i>Download Agreement
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <i className="fas fa-info-circle text-2xl text-[#357AFF] mr-3"></i>
            <h2 className="text-xl font-bold text-gray-800">
              Important Notice
            </h2>
          </div>
          <p className="text-gray-600">
            These documents were last updated in 2025. Please ensure you're
            using the most recent versions for your records. For any legal
            inquiries or clarifications, please contact our legal team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;