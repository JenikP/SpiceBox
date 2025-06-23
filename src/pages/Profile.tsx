import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingWeight, setUpdatingWeight] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfileData();
    fetchWeightEntries();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeightEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("weight_entries")
        .select("*")
        .eq("user_id", user?.id)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      setWeightEntries(data || []);
    } catch (error) {
      console.error("Error fetching weight entries:", error);
    }
  };

  const addWeightEntry = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      alert("Please enter a valid weight");
      return;
    }

    setUpdatingWeight(true);
    try {
      const { error } = await supabase.from("weight_entries").insert({
        user_id: user?.id,
        weight: parseFloat(newWeight),
      });

      if (error) throw error;

      setNewWeight("");
      fetchWeightEntries();
    } catch (error) {
      console.error("Error adding weight entry:", error);
      alert("Failed to record weight");
    } finally {
      setUpdatingWeight(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      alert("Error signing out");
    } else {
      navigate("/");
    }
  };

  const chartData = weightEntries.map((entry) => ({
    date: new Date(entry.recorded_at).toLocaleDateString(),
    weight: entry.weight,
  }));

  const currentWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].weight
      : null;
  const initialWeight =
    weightEntries.length > 0 ? weightEntries[0].weight : null;
  const weightLoss =
    initialWeight && currentWeight ? initialWeight - currentWeight : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800">Your Profile</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-orange-600 text-orange-600 rounded hover:bg-orange-600 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-700">
            Profile Information
          </h2>
          {profile && (
            <div className="space-y-2 text-gray-800">
              <p>
                <strong>Full Name:</strong> {profile.full_name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
            </div>
          )}
        </div>

        {/* Weight Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-700">
            Weight Stats
          </h2>
          <div className="space-y-2 text-gray-800">
            {currentWeight && (
              <p>
                <strong>Current Weight:</strong> {currentWeight} kg
              </p>
            )}
            {weightLoss > 0 && (
              <p className="text-green-600">
                <strong>Total Weight Loss:</strong> -{weightLoss.toFixed(1)} kg
              </p>
            )}
            <p>
              <strong>Total Entries:</strong> {weightEntries.length}
            </p>
          </div>
        </div>

        {/* Add Weight */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-700">
            Record New Weight
          </h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="weight"
                className="block text-sm text-gray-600 mb-1"
              >
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g. 75.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              onClick={addWeightEntry}
              disabled={updatingWeight}
              className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700 transition"
            >
              {updatingWeight ? "Saving..." : "Record"}
            </button>
          </div>
        </div>

        {/* Weight Progress Table */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-700">
              Weight Progress Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                <thead className="bg-orange-100 text-orange-800">
                  <tr>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((entry, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2">{entry.date}</td>
                      <td className="px-4 py-2 font-semibold">
                        {entry.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/enter-details")}
            className="bg-red-500 text-white px-6 py-3 rounded font-semibold hover:bg-red-600 transition"
          >
            Update Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
