"use client";
import React from "react";

function MainComponent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="py-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">WhoseNormal</div>
          <div className="flex gap-4">
            <a
              href="/account/signin"
              className="text-gray-600 hover:text-gray-800"
            >
              Sign In
            </a>
            <a
              href="/account/signup"
              className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              Sign Up
            </a>
          </div>
        </nav>

        <main className="py-20">
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Safe Space for Growth
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A supportive community designed for young minds aged 9-13, where
              everyone belongs and thrives together.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="/account/signup"
                className="bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
              >
                Join Our Community
              </a>
              <a
                href="/about"
                className="bg-white text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-shield-alt text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Safe Environment
              </h2>
              <p className="text-gray-600">
                Protected space with active moderation and age-appropriate
                content
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-users text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Supportive Community
              </h2>
              <p className="text-gray-600">
                Connect with peers who understand and share similar experiences
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-brain text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Personal Growth
              </h2>
              <p className="text-gray-600">
                Access tools and resources designed for neurodivergent youth
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-12 text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start your journey in a space where everyone is valued and
              understood
            </p>
            <a
              href="/account/signup"
              className="inline-block bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors"
            >
              Get Started Today
            </a>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Why Choose Us?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <i className="fas fa-check-circle text-[#357AFF] mt-1"></i>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Age-Appropriate Design
                    </h3>
                    <p className="text-gray-600">
                      Tailored specifically for youth aged 9-13
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <i className="fas fa-check-circle text-[#357AFF] mt-1"></i>
                  <div>
                    <h3 className="font-bold text-gray-800">Parent-Approved</h3>
                    <p className="text-gray-600">
                      Comprehensive parental controls and oversight
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <i className="fas fa-check-circle text-[#357AFF] mt-1"></i>
                  <div>
                    <h3 className="font-bold text-gray-800">Expert Support</h3>
                    <p className="text-gray-600">
                      Guided by child development professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <img
                src="/images/community.jpg"
                alt="Diverse group of young people engaging in supportive community activities"
                className="rounded-lg w-full h-[300px] object-cover"
              />
            </div>
          </section>
        </main>

        <footer className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 WhoseNormal. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/about" className="text-gray-600 hover:text-gray-800">
                About
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-800">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-gray-800">
                Terms
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-800">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainComponent;