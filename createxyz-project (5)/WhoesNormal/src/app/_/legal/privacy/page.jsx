"use client";
import React from "react";

function MainComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                1. Information We Collect
              </h2>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">
                  For Children (Ages 9-13):
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Display name (non-identifiable username)</li>
                  <li>Age verification</li>
                  <li>Platform activities and preferences</li>
                  <li>Progress in educational activities</li>
                </ul>

                <h3 className="font-semibold text-gray-700 mt-4">
                  For Parents/Guardians:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Verification information</li>
                  <li>Account management preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                2. How We Use Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and personalize our services</li>
                <li>Ensure age-appropriate content delivery</li>
                <li>Maintain platform safety and security</li>
                <li>Send important account notifications</li>
                <li>Improve our educational resources</li>
                <li>Comply with COPPA requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                3. Data Protection
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive information</li>
                <li>Secure data storage and transmission</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee data access</li>
                <li>Automated threat detection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                4. Parental Rights
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review child's personal information</li>
                <li>Request information deletion</li>
                <li>Control information sharing</li>
                <li>Update consent preferences</li>
                <li>Receive data collection notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                5. Information Sharing
              </h2>
              <p className="mb-2">We only share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parents/legal guardians</li>
                <li>
                  Service providers (with strict data protection requirements)
                </li>
                <li>Law enforcement (when legally required)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                6. Data Retention
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Active accounts: Data retained for service provision</li>
                <li>Inactive accounts: Data deleted after 12 months</li>
                <li>
                  Parental consent records: Maintained for legal compliance
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                7. Third-Party Services
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational content providers</li>
                <li>Security and monitoring services</li>
                <li>Analytics (non-personal data only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                8. Contact Us
              </h2>
              <p>For privacy concerns or to exercise your rights:</p>
              <div className="bg-blue-50 rounded-lg p-4 mt-2">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <i className="fas fa-envelope text-blue-500 mr-2"></i>
                    Email: privacy@platform.com
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-phone text-blue-500 mr-2"></i>
                    Phone: 1-800-PRIVACY
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-clock text-blue-500 mr-2"></i>
                    Response time: Within 48 hours
                  </li>
                </ul>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: January 1, 2025
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This privacy policy complies with COPPA (Children's Online
                Privacy Protection Act) requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;