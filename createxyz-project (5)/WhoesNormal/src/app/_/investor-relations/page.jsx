"use client";
import React from "react";

function MainComponent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-pitch-deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to download pitch deck");
      }
    } catch (err) {
      console.error(err);
      setError("Could not download pitch deck");
    }
  };

  const slides = [
    {
      title: "Who's Normal",
      subtitle:
        "A Safe, Supportive Social Space for Neurodiverse & Mental Health Communities",
      content: (
        <div className="space-y-4">
          <p className="text-xl text-gray-600">
            Breaking the cycle of isolation and stigma through community-driven
            support
          </p>
          <div className="space-y-2">
            <p>
              <strong>Contact:</strong> ForeverAPersonalTouch@gmail.com |
              304-304-4476
            </p>
            <p>
              <strong>Website:</strong> who-s-normal-865.created.app
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Our Mission",
      subtitle:
        "To break the cycle of isolation, stigma, and struggle for those who've been labeled as 'different'.",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-600 mb-6">
            We provide a fun, secure, and supportive space for users to express
            themselves, make friends, and build emotional resilience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                The Problem
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                  <span>1 in 5 young people are neurodiverse</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                  <span>
                    Over 60% feel isolated and struggle with social
                    relationships
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                  <span>
                    Traditional social media exposes users to bullying and harm
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                  <span>
                    Mental health apps focus on therapy — not community
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Our Solution
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>
                    Moderated social feed designed for neurodiverse brains
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Private spaces for venting and emotional safety</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>
                    AI-assisted supervised live hangouts and chatrooms
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Mood tracking, focus timers, and self-care tools</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Weekly challenges and rewards for healthy habits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Market Potential",
      subtitle: "Neurodiverse individuals worldwide",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">150M+</p>
            <p className="text-gray-600">Neurodiverse individuals worldwide</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$26B</p>
            <p className="text-gray-600">
              Projected mental health tech market by 2030
            </p>
          </div>
          <p className="text-gray-600">
            Early partnerships with educators, therapists, and advocacy groups
            show massive demand
          </p>
        </div>
      ),
    },
    {
      title: "Revenue Model",
      subtitle:
        "Freemium Subscription, Mental Health Partners, Brand Sponsorships, In-app Purchases",
      content: (
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <i className="fas fa-gem text-purple-500 mr-3"></i>
            <div>
              <h3 className="font-bold">Freemium Subscription</h3>
              <p className="text-sm text-gray-600">
                Free to use, premium for advanced features
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <i className="fas fa-handshake text-blue-500 mr-3"></i>
            <div>
              <h3 className="font-bold">Mental Health Partners</h3>
              <p className="text-sm text-gray-600">
                Affiliate & referral income
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <i className="fas fa-ad text-green-500 mr-3"></i>
            <div>
              <h3 className="font-bold">Brand Sponsorships</h3>
              <p className="text-sm text-gray-600">Ethical ad placement</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <i className="fas fa-shopping-cart text-orange-500 mr-3"></i>
            <div>
              <h3 className="font-bold">In-app Purchases</h3>
              <p className="text-sm text-gray-600">
                Self-care tools and digital items
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Team",
      subtitle: "Founder & CEO, Founder Strengths, Current Support Network",
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-[#357AFF] pl-4">
            <h3 className="text-xl font-bold text-gray-800">
              Ashley Page — Founder & CEO
            </h3>
            <p className="text-gray-600 mt-2">
              A passionate entrepreneur, creative innovator, and dedicated
              mental health advocate. Ashley brings creativity, persistence, and
              a heart-centered approach from her background in small business
              ownership — including beauty, fashion, and handmade wellness
              products.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Founder Strengths
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Entrepreneurial self-starter with hands-on experience building
                  successful online businesses
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Skilled in product design, customer experience, and user
                  community development
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Deep personal understanding of mental health and
                  neurodiversity challenges
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>
                  Committed to ethical growth, transparency, and community-first
                  design
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Current Support Network
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-users text-blue-500 mt-1 mr-2"></i>
                <span>
                  Mental health advocates and educators for user-centered
                  feedback
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-laptop-code text-blue-500 mt-1 mr-2"></i>
                <span>
                  Freelance designers and developers for app execution
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-comments text-blue-500 mt-1 mr-2"></i>
                <span>
                  Beta testers and early adopters within the neurodiverse
                  community
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Investment Opportunity",
      subtitle: "Our Ask, Who defines 'normal' anyway?",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Our Ask</h3>
            <p className="text-gray-600 mb-4">We are seeking investment to:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-rocket text-blue-500 mt-1 mr-2"></i>
                <span>
                  Finalize development of advanced AI safety & moderation
                  features
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-globe text-blue-500 mt-1 mr-2"></i>
                <span>
                  Expand strategic partnerships with schools and mental health
                  organizations
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-bullhorn text-blue-500 mt-1 mr-2"></i>
                <span>
                  Launch targeted marketing to reach early adopters and
                  underserved communities
                </span>
              </li>
            </ul>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">
              Who defines "normal" anyway?
            </h3>
            <p className="text-lg mb-4">
              At Who's Normal, the answer is simple: You define it.
            </p>
            <p className="text-lg">
              We're just here to make sure you never feel alone doing it.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Contact Information",
      subtitle:
        "Ashley Page, 304-304-4476, ForeverAPersonalTouch@gmail.com, who-s-normal-865.created.app",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <i className="fas fa-user text-[#357AFF] text-xl"></i>
            <div>
              <h3 className="font-bold">Ashley Page</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <i className="fas fa-phone text-[#357AFF] text-xl"></i>
            <p>304-304-4476</p>
          </div>
          <div className="flex items-center space-x-4">
            <i className="fas fa-envelope text-[#357AFF] text-xl"></i>
            <a
              href="mailto:ForeverAPersonalTouch@gmail.com"
              className="text-blue-600 hover:underline"
            >
              ForeverAPersonalTouch@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <i className="fas fa-globe text-[#357AFF] text-xl"></i>
            <a
              href="https://who-s-normal-865.created.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              who-s-normal-865.created.app
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "Why Now?",
      subtitle:
        "Mental health is no longer a side issue — it's a global priority.",
      content: (
        <div className="space-y-4 text-gray-600">
          <p>
            Mental health is no longer a side issue — it's a global priority.
          </p>
          <p>
            Neurodiverse communities are growing louder, seeking platforms built
            for their needs.
          </p>
          <p>
            Schools, families, and workplaces are ready to support them — but
            the digital tools don't exist.
          </p>
          <p className="font-bold text-gray-800">
            Who's Normal is designed for this very moment.
          </p>
        </div>
      ),
    },
    {
      title: "Connect With Us",
      subtitle: "Download Full Pitch Deck, Schedule a Meeting",
      content: (
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
          />
          <button
            onClick={handleDownload}
            className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
          >
            <i className="fas fa-download mr-2"></i>Download Full Pitch Deck
          </button>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <i className="fas fa-calendar-alt mr-2"></i>Schedule a Meeting
          </button>
        </form>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              disabled={activeSlide === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {slides[activeSlide].title}
            </h2>
            <button
              onClick={() =>
                setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))
              }
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              disabled={activeSlide === slides.length - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="min-h-[400px] flex items-center justify-center">
            {slides[activeSlide].content}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeSlide ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Executive Summary
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              "Who's Normal" is the first safe, moderated social network
              dedicated to mental health and neurodiverse communities,
              specifically catering to young people facing challenges such as
              ADHD, autism, anxiety, and depression.
            </p>
            <p className="text-gray-600 mb-4">
              We provide a fun, secure, and supportive space for users to
              express themselves, make friends, and build emotional resilience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  The Problem
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>1 in 5 young people are neurodiverse</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Over 60% feel isolated and struggle with social
                      relationships
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Traditional social media exposes users to bullying and
                      harm
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Mental health apps focus on therapy — not community
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Our Solution
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Moderated social feed designed for neurodiverse brains
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>Private spaces for venting and emotional safety</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      AI-assisted supervised live hangouts and chatrooms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Mood tracking, focus timers, and self-care tools
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Weekly challenges and rewards for healthy habits
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-600 mb-6">
              To break the cycle of isolation, stigma, and struggle for those
              who've been labeled as "different." We provide a fun, secure, and
              supportive space for users to express themselves, make friends,
              and build emotional resilience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  The Problem
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>1 in 5 young people are neurodiverse</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Over 60% feel isolated and struggle with social
                      relationships
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Traditional social media exposes users to bullying and
                      harm
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-xs mt-2 mr-2 text-red-500"></i>
                    <span>
                      Mental health apps focus on therapy — not community
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Our Solution
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Moderated social feed designed for neurodiverse brains
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>Private spaces for venting and emotional safety</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      AI-assisted supervised live hangouts and chatrooms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Mood tracking, focus timers, and self-care tools
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    <span>
                      Weekly challenges and rewards for healthy habits
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Market Potential
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">150M+</p>
              <p className="text-gray-600">
                Neurodiverse individuals worldwide
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-600">$26B</p>
              <p className="text-gray-600">
                Projected mental health tech market by 2030
              </p>
            </div>
            <p className="text-gray-600">
              Early partnerships with educators, therapists, and advocacy groups
              show massive demand
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Revenue Model
          </h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <i className="fas fa-gem text-purple-500 mr-3"></i>
              <div>
                <h3 className="font-bold">Freemium Subscription</h3>
                <p className="text-sm text-gray-600">
                  Free to use, premium for advanced features
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <i className="fas fa-handshake text-blue-500 mr-3"></i>
              <div>
                <h3 className="font-bold">Mental Health Partners</h3>
                <p className="text-sm text-gray-600">
                  Affiliate & referral income
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <i className="fas fa-ad text-green-500 mr-3"></i>
              <div>
                <h3 className="font-bold">Brand Sponsorships</h3>
                <p className="text-sm text-gray-600">Ethical ad placement</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <i className="fas fa-shopping-cart text-orange-500 mr-3"></i>
              <div>
                <h3 className="font-bold">In-app Purchases</h3>
                <p className="text-sm text-gray-600">
                  Self-care tools and digital items
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Team</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#357AFF] pl-4">
              <h3 className="text-xl font-bold text-gray-800">
                Ashley Page — Founder & CEO
              </h3>
              <p className="text-gray-600 mt-2">
                A passionate entrepreneur, creative innovator, and dedicated
                mental health advocate. Ashley brings creativity, persistence,
                and a heart-centered approach from her background in small
                business ownership — including beauty, fashion, and handmade
                wellness products.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Founder Strengths
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>
                    Entrepreneurial self-starter with hands-on experience
                    building successful online businesses
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>
                    Skilled in product design, customer experience, and user
                    community development
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>
                    Deep personal understanding of mental health and
                    neurodiversity challenges
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>
                    Committed to ethical growth, transparency, and
                    community-first design
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Current Support Network
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-users text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Mental health advocates and educators for user-centered
                    feedback
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-laptop-code text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Freelance designers and developers for app execution
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-comments text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Beta testers and early adopters within the neurodiverse
                    community
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Investment Opportunity
          </h2>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Ask</h3>
              <p className="text-gray-600 mb-4">
                We are seeking investment to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-rocket text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Finalize development of advanced AI safety & moderation
                    features
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-globe text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Expand strategic partnerships with schools and mental health
                    organizations
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-bullhorn text-blue-500 mt-1 mr-2"></i>
                  <span>
                    Launch targeted marketing to reach early adopters and
                    underserved communities
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                Who defines "normal" anyway?
              </h3>
              <p className="text-lg mb-4">
                At Who's Normal, the answer is simple: You define it.
              </p>
              <p className="text-lg">
                We're just here to make sure you never feel alone doing it.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <i className="fas fa-user text-[#357AFF] text-xl"></i>
              <div>
                <h3 className="font-bold">Ashley Page</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-phone text-[#357AFF] text-xl"></i>
              <p>304-304-4476</p>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-envelope text-[#357AFF] text-xl"></i>
              <a
                href="mailto:ForeverAPersonalTouch@gmail.com"
                className="text-blue-600 hover:underline"
              >
                ForeverAPersonalTouch@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-globe text-[#357AFF] text-xl"></i>
              <a
                href="https://who-s-normal-865.created.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                who-s-normal-865.created.app
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Now?</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Mental health is no longer a side issue — it's a global
                priority.
              </p>
              <p>
                Neurodiverse communities are growing louder, seeking platforms
                built for their needs.
              </p>
              <p>
                Schools, families, and workplaces are ready to support them —
                but the digital tools don't exist.
              </p>
              <p className="font-bold text-gray-800">
                Who's Normal is designed for this very moment.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Connect With Us
            </h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none"
              />
              <button
                onClick={handleDownload}
                className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE] transition-colors"
              >
                <i className="fas fa-download mr-2"></i>Download Full Pitch Deck
              </button>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fas fa-calendar-alt mr-2"></i>Schedule a Meeting
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;