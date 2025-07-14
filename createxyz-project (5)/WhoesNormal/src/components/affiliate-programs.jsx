"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ programs = [] }) {
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectProgram = (programId) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleBulkApply = async () => {
    if (selectedPrograms.length === 0) {
      setError("Please select at least one program");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bulk-affiliate-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programIds: selectedPrograms }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit applications");
      }

      setSelectedPrograms([]);
    } catch (err) {
      setError("Failed to process applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Available Affiliate Programs
        </h2>
        <button
          onClick={handleBulkApply}
          disabled={loading || selectedPrograms.length === 0}
          className="bg-[#357AFF] text-white px-6 py-2 rounded-lg hover:bg-[#2E69DE] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Apply to Selected (${selectedPrograms.length})`
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all ${
              selectedPrograms.includes(program.id)
                ? "border-[#357AFF]"
                : "border-transparent"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {program.name}
                </h3>
                <p className="text-gray-600">{program.category}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedPrograms.includes(program.id)}
                onChange={() => handleSelectProgram(program.id)}
                className="h-5 w-5 text-[#357AFF] rounded border-gray-300"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-lg font-bold text-[#357AFF]">
                <i className="fas fa-percentage mr-2"></i>
                {program.commissionRate}% Commission
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Benefits:</h4>
                <ul className="space-y-1">
                  {program.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryComponent() {
  const samplePrograms = [
    {
      id: 1,
      name: "Premium Health Partners",
      category: "Healthcare",
      commissionRate: 15,
      benefits: [
        "Dedicated affiliate manager",
        "Weekly payments",
        "Marketing materials",
        "Performance bonuses"
      ],
      tags: ["Healthcare", "Premium", "High Commission"]
    },
    {
      id: 2,
      name: "Wellness Network",
      category: "Wellness",
      commissionRate: 12,
      benefits: [
        "Monthly newsletters",
        "Exclusive promotions",
        "Training resources",
        "Analytics dashboard"
      ],
      tags: ["Wellness", "Network", "Resources"]
    },
    {
      id: 3,
      name: "Mental Health Connect",
      category: "Mental Health",
      commissionRate: 18,
      benefits: [
        "Priority support",
        "Custom landing pages",
        "Bi-weekly payments",
        "Referral bonuses"
      ],
      tags: ["Mental Health", "Support", "High Paying"]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <MainComponent programs={samplePrograms} />
    </div>
  );
});
}