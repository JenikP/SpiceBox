
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+61 412 345 678",
    age: 32,
    height: 165,
    currentWeight: 68.5,
    goalWeight: 60,
    dietaryPreference: "vegetarian",
    activityLevel: "moderately-active",
    goal: "weight-loss",
    timeline: "6-months"
  });

  const stats = [
    { label: "Current Weight", value: "68.5 kg", change: "-2.5 kg", trend: "down" },
    { label: "Goal Weight", value: "60 kg", change: "8.5 kg to go", trend: "neutral" },
    { label: "BMI", value: "25.1", change: "Normal", trend: "neutral" },
    { label: "Streak", value: "21 days", change: "+3 days", trend: "up" }
  ];

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      plan: "Complete Plan",
      amount: 129,
      status: "delivered",
      meals: 21
    },
    {
      id: "ORD-2024-002", 
      date: "2024-01-08",
      plan: "Complete Plan",
      amount: 129,
      status: "delivered",
      meals: 21
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-01",
      plan: "Essential Plan",
      amount: 89,
      status: "delivered",
      meals: 14
    }
  ];

  const weeklyProgress = [
    { week: "Week 1", weight: 71, meals: 21, goal: 21 },
    { week: "Week 2", weight: 70.2, meals: 20, goal: 21 },
    { week: "Week 3", weight: 69.5, meals: 21, goal: 21 },
    { week: "Week 4", weight: 68.5, meals: 19, goal: 21 }
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "progress", name: "Progress", icon: "📈" },
    { id: "orders", name: "Orders", icon: "📦" },
    { id: "settings", name: "Settings", icon: "⚙️" }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data
    console.log("Saving profile data:", profileData);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white font-bold">
                {profileData.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {profileData.fullName.split(' ')[0]}!
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Track your progress and manage your SpiceBox journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-1 sm:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-orange-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className={`text-sm flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' :
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.trend === 'up' && '↗️'}
                      {stat.trend === 'down' && '↘️'}
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    <span>🍽️</span>
                    <span>View This Week's Meals</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200">
                    <span>📝</span>
                    <span>Log Today's Weight</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200">
                    <span>💬</span>
                    <span>Contact Nutritionist</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Completed Week 4 meals</div>
                      <div className="text-sm text-gray-600">19/21 meals eaten • 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Weight logged: 68.5kg</div>
                      <div className="text-sm text-gray-600">Down 0.8kg from last week • 3 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Nutritionist consultation</div>
                      <div className="text-sm text-gray-600">Discussed meal preferences • 1 week ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Progress Journey</h3>
                
                {/* Progress Chart Placeholder */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Weight Progress Chart</h4>
                    <p className="text-gray-600">Interactive chart showing your weight loss journey</p>
                  </div>
                </div>

                {/* Weekly Progress Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Week</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Weight</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Meals Completed</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyProgress.map((week, index) => (
                        <tr key={week.week} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">{week.week}</td>
                          <td className="py-3 px-4 text-gray-700">{week.weight}kg</td>
                          <td className="py-3 px-4 text-gray-700">{week.meals}/{week.goal}</td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              week.meals === week.goal 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {week.meals === week.goal ? 'Perfect' : 'Good'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Goals Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Weight Loss Goal</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Starting Weight:</span>
                      <span className="font-medium">71.0 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Weight:</span>
                      <span className="font-medium">68.5 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goal Weight:</span>
                      <span className="font-medium">60.0 kg</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-bold text-orange-600">2.5 kg lost</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Timeline Progress</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Elapsed:</span>
                      <span className="font-medium">1 month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">On Track:</span>
                      <span className="font-medium text-green-600">Yes ✅</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Expected Goal Date:</span>
                      <span className="font-bold text-orange-600">July 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Order History</h3>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    Reorder Favorites
                  </button>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <div className="font-bold text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.plan}</div>
                          <div className="text-sm text-gray-600">{order.meals} meals</div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">${order.amount}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </div>
                          <button className="text-orange-600 hover:text-orange-700 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Health Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={profileData.age}
                          onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                        <input
                          type="number"
                          value={profileData.height}
                          onChange={(e) => setProfileData({...profileData, height: parseInt(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={profileData.currentWeight}
                          onChange={(e) => setProfileData({...profileData, currentWeight: parseFloat(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={profileData.goalWeight}
                          onChange={(e) => setProfileData({...profileData, goalWeight: parseFloat(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                      <select
                        value={profileData.dietaryPreference}
                        onChange={(e) => setProfileData({...profileData, dietaryPreference: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="pescatarian">Pescatarian</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
