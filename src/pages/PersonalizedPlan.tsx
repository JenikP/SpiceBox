// src/pages/PersonalizedPlan.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PersonalizedPlanPage() {
  const [userData, setUserData] = useState<null | {
    gender: string;
    age: number;
    weight: number;
    height: number;
    weightLossGoal: number;
    timeframeWeeks: number;
    activityLevel: string;
    dietaryPreference: string;
  }>(null);

  const [timeframe, setTimeframe] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userDetails");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserData({
        gender: parsed.gender,
        age: Number(parsed.age),
        weight: Number(parsed.weight),
        height: Number(parsed.height),
        weightLossGoal: Number(parsed.weightLossGoal ?? parsed.goal),
        timeframeWeeks: Number(parsed.timeframeWeeks ?? parsed.timeframe),
        activityLevel: parsed.activityLevel,
        dietaryPreference: parsed.dietaryPreference,
      });
      setTimeframe(Number(parsed.timeframeWeeks ?? parsed.timeframe) || 24);
    }
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-orange-50 to-red-100">
        <h1 className="text-3xl font-bold text-red-600 mb-4">No Plan Found</h1>
        <p className="text-gray-600 mb-6">Please enter your details to generate a personalized plan.</p>
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
    const { gender, weight, height, age, activityLevel, weightLossGoal } = userData;

    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMap: Record<string, number> = {
      low: 1.2,
      moderate: 1.55,
      high: 1.75,
    };

    const tdee = bmr * (activityMap[activityLevel] || 1.2);
    const weeklyLossKg = weightLossGoal / timeframe;
    const calorieDeficit = Math.min(weeklyLossKg * 1100, 1000);
    const targetCals = Math.max(tdee - calorieDeficit, gender === "female" ? 1200 : 1500);

    return {
      calories: Math.round(targetCals),
      kilojoules: Math.round(targetCals * 4.184),
      weeklyLoss: Math.round(weeklyLossKg * 1000),
    };
  };

  const { calories, kilojoules, weeklyLoss } = calculateCalories();

  const calorieTiers = [
    {
      type: "Mild",
      loss: "0.25 kg",
      calories: Math.round(calories + 300),
    },
    {
      type: "Standard",
      loss: "0.50 kg",
      calories: calories,
    },
    {
      type: "Aggressive",
      loss: `${(userData.weightLossGoal / timeframe).toFixed(2)} kg`,
      calories: Math.round(calories - 200),
    },
  ];

  const handleConfirmPlan = () => {
    const planData = {
      calories,
      kilojoules,
      weeklyLoss,
      timeframe,
    };
    localStorage.setItem("confirmedPlan", JSON.stringify(planData));
    navigate("/finalize-meals");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Personalised Plan</h1>
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
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Adjust Timeframe</h3>
          <input
            type="range"
            min={4}
            max={52}
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value))}
            className="w-full accent-red-500 h-4"
          />
          <p className="text-sm text-center text-blue-600 mt-2">
            You'll be losing approximately <strong>{weeklyLoss}g</strong> per week
          </p>
          <p className="text-xs text-center text-gray-400 mt-1">
            The longer the timeframe, the less aggressive your weekly weight loss.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calorie Target Options</h3>
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
                <tr key={tier.type} className="bg-red-50 hover:bg-red-100 transition rounded-lg">
                  <td className="px-4 py-3 font-medium">{tier.type}</td>
                  <td className="px-4">{tier.loss}</td>
                  <td className="px-4">{tier.calories} kcal</td>
                  <td className="px-4">{Math.round(tier.calories * 4.184)} kJ</td>
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
  );
}
