"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  onVerify = async () => {},
  initialEmail = '',
  verificationStatus = null,
  disabled = false
}) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(verificationStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      setStatus(result.status);
      await onVerify(result);
    } catch (err) {
      console.error(err);
      setError('Could not verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled || loading}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF] outline-none disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {status && (
          <div className={`p-3 rounded-lg text-sm ${
            status === 'verified' 
              ? 'bg-green-50 text-green-600'
              : 'bg-yellow-50 text-yellow-600'
          }`}>
            {status === 'verified' ? (
              <div className="flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                Email verified successfully
              </div>
            ) : (
              <div className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                Verification pending
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || loading || !email}
          className="w-full bg-[#357AFF] text-white py-3 rounded-lg font-medium hover:bg-[#2E69DE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-circle-notch fa-spin mr-2"></i>
              Verifying...
            </span>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>
    </div>
  );
}

function StoryComponent() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Default State</h2>
        <MainComponent 
          onVerify={async (result) => console.log('Verification result:', result)}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">With Initial Email</h2>
        <MainComponent 
          initialEmail="test@example.com"
          onVerify={async (result) => console.log('Verification result:', result)}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Verified State</h2>
        <MainComponent 
          initialEmail="verified@example.com"
          verificationStatus="verified"
          disabled={true}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Pending State</h2>
        <MainComponent 
          initialEmail="pending@example.com"
          verificationStatus="pending"
          disabled={true}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Disabled State</h2>
        <MainComponent 
          disabled={true}
        />
      </div>
    </div>
  );
});
}