
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabaseClient";
import { meals } from "../data/meals";
import Layout from "../components/Layout";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: 0,
    height: 0,
    currentWeight: 0,
    goalWeight: 0,
    dietaryPreference: "",
    activityLevel: "",
    goal: "",
    timeline: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Auth error:", authError);
        return;
      }

      // Fetch user details
      const { data: details, error: detailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (details && !detailsError) {
        setUserDetails(details);
        setProfileData({
          fullName: details.full_name || "",
          email: details.email || "",
          phone: details.phone || "",
          age: details.age || 0,
          height: details.height || 0,
          currentWeight: details.current_weight || 0,
          goalWeight: details.goal_weight || 0,
          dietaryPreference: details.dietary_preference || "",
          activityLevel: details.activity_level || "",
          goal: details.goal || "",
          timeline: details.timeline || 0
        });
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile && !profileError) {
        setUserProfile(profile);
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData && !ordersError) {
        setOrders(ordersData);
        // Set current plan from most recent order
        if (ordersData.length > 0) {
          setCurrentPlan(ordersData[0]);
        }
      }

      // Fetch weekly meals
      const { data: mealsData, error: mealsError } = await supabase
        .from("weekly_meal_plan")
        .select("*")
        .eq("user_id", user.id);

      if (mealsData && !mealsError) {
        const mealsWithDetails = mealsData.map((wm) => {
          const meal = meals.find((m) => m.id === wm.meal_id);
          return { ...meal, ...wm };
        });
        setWeeklyMeals(mealsWithDetails);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!userDetails) return { weightLost: 0, daysActive: 0, mealsCompleted: 0 };
    
    const startWeight = 71; // You might want to store this when the user starts
    const weightLost = startWeight - userDetails.current_weight;
    const daysActive = Math.floor((new Date().getTime() - new Date(userDetails.created_at).getTime()) / (1000 * 3600 * 24));
    const mealsCompleted = weeklyMeals.length;
    
    return { weightLost, daysActive, mealsCompleted };
  };

  const getWeeksRemaining = () => {
    if (!currentPlan) return 0;
    
    // Calculate weeks remaining based on plan duration
    const planDurationWeeks = currentPlan.plan_duration === "14 days" ? 2 : 
                             currentPlan.plan_duration === "30 days" ? 4 : 
                             currentPlan.plan_duration === "4 months" ? 16 : 0;
    
    const weeksCompleted = Math.ceil(weeklyMeals.length / 21); // Assuming 21 meals per week
    return Math.max(0, planDurationWeeks - weeksCompleted);
  };

  const stats = [
    { 
      label: "Current Weight", 
      value: `${userDetails?.current_weight || 0} kg`, 
      change: `-${calculateProgress().weightLost.toFixed(1)} kg`, 
      trend: "down" 
    },
    { 
      label: "Goal Weight", 
      value: `${userDetails?.goal_weight || 0} kg`, 
      change: `${Math.abs((userDetails?.current_weight || 0) - (userDetails?.goal_weight || 0)).toFixed(1)} kg to go`, 
      trend: "neutral" 
    },
    { 
      label: "BMI", 
      value: userDetails ? ((userDetails.current_weight / Math.pow(userDetails.height / 100, 2)).toFixed(1)) : "0", 
      change: "Normal", 
      trend: "neutral" 
    },
    { 
      label: "Days Active", 
      value: `${calculateProgress().daysActive} days`, 
      change: "Keep going!", 
      trend: "up" 
    }
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "progress", name: "Progress", icon: "📈" },
    { id: "plan", name: "My Plan", icon: "🍽️" },
    { id: "orders", name: "Orders", icon: "📦" },
    { id: "settings", name: "Settings", icon: "⚙️" }
  ];

  const handleSave = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { error } = await supabase
        .from("user_details")
        .update({
          full_name: profileData.fullName,
          phone: profileData.phone,
          age: profileData.age,
          height: profileData.height,
          current_weight: profileData.currentWeight,
          goal_weight: profileData.goalWeight,
          dietary_preference: profileData.dietaryPreference,
          activity_level: profileData.activityLevel
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile");
      } else {
        setIsEditing(false);
        fetchUserData(); // Refresh data
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('') : 'U'}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {profileData.fullName ? profileData.fullName.split(' ')[0] : 'User'}!
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

              {/* Current Plan Status */}
              {currentPlan && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Current Plan Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{currentPlan.plan_name}</div>
                      <div className="text-sm text-gray-600">Active Plan</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{Math.ceil(weeklyMeals.length / 21)} weeks</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{getWeeksRemaining()} weeks</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>
                  {getWeeksRemaining() > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        📅 You still need to select meals for {getWeeksRemaining()} more weeks!
                      </p>
                      <button className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                        Select More Meals
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order, index) => {
                    // Determine if plan is active based on plan duration and purchase date
                    const purchaseDate = new Date(order.created_at);
                    const currentDate = new Date();
                    const daysSincePurchase = Math.floor((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
                    
                    let planDurationDays = 30; // Default to 30 days
                    if (order.plan_duration) {
                      if (order.plan_duration.includes('14 days')) planDurationDays = 14;
                      else if (order.plan_duration.includes('30 days')) planDurationDays = 30;
                      else if (order.plan_duration.includes('4 months')) planDurationDays = 120;
                    }
                    
                    const isActive = order.status === 'confirmed' && daysSincePurchase <= planDurationDays;
                    const daysRemaining = Math.max(0, planDurationDays - daysSincePurchase);
                    
                    return (
                      <div key={order.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                        isActive 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{order.plan_name}</div>
                            <div className="text-sm text-gray-600">
                              Purchased {new Date(order.created_at).toLocaleDateString()} • ${Number(order.total_amount).toFixed(2)}
                              {order.meal_count > 0 && ` • ${order.meal_count} meals`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Order #{order.order_number || `SPB-${order.id}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isActive 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isActive ? 'Active' : order.status === 'confirmed' ? 'Completed' : order.status}
                          </span>
                          {isActive && (
                            <span className="text-xs text-green-600">
                              {daysRemaining} days remaining
                            </span>
                          )}
                          {!isActive && order.status === 'confirmed' && (
                            <span className="text-xs text-gray-500">
                              Expired {daysSincePurchase - planDurationDays} days ago
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {orders.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-gray-500 mb-3">No purchased plans yet</p>
                      <p className="text-sm text-gray-400 mb-4">Your recent plan purchases and activity will appear here</p>
                      <button 
                        onClick={() => window.location.href = '/plan'}
                        className="text-orange-600 hover:text-orange-700 font-medium bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        Browse Plans
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* My Plan Tab */}
          {activeTab === "plan" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Meal Plan</h3>
                
                {currentPlan ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Plan Details</h4>
                        <p><strong>Plan:</strong> {currentPlan.plan_name}</p>
                        <p><strong>Duration:</strong> {currentPlan.plan_duration}</p>
                        <p><strong>Status:</strong> {currentPlan.status}</p>
                        <p><strong>Started:</strong> {new Date(currentPlan.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Progress</h4>
                        <p><strong>Weeks Completed:</strong> {Math.ceil(weeklyMeals.length / 21)}</p>
                        <p><strong>Meals Selected:</strong> {weeklyMeals.length}</p>
                        <p><strong>Weeks Remaining:</strong> {getWeeksRemaining()}</p>
                      </div>
                    </div>

                    {weeklyMeals.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Your Weekly Meal Plan</h4>
                        <div className="space-y-6">
                          {Array.from({ length: 7 }, (_, dayIndex) => {
                            const dayMeals = weeklyMeals.filter(meal => meal.day_index === dayIndex);
                            const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex];
                            
                            if (dayMeals.length === 0) return null;
                            
                            return (
                              <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                                <h5 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                                  {dayName}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {dayMeals.map((meal, index) => (
                                    <div key={`${meal.meal_id}-${index}`} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                      <img
                                        src={meal.image || "/placeholder-meal.jpg"}
                                        alt={meal.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900">{meal.name}</p>
                                        <p className="text-xs text-gray-600">{meal.category}</p>
                                        <p className="text-xs text-orange-600 font-medium">
                                          {meal.calories} cal • Qty: {meal.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Active Plan</h4>
                    <p className="text-gray-600 mb-4">Start your health journey by selecting a meal plan!</p>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold">
                      Choose a Plan
                    </button>
                  </div>
                )}
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
                  <h3 className="text-2xl font-bold text-gray-900">Payment History</h3>
                  <div className="text-sm text-gray-600">
                    Total Orders: {orders.length}
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-1">
                          <div className="font-bold text-gray-900">#{order.order_number || `ORD-${order.id}`}</div>
                          <div className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="font-medium text-gray-900">{order.plan_name}</div>
                          <div className="text-sm text-gray-600">
                            {order.plan_duration && `Duration: ${order.plan_duration}`}
                            {order.meal_count > 0 && ` • ${order.meal_count} meals`}
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <div className="font-bold text-gray-900">${Number(order.total_amount).toFixed(2)} {order.currency}</div>
                          <div className="text-xs text-gray-500">
                            {order.billing_cycle === 'one-time' ? 'One-time Payment' : `${order.billing_cycle} billing`}
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'confirmed' ? 'Paid' : order.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.stripe_session_id ? 'Card Payment' : 'Payment Method'}
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <div className="flex flex-col space-y-1">
                            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                              View Details
                            </button>
                            {order.status === 'confirmed' && (
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Download Receipt
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {order.special_instructions && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm text-gray-600">
                            <strong>Instructions:</strong> {order.special_instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💳</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No Payments Yet</h4>
                      <p className="text-gray-600 mb-4">Your payment history will appear here once you make your first purchase.</p>
                      <button 
                        onClick={() => window.location.href = '/plan'}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                      >
                        Browse Plans
                      </button>
                    </div>
                  )}
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
                        disabled={true}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                        <option value="no-preference">No Preference</option>
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
