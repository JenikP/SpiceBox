import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import Header from "../components/Header";

interface FormData {
  gender: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  timeframe: string;
  dietaryPreference: string;
  activityLevel: string;
}

interface FormErrors {
  weight: string;
  height: string;
  goal: string;
  timeframe: string;
}

export default function EnterDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    timeframe: "24",
    dietaryPreference: "",
    activityLevel: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    weight: "",
    height: "",
    goal: "",
    timeframe: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateField = (field: keyof FormErrors) => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const goal = parseFloat(formData.goal);
    const timeframe = parseInt(formData.timeframe);
    const height_m = height / 100;
    const minHealthyWeight = 18.5 * height_m * height_m;
    const finalWeight = weight - goal;
    const newErrors: FormErrors = { ...errors };
    const weeklyLoss = goal / timeframe;

    switch (field) {
      case "weight":
        if (isNaN(weight) || weight < 30 || weight > 300) {
          newErrors.weight =
            "Please enter a valid number between 30 kg and 300 kg.";
        } else if (weight < minHealthyWeight) {
          newErrors.weight =
            "Your current weight is below the healthy minimum for your height. Please review your input or goal.";
        } else {
          newErrors.weight = "";
        }
        break;
      case "height":
        if (isNaN(height) || height < 100 || height > 250) {
          newErrors.height =
            "Please enter a valid height between 100 cm and 250 cm.";
        } else {
          newErrors.height = "";
        }
        break;
      case "goal":
        if (isNaN(goal) || goal <= 0 || goal >= weight) {
          newErrors.goal =
            "Please enter a valid weight loss goal that is less than your current weight.";
        } else if (finalWeight < minHealthyWeight) {
          newErrors.goal =
            "Your weight loss goal is too aggressive. It would bring you below the healthy minimum weight for your height.";
        } else {
          newErrors.goal = "";
        }
        break;
      case "timeframe":
        if (isNaN(timeframe) || timeframe < 4 || timeframe > 52) {
          newErrors.timeframe =
            "Please enter a timeframe between 4 and 52 weeks.";
        } else if (weeklyLoss > 1.0) {
          newErrors.timeframe =
            "This goal is too aggressive. Losing more than 1 kg per week is not considered safe.";
        } else {
          newErrors.timeframe = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    return !Object.values(errors).some((e) => e.length > 0);
  };

  useEffect(() => {
    document.addEventListener("wheel", disableScrollOnNumberInput, {
      passive: false,
    });
    return () => {
      document.removeEventListener("wheel", disableScrollOnNumberInput);
    };
  }, []);

  const disableScrollOnNumberInput = (e: WheelEvent) => {
    if ((document.activeElement as HTMLInputElement)?.type === "number") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fix the errors before submitting the form");
      return;
    }

    ["weight", "height", "goal", "timeframe"].forEach((field) =>
      validateField(field as keyof FormErrors)
    );

    const ageMap: Record<string, number> = {
      "18-25": 22,
      "26-39": 32,
      "40-49": 45,
      "50+": 55,
    };

    const ageValue = ageMap[formData.age];
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const goal = parseFloat(formData.goal);
    const weeks = parseInt(formData.timeframe);
    const gender = formData.gender;

    // ✅ Calculate calories (in kilojoules)
    const bmr =
      gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * ageValue
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * ageValue;

    const multiplier =
      formData.activityLevel === "high"
        ? 1.725
        : formData.activityLevel === "moderate"
        ? 1.55
        : 1.375;

    const tdee = bmr * multiplier;
    const deficit = Math.min((goal / weeks) * 7700, 1000);
    const calories = Math.max(
      Math.round(tdee - deficit),
      gender === "female" ? 1200 : 1500
    );
    const kilojoules = Math.round(calories * 4.184); // ✅ Convert to kJ

    // ✅ Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    // ✅ Check if user_details already exists
    const {
      data: existingData,
      error: checkError,
      status,
    } = await supabase
      .from("user_details")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle(); // ✅ allows null without throwing an error

    if (checkError && status !== 406) {
      console.error("Error checking user details:", checkError);
      alert("Failed to check user details. Please try again.");
      return;
    }

    const payload = {
      user_id: user.id,
      gender,
      weight: weight,
      age: ageValue,
      height,
      activity_level: formData.activityLevel,
      weight_loss_goal: goal,
      timeframe_weeks: weeks,
      dietary_preference: formData.dietaryPreference,
      calculated_daily_calories: kilojoules,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (existingData) {
      // 🔁 Update existing
      const { error: updateError } = await supabase
        .from("user_details")
        .update(payload)
        .eq("user_id", user.id);
      error = updateError;
    } else {
      // 🆕 Insert new
      const { error: insertError } = await supabase
        .from("user_details")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      console.error("Error saving to Supabase:", error);
      alert("Failed to save your details. Please try again.");
      return;
    }

    navigate("/personalized-plan");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 space-y-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Let's Personalize Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your goals and preferences so we can craft a meal
              plan tailored just for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 text-xl">
            {/* Gender */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Gender
              </label>
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
              <label className="block font-semibold text-gray-800 mb-3">
                Age Group
              </label>
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
              <label className="block font-semibold text-gray-800 mb-3">
                Current Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                max="300"
                placeholder="e.g. 75"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                onBlur={() => validateField("weight")}
                className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
                required
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-2">{errors.weight}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                placeholder="e.g. 170"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                onBlur={() => validateField("height")}
                className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
                required
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-2">{errors.height}</p>
              )}
            </div>

            {/* Weight Loss Goal */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Weight Loss Goal (kg)
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={formData.goal}
                onChange={(e) => handleChange("goal", e.target.value)}
                onBlur={() => validateField("goal")}
                className="w-full py-4 px-5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-xl"
                required
              />
              {errors.goal && (
                <p className="text-red-500 text-sm mt-2">{errors.goal}</p>
              )}
            </div>

            {/* Timeframe */}
            <div>
              <label className="block font-semibold text-gray-800 mb-4">
                Choose a Timeframe (weeks)
              </label>
              <input
                type="number"
                min={4}
                max={52}
                value={formData.timeframe}
                onChange={(e) => handleChange("timeframe", e.target.value)}
                onBlur={() => validateField("timeframe")}
                className="w-full text-center py-2 px-4 mb-4 border border-gray-300 rounded-lg text-lg"
                placeholder="24"
              />
              {errors.timeframe && (
                <p className="text-red-500 text-sm mt-2">{errors.timeframe}</p>
              )}
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Dietary Preference
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {["No preference", "Vegetarian", "Vegan", "Keto", "Halal"].map(
                  (opt) => {
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
                  }
                )}
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Activity Level
              </label>
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
    </div>
  );
}
