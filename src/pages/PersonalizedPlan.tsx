// src/pages/PersonalizedPlan.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

export default function PersonalizedPlanPage() {
  const { user } = useAuth();

  const [userData, setUserData] = useState<null | {
    gender: string;
    age: number;
    weight: number;
    height: number;
    weight_loss_goal: number;
    timeframe_weeks: number;
    activity_level: string;
    dietary_preference: string;
  }>(null);

  const [timeframe, setTimeframe] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.warn("No authenticated user.");
        return;
      }

      const { data, error, status } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(); // ✅ safer than .single()

      console.log("Fetched data:", data);
      console.log("Fetch error:", error);
      console.log("Status:", status);

      if (error && status !== 406) {
        console.error("Error checking user details:", error.message || error);
        return;
      }

      if (!data) {
        console.warn("No user_details found for user:", user.id);
        return;
      }

      setUserData(data);
      setTimeframe(data.timeframe_weeks);
    };

    fetchData();
  }, [user]);

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-orange-50 to-red-100">
        <h1 className="text-3xl font-bold text-red-600 mb-4">No Plan Found</h1>
        <p className="text-gray-600 mb-6">
          Please enter your details to generate a personalized plan.
        </p>
        <Link
          to="/enter-details"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Enter Details
        </Link>
      </div>
    );
  }

  const calculateCalories = () => {
    if (!userData) return { calories: 0, kilojoules: 0, weeklyLoss: 0 };

    const { gender, weight_loss_goal, height, age, activity_level } = userData;

    const bmr =
      gender === "male"
        ? 10 * userData.weight + 6.25 * height - 5 * age + 5
        : 10 * userData.weight + 6.25 * height - 5 * age - 161;

    const activityMap: Record<string, number> = {
      low: 1.2,
      moderate: 1.55,
      high: 1.75,
    };

    const tdee = bmr * (activityMap[activity_level] || 1.2);
    const weeklyLossKg = weight_loss_goal / timeframe;
    const calorieDeficit = Math.min(weeklyLossKg * 1100, 1000);
    const targetCals = Math.max(
      tdee - calorieDeficit,
      gender === "female" ? 1200 : 1500
    );

    return {
      calories: Math.round(targetCals),
      kilojoules: Math.round(targetCals * 4.184),
      weeklyLoss: Math.round(weeklyLossKg * 1000),
    };
  };

  const { kilojoules, weeklyLoss } = calculateCalories();

  const minWeeks = Math.ceil(userData.weight_loss_goal / 0.9); // e.g. 10kg goal ➜ 12 weeks minimum

  // Static calorie tier calculations
  const activityMap: Record<string, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.75,
  };

  const { gender, weight, height, age, activity_level } = userData;

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * (activityMap[activity_level] || 1.2);

  // Helper to calculate safe calorie target
  const calcTargetCalories = (weeklyKgLoss: number) => {
    const deficit = Math.min(weeklyKgLoss * 1100, 1000); // 1kg = ~7700kcal but capped at 1000/day
    const target = Math.max(tdee - deficit, gender === "female" ? 1200 : 1500);
    return {
      weeklyLoss: weeklyKgLoss,
      calories: Math.round(target),
      kilojoules: Math.round(target * 4.184),
    };
  };

  // Fixed tiers
  const mildTier = calcTargetCalories(0.25);
  const standardTier = calcTargetCalories(0.5);
  const aggressiveTier = calcTargetCalories(0.9);

  const calorieTiers = [
    {
      type: "Mild",
      loss: "0.25 kg",
      calories: mildTier.kilojoules,
    },
    {
      type: "Standard",
      loss: "0.50 kg",
      calories: standardTier.kilojoules,
    },
    {
      type: "Aggressive",
      loss: `0.90 kg`,
      calories: aggressiveTier.kilojoules,
    },
  ];

  const handleConfirmPlan = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("user_details")
      .update({
        timeframe_weeks: timeframe,
        calculated_daily_calories: kilojoules,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating user plan:", error);
      alert("Failed to save your plan.");
      return;
    }

    navigate("/finalize-meals");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Your Personalised Plan
            </h1>
            <p className="text-gray-600 text-lg">
              Adjust the timeframe to see how it affects your plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
            <div className="bg-white shadow rounded-xl py-6 px-4">
              <p className="text-sm text-gray-500">Daily Calories</p>
              <h2 className="text-2xl font-bold">{kilojoules} kJ</h2>
            </div>
            <div className="bg-white shadow rounded-xl py-6 px-4">
              <p className="text-sm text-gray-500">Weekly Weight Loss</p>
              <h2 className="text-2xl font-bold">{weeklyLoss} g</h2>
            </div>
            <div className="bg-white shadow rounded-xl py-6 px-4">
              <p className="text-sm text-gray-500">Timeframe</p>
              <h2 className="text-2xl font-bold">{timeframe} weeks</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Adjust Timeframe
            </h3>
            <input
              type="range"
              min={minWeeks}
              max={52}
              value={Math.max(timeframe, minWeeks)}
              onChange={(e) =>
                setTimeframe(Math.max(parseInt(e.target.value), minWeeks))
              }
              className="w-full accent-red-500 h-4"
            />

            <p className="text-sm text-center text-blue-600 mt-2">
              You'll be losing approximately <strong>{weeklyLoss}g</strong> per
              week
            </p>
            <p className="text-xs text-center text-gray-400 mt-1">
              The longer the timeframe, the less aggressive your weekly weight
              loss.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Calorie Target Options
            </h3>
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600 text-sm">
                  <th className="px-4">Type</th>
                  <th className="px-4">Weekly Loss</th>
                  <th className="px-4">Target Calories</th>
                  <th className="px-4">Target kJ</th>
                </tr>
              </thead>
              <tbody>
                {calorieTiers.map((tier) => (
                  <tr
                    key={tier.type}
                    className="bg-red-50 hover:bg-red-100 transition rounded-lg"
                  >
                    <td className="px-4 py-3 font-medium">{tier.type}</td>
                    <td className="px-4">{tier.loss}</td>
                    <td className="px-4">{tier.calories} kcal</td>
                    <td className="px-4">
                      {Math.round(tier.calories * 4.184)} kJ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate("/enter-details")}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleConfirmPlan}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
            >
              Confirm Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
