"use client";
import React from "react";
import AffiliatePrograms from "../../components/affiliate-programs";

function MainComponent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAffiliatePrograms, setShowAffiliatePrograms] = useState(false);
  const [affiliatePrograms, setAffiliatePrograms] = useState([]);
  const [affiliateLoading, setAffiliateLoading] = useState(false);

  const categories = {
    apparel: "Apparel",
    sensory: "Sensory-Friendly",
    planners: "Planners & Tools",
    limited: "Limited Edition",
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const initiateCheckout = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        throw new Error("Checkout session creation failed");
      }

      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (err) {
      setError("Could not process checkout");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError("Could not load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAffiliatePrograms = async () => {
      setAffiliateLoading(true);
      try {
        const response = await fetch("/api/affiliate-programs/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch affiliate programs");
        }

        const data = await response.json();
        setAffiliatePrograms(data.programs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setAffiliateLoading(false);
      }
    };

    fetchAffiliatePrograms();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Add Coming Soon Banner */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="coming-soon-banner bg-gradient-to-r from-[#87CEEB] via-[#40E0D0] to-[#98FF98] p-8 shadow-2xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white text-center animate-pulse">
            Coming Soon
          </h1>
        </div>
      </div>

      {/* Add margin to push content below banner */}
      <div className="mt-40">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="bg-white rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Who's Normal Store
            </h1>
            <p className="text-gray-600">
              Shop our collection of neurodiversity-friendly products
            </p>
          </header>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === "all"
                    ? "bg-[#357AFF] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                All Products
              </button>
              {Object.entries(categories).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === key
                      ? "bg-[#357AFF] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {value}
                </button>
              ))}
              <button
                onClick={() => setShowAffiliatePrograms(!showAffiliatePrograms)}
                className={`px-4 py-2 rounded-lg ${
                  showAffiliatePrograms
                    ? "bg-[#357AFF] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Affiliate Programs
              </button>
            </div>
          </div>

          {showAffiliatePrograms ? (
            <AffiliatePrograms programs={affiliatePrograms} />
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-3/4">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCategory === "all"
                          ? "bg-[#357AFF] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All Products
                    </button>
                    {Object.entries(categories).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedCategory === key
                            ? "bg-[#357AFF] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full text-center py-8">
                      <i className="fas fa-circle-notch fa-spin text-[#357AFF] text-2xl"></i>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl p-6 shadow-lg"
                      >
                        <img
                          src={product.image}
                          alt={`${product.name} - Who's Normal merchandise`}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">
                            ${product.price}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-[#357AFF] text-white px-4 py-2 rounded-lg hover:bg-[#2E69DE]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="md:w-1/4">
                <div className="bg-white rounded-xl p-6 shadow-lg sticky top-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Shopping Cart
                  </h2>
                  {cart.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 border rounded"
                            />
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold mb-4">
                          <span>Total:</span>
                          <span>
                            $
                            {cart
                              .reduce(
                                (sum, item) => sum + item.price * item.quantity,
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={initiateCheckout}
                          className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2E69DE]"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add the animation styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .coming-soon-banner {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .8; }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;