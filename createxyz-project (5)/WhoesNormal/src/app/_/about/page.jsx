"use client";
import React from "react";

function MainComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="mb-6">
            <img
              src="https://ucarecdn.com/c67d66b6-71f8-4f4c-84be-1fb121a0c4f4/-/format/auto/"
              alt="Colorful infinity symbol representing neurodiversity"
              className="w-64 h-auto mx-auto rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-playfair">
            About Us
          </h1>
          <p className="text-xl text-gray-600 font-crimson-text">
            Building a safer, more inclusive digital space for young minds
          </p>
        </header>

        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-playfair">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed font-crimson-text">
            We're dedicated to creating a supportive online environment where
            young people aged 9-13 can learn, grow, and connect safely. Our
            platform specifically caters to neurodivergent youth, providing them
            with tools and community support to thrive in their daily lives.
          </p>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-playfair text-center">
              Meet Our Founder
            </h2>
            <h3 className="text-xl text-gray-700 mb-2 font-crimson-text text-center">
              Ash
            </h3>
            <div className="text-gray-600 leading-relaxed space-y-4 font-crimson-text">
              <p>
                Ash founded this platform with a mission: to transform how
                people with mental health conditions connect, support one
                another, and embrace their individuality—free from stigma or
                shame. With over a decade of expertise in child psychology and
                digital safety, Ash recognized the urgent need for a welcoming
                online space where neurodivergent individuals of all ages could
                feel truly seen and understood.
              </p>
              <p>
                Mental health challenges affect far more people than many
                realize. In fact, 1 in 3 people worldwide live with some form of
                mental health condition, and when factoring in those who remain
                undiagnosed or untreated, that number rises to{" "}
                <strong className="text-gray-800">
                  a staggering 70% to 80%
                </strong>
                —meaning nearly 4 out of 5 people experience mental health
                struggles. With that in mind, it becomes clear:{" "}
                <em className="text-gray-800">
                  there is no such thing as "normal."
                </em>{" "}
                If anything, the idea of "normal" is what truly stands apart.
              </p>
              <p>
                WhoseNormal was built to be a space where people can come
                together, connect with others who truly understand them, find
                support, seek answers, and make meaningful friendships. It's
                more than just a platform—it's an open door to a world where{" "}
                <strong className="text-gray-800">everyone</strong> belongs.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-playfair">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <i className="fas fa-shield-alt text-[#357AFF] text-2xl mt-1"></i>
              <div>
                <h3 className="font-bold text-gray-800 mb-2 font-playfair">
                  Safety First
                </h3>
                <p className="text-gray-600 font-crimson-text">
                  We prioritize creating a secure environment with robust
                  privacy protections and active moderation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="fas fa-users text-[#357AFF] text-2xl mt-1"></i>
              <div>
                <h3 className="font-bold text-gray-800 mb-2 font-playfair">
                  Inclusive Community
                </h3>
                <p className="text-gray-600 font-crimson-text">
                  We celebrate neurodiversity and create spaces where everyone
                  belongs.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="fas fa-brain text-[#357AFF] text-2xl mt-1"></i>
              <div>
                <h3 className="font-bold text-gray-800 mb-2 font-playfair">
                  Empowerment
                </h3>
                <p className="text-gray-600 font-crimson-text">
                  We provide tools and support to help young people develop
                  confidence and skills.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="fas fa-heart text-[#357AFF] text-2xl mt-1"></i>
              <div>
                <h3 className="font-bold text-gray-800 mb-2 font-playfair">
                  Compassionate Support
                </h3>
                <p className="text-gray-600 font-crimson-text">
                  We approach every interaction with understanding and empathy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-playfair">
            Join Our Mission
          </h2>
          <p className="text-gray-600 mb-6 font-crimson-text">
            Be part of our community and help shape a better digital future for
            young minds.
          </p>
        </section>
      </div>
    </div>
  );
}

export default MainComponent;