"use client";
import React from "react";

function MainComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using our platform, you agree to be bound by
                these Terms of Service. If you disagree with any part of these
                terms, you do not have permission to access the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                2. User Eligibility
              </h2>
              <p>
                Users must be between 9 and 13 years old to register for a child
                account. Adult accounts are available for parents and guardians.
                Child accounts require parental consent and verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                3. Privacy and Data Protection
              </h2>
              <p>
                We are committed to protecting your privacy and handling your
                data in accordance with applicable laws including COPPA. For
                details on how we collect, use, and protect your information,
                please refer to our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                4. User Conduct
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be respectful and kind to other users</li>
                <li>Do not share personal information</li>
                <li>Do not engage in bullying or harassment</li>
                <li>Do not post inappropriate or harmful content</li>
                <li>Do not attempt to circumvent platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                5. Content Guidelines
              </h2>
              <p>
                All content must be age-appropriate and comply with our
                community guidelines. We reserve the right to remove any content
                that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                6. Intellectual Property
              </h2>
              <p>
                All content and materials available on our platform are
                protected by intellectual property rights. Users retain
                ownership of their content but grant us a license to use,
                display, and distribute it on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                7. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these terms or engage in inappropriate behavior. Parents
                can request account termination at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                8. Disclaimers
              </h2>
              <p>
                Our platform is provided "as is" without warranties of any kind.
                We are not responsible for user-generated content or third-party
                links.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                10. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Users
                will be notified of significant changes, and continued use of
                the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: January 1, 2025
              </p>
              <p className="text-sm text-gray-500 mt-2">
                © 2025 Our Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;