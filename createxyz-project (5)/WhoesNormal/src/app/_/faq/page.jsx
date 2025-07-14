"use client";
import React from "react";

function MainComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const faqCategories = {
    general: {
      icon: "fa-circle-info",
      title: "General Questions",
      questions: [
        {
          q: "What is this platform about?",
          a: "This is a safe space for young minds to learn, share, and grow together. We provide support for ADHD, ASD, and other neurodivergent conditions through community connection and specialized tools.",
        },
        {
          q: "Who can use this platform?",
          a: "Our platform is designed for young people aged 9-13. Users under 13 require parental consent to access all features.",
        },
        {
          q: "Is this platform free?",
          a: "Yes, our core features are completely free to use. Some premium features may require a subscription in the future.",
        },
      ],
    },
    safety: {
      icon: "fa-shield-alt",
      title: "Safety & Privacy",
      questions: [
        {
          q: "How do you protect user privacy?",
          a: "We use strong encryption, never share personal information, and comply with COPPA guidelines. All user data is protected and regularly audited.",
        },
        {
          q: "Is content moderated?",
          a: "Yes, we have active content moderation and community guidelines to ensure a safe environment for all users.",
        },
        {
          q: "Can parents monitor activity?",
          a: "Yes, parents can access a dashboard to view their child's activity while respecting privacy boundaries.",
        },
      ],
    },
    features: {
      icon: "fa-stars",
      title: "Features & Tools",
      questions: [
        {
          q: "What tools are available?",
          a: "We offer focus timers, mood tracking, social connections, educational resources, and specialized support for ADHD and ASD.",
        },
        {
          q: "How do points and rewards work?",
          a: "Users earn points through positive interactions, completing challenges, and regular participation. Points can be used for virtual rewards.",
        },
        {
          q: "Can I connect with others?",
          a: "Yes, you can join moderated group discussions, participate in events, and interact with peers in a safe environment.",
        },
      ],
    },
    technical: {
      icon: "fa-wrench",
      title: "Technical Support",
      questions: [
        {
          q: "What devices are supported?",
          a: "Our platform works on all modern web browsers, both on desktop and mobile devices.",
        },
        {
          q: "How do I report technical issues?",
          a: "Use the Error Resolution Center or contact our support team through the help button.",
        },
        {
          q: "Are there offline features?",
          a: "Some features work offline, but most require an internet connection for the best experience.",
        },
      ],
    },
    business: {
      icon: "fa-briefcase",
      title: "Business Inquiries",
      questions: [
        {
          q: "How can I partner with you?",
          a: "For business partnerships, please contact our team through the business inquiry form.",
        },
        {
          q: "Do you offer school programs?",
          a: "Yes, we have special programs for educational institutions. Contact us for more information.",
        },
        {
          q: "Can I advertise on the platform?",
          a: "We carefully select partners who align with our values and mission. Contact us for details.",
        },
      ],
    },
  };

  useEffect(() => {
    const filtered = Object.entries(faqCategories).reduce(
      (acc, [category, data]) => {
        const matchingQuestions = data.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingQuestions.length > 0) {
          acc[category] = { ...data, questions: matchingQuestions };
        }
        return acc;
      },
      {}
    );
    setFilteredQuestions(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none pl-10"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(faqCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`p-4 rounded-xl transition-colors ${
                activeCategory === key
                  ? "bg-[#357AFF] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <i className={`fas ${category.icon} mr-2`}></i>
              {category.title}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          {Object.entries(searchQuery ? filteredQuestions : faqCategories).map(
            ([key, category]) => (
              <div
                key={key}
                className={`mb-8 ${
                  activeCategory === key || searchQuery ? "block" : "hidden"
                }`}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className={`fas ${category.icon} mr-3 text-[#357AFF]`}></i>
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((qa, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {qa.q}
                      </h3>
                      <p className="text-gray-600">{qa.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {searchQuery && Object.keys(filteredQuestions).length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-600">No matching questions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;