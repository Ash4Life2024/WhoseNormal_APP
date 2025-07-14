"use client";
import React from "react";

function MainComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A safe and supportive space for everyone
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-[#357AFF] text-white px-8 py-3 rounded-lg hover:bg-[#2E69DE] transition-colors">
              Get Started
            </button>
            <button className="bg-white text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-users text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Community
              </h2>
              <p className="text-gray-600">Connect with others</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-shield-alt text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Security</h2>
              <p className="text-gray-600">Safe and protected</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <i className="fas fa-heart text-[#357AFF] text-3xl mb-4"></i>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Support</h2>
              <p className="text-gray-600">Always here to help</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainComponent;