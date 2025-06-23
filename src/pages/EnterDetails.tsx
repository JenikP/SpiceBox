import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EnterDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    timeframe: "24",
    dietaryPreference: "",
    activityLevel: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ageMap: Record<string, number> = {
      "18-25": 22,
      "26-39": 32,
      "40-49": 45,
      "50+": 55
    };

    const ageValue = ageMap[formData.age];
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const goal = parseFloat(formData.goal);
    const weeks = parseInt(formData.timeframe);

    const gender = formData.gender;
    let bmr;

    if (gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * ageValue;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * ageValue;
    }

    let activityMultiplier = 1.2;
    switch (formData.activityLevel) {
      case "moderate": activityMultiplier = 1.55; break;
      case "high": activityMultiplier = 1.725; break;
      default: activityMultiplier = 1.375; break;
    }

    const tdee = bmr * activityMultiplier;
    const deficit = Math.min(goal / weeks * 7700, 1000);
    const calories = Math.max(Math.round(tdee - deficit), gender === "female" ? 1200 : 1500);

    const dataToSave = {
      ...formData,
      age: ageValue,
      weight,
      height,
      weightLossGoal: goal,
      timeframeWeeks: weeks,
      calculatedDailyCalories: calories
    };

    localStorage.setItem("userDetails", JSON.stringify(dataToSave));
    navigate("/personalized-plan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Let's Personalize Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your goals and preferences so we can craft a meal plan tailored just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 text-xl">
          {/* Gender */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Gender</label>
            <div className="grid grid-cols-2 gap-6">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleChange("gender", g)}
                  className={`py-4 rounded-xl font-semibold transition-all ${
                    formData.gender === g
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-red-100"
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Age Group</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["18-25", "26-39", "40-49", "50+"].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleChange("age", range)}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    formData.age === range
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-red-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Current Weight (kg)</label>
            <input
              type="number"
              placeholder="e.g. 75"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Height (cm)</label>
            <input
              type="number"
              placeholder="e.g. 170"
              value={formData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Weight Loss Goal (kg)</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={formData.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
              className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
              required
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block font-semibold text-gray-800 mb-4">Choose a Timeframe (weeks)</label>
            <input
              type="number"
              value={formData.timeframe}
              onChange={(e) => handleChange("timeframe", e.target.value)}
              className="w-full text-center py-2 px-4 mb-4 border border-gray-300 rounded-lg text-lg"
              placeholder="24"
            />
           <input
  type="range"
  min={4}
  max={52}
  value={formData.timeframe}
  onChange={(e) => handleChange("timeframe", e.target.value)}
  className="w-full h-5 rounded-full appearance-none bg-red-200 accent-red-600 cursor-pointer
             [&::-webkit-slider-thumb]:appearance-none
             [&::-webkit-slider-thumb]:h-6
             [&::-webkit-slider-thumb]:w-6
             [&::-webkit-slider-thumb]:rounded-full
             [&::-webkit-slider-thumb]:bg-red-600
             [&::-webkit-slider-thumb]:shadow-lg
             [&::-moz-range-thumb]:appearance-none
             [&::-moz-range-thumb]:h-6
             [&::-moz-range-thumb]:w-6
             [&::-moz-range-thumb]:rounded-full
             [&::-moz-range-thumb]:bg-red-600"
/>

            <p className="text-center text-gray-500 mt-2 text-base">
              Recommended: 12–24 weeks for sustainable weight loss
            </p>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Dietary Preference</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {["No preference", "Vegetarian", "Vegan", "Keto", "Halal"].map((opt) => {
                const key = opt.toLowerCase().replace(" ", "");
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleChange("dietaryPreference", key)}
                    className={`py-3 text-base rounded-xl font-medium transition-all ${
                      formData.dietaryPreference === key
                        ? "bg-red-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block font-semibold text-gray-800 mb-3">Activity Level</label>
            <div className="grid grid-cols-3 gap-4">
              {["Low", "Moderate", "High"].map((lvl) => {
                const key = lvl.toLowerCase();
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleChange("activityLevel", key)}
                    className={`py-4 rounded-xl font-semibold transition-all ${
                      formData.activityLevel === key
                        ? "bg-red-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 text-2xl font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
            >
              Generate My Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
