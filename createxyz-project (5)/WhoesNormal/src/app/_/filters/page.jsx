"use client";
import React from "react";

function MainComponent() {
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState("/default-preview.jpg");
  const [processedImage, setProcessedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    effects: {},
    animation: {},
  });

  // Enhanced categories with descriptions
  const categories = [
    { id: "dramatic", name: "Dramatic", icon: "film" },
    { id: "nature", name: "Nature", icon: "tree" },
    { id: "portrait", name: "Portrait", icon: "user" },
    { id: "artistic", name: "Artistic", icon: "paint-brush" },
    { id: "black_and_white", name: "Mono", icon: "adjust" },
    { id: "experimental", name: "Special", icon: "magic" },
    { id: "vintage", name: "Vintage", icon: "camera-retro" },
    { id: "food", name: "Food", icon: "utensils" },
    { id: "travel", name: "Travel", icon: "plane" },
    { id: "urban", name: "Urban", icon: "city" },
    { id: "night", name: "Night", icon: "moon" },
    { id: "fashion", name: "Fashion", icon: "tshirt" },
    { id: "cinematic", name: "Cinema", icon: "video" },
    { id: "modern", name: "Modern", icon: "cube" },
    { id: "retro", name: "Retro", icon: "compact-disc" },
    { id: "space", name: "Space", icon: "star" },
  ];

  // Fetch filters with enhanced error handling
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/filters/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: activeCategory,
            sortBy,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch filters");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setFilters(data.filters);
      } catch (err) {
        setError("Could not load filters");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [activeCategory, sortBy]);

  // Process image with selected filter
  const processImage = async () => {
    try {
      setProcessing(true);
      const response = await fetch("/api/filters/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filterId: selectedFilter.id,
          settings: customSettings,
          type: selectedFilter.filter_type,
          animation: customSettings.animation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProcessedImage(data.processedImage);
    } catch (err) {
      setError("Could not process image");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle file upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProcessedImage(null); // Reset processed image when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply filter settings
  const handleFilterSelect = async (filter) => {
    setSelectedFilter(filter);
    setCustomSettings({
      brightness: filter.settings.brightness || 100,
      contrast: filter.settings.contrast || 100,
      saturation: filter.settings.saturation || 100,
      effects: filter.effect_data || {},
      animation: filter.animation_data || {},
    });

    // Auto-process image when filter is selected
    if (previewImage !== "/default-preview.jpg") {
      await processImage();
    }
  };

  // Handle setting changes with live preview
  const handleSettingChange = async (setting, value) => {
    setCustomSettings((prev) => {
      const newSettings = { ...prev, [setting]: value };
      return newSettings;
    });

    // Debounced processing
    if (previewImage !== "/default-preview.jpg") {
      await processImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Enhanced Filter Studio
          </h1>
          <p className="text-gray-600">
            Transform your images with professional-grade filters and effects
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Image Upload
                </h2>
                <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <i className="fas fa-upload mr-2"></i>
                  Upload Image
                </label>
              </div>

              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {processing ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center">
                      <i className="fas fa-circle-notch fa-spin text-3xl mb-2"></i>
                      <p>Processing...</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={processedImage || previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Filter Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brightness
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customSettings.brightness}
                      onChange={(e) =>
                        handleSettingChange(
                          "brightness",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contrast
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customSettings.contrast}
                      onChange={(e) =>
                        handleSettingChange(
                          "contrast",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saturation
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customSettings.saturation}
                      onChange={(e) =>
                        handleSettingChange(
                          "saturation",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>

                {/* Effect Controls */}
                <div className="space-y-4">
                  {selectedFilter?.effect_data &&
                    Object.entries(selectedFilter.effect_data).map(
                      ([effect, defaultValue]) => (
                        <div key={effect}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {effect.charAt(0).toUpperCase() + effect.slice(1)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              customSettings.effects[effect] * 100 ||
                              defaultValue * 100
                            }
                            onChange={(e) =>
                              handleSettingChange("effects", {
                                ...customSettings.effects,
                                [effect]: parseInt(e.target.value) / 100,
                              })
                            }
                            className="w-full accent-purple-600"
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
              >
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="votes">Most Voted</option>
              </select>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                  !activeCategory
                    ? "bg-purple-600 text-white"
                    : "bg-white/80 hover:bg-purple-100"
                }`}
              >
                <i className="fas fa-layer-group mr-2"></i>
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                    activeCategory === cat.id
                      ? "bg-purple-600 text-white"
                      : "bg-white/80 hover:bg-purple-100"
                  }`}
                >
                  <i className={`fas fa-${cat.icon} mr-2`}></i>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search filters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Filter List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="text-center py-4">
                  <i className="fas fa-circle-notch fa-spin text-purple-600 text-2xl"></i>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                filters
                  .filter(
                    (filter) =>
                      filter.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      filter.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((filter) => (
                    <div
                      key={filter.id}
                      className={`relative border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md ${
                        selectedFilter?.id === filter.id
                          ? "border-purple-600"
                          : ""
                      }`}
                    >
                      {/* Preview Thumbnail */}
                      {filter.preview_data?.thumbnail && (
                        <div className="aspect-video mb-3 rounded-lg overflow-hidden">
                          <img
                            src={filter.preview_data.thumbnail}
                            alt={filter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{filter.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {filter.usage_count || 0} uses
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {filter.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {filter.categories?.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 rounded-full bg-purple-100 text-purple-600 text-xs"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleFilterSelect(filter)}
                        disabled={processing}
                        className={`w-full py-2 rounded-lg transition-colors ${
                          selectedFilter?.id === filter.id
                            ? "bg-purple-700 text-white"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {processing ? (
                          <i className="fas fa-circle-notch fa-spin"></i>
                        ) : selectedFilter?.id === filter.id ? (
                          "Selected"
                        ) : (
                          "Apply Filter"
                        )}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(147, 51, 234, 0.5) rgba(229, 231, 235, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(147, 51, 234, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;