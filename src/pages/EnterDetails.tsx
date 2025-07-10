
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  age: z.number().min(18, "You must be at least 18 years old").max(100, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(120, "Height must be at least 120cm").max(250, "Please enter a valid height"),
  currentWeight: z.number().min(30, "Weight must be at least 30kg").max(300, "Please enter a valid weight"),
  goalWeight: z.number().min(30, "Goal weight must be at least 30kg").max(300, "Please enter a valid goal weight"),
  activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active"]),
  dietaryPreference: z.enum(["vegetarian", "non-vegetarian", "vegan", "no-preference"]),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  goal: z.enum(["weight-loss"]),
  timeline: z.number().min(1).max(52),
});

type FormData = z.infer<typeof formSchema>;

const EnterDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedDietaryPreference, setSelectedDietaryPreference] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string>("weight-loss");
  const [timelineWeeks, setTimelineWeeks] = useState<number>(12);
  const totalSteps = 4;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeline: 12,
      goal: "weight-loss",
    },
  });

  const [isExistingUser, setIsExistingUser] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [hasMedicalConditions, setHasMedicalConditions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dailyCalories, setDailyCalories] = useState<number>(0);

  // Pre-populate user data from authentication and existing details
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error getting user:", authError);
        return;
      }

      // Check if user already has details
      const { data: existingDetails, error: detailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingDetails && !detailsError) {
        setIsExistingUser(true);

        // Pre-populate all fields with existing data
        setValue("fullName", existingDetails.full_name || "");
        setValue("email", existingDetails.email || "");
        setValue("phone", existingDetails.phone || "");
        setValue("age", existingDetails.age || 18);
        setValue("height", existingDetails.height || 120);
        setValue("currentWeight", existingDetails.current_weight || 30);
        setValue("goalWeight", existingDetails.goal_weight || 30);
        setValue("timeline", existingDetails.timeline || 12);

        // Set selected states
        setSelectedGender(existingDetails.gender || "");
        setValue("gender", existingDetails.gender as "male" | "female" | "other");

        setSelectedDietaryPreference(existingDetails.dietary_preference || "");
        setValue("dietaryPreference", existingDetails.dietary_preference as "vegetarian" | "non-vegetarian" | "vegan" | "no-preference");

        setValue("activityLevel", existingDetails.activity_level as "sedentary" | "lightly-active" | "moderately-active" | "very-active");

        // Handle allergies and medical conditions
        if (existingDetails.allergies && existingDetails.allergies !== "" && existingDetails.allergies !== "na") {
          setHasAllergies(true);
          setValue("allergies", existingDetails.allergies);
        }

        if (existingDetails.medical_conditions && existingDetails.medical_conditions !== "" && existingDetails.medical_conditions !== "na") {
          setHasMedicalConditions(true);
          setValue("medicalConditions", existingDetails.medical_conditions);
        }

        setTimelineWeeks(existingDetails.timeline || 12);
      } else {
        // New user - get profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("id", user.id)
          .single();

        if (profile && !profileError) {
          setValue("fullName", profile.full_name || "");
          setValue("phone", profile.phone || "");
        }

        // Set email from auth user
        if (user.email) {
          setValue("email", user.email);
        }
      }
    };

    fetchUserData();
  }, [setValue]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "email", "phone"];
        break;
      case 2:
        fieldsToValidate = ["age", "gender", "height", "currentWeight", "goalWeight"];
        break;
      case 3:
        fieldsToValidate = ["activityLevel", "dietaryPreference"];
        break;
      case 4:
        fieldsToValidate = ["goal", "timeline"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeleteDetails = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Please log in again.");
      return;
    }

    const { error } = await supabase
      .from("user_details")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting user details:", error);
      alert("Failed to delete your details. Please try again.");
      return;
    }

    alert("Your details have been deleted successfully!");
    setIsExistingUser(false);
    setShowDeleteConfirm(false);

    // Reset form
    window.location.reload();
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Please log in again.");
      navigate("/auth");
      return;
    }

    // Use the most current daily calories from state (which is already calculated)
    const calculatedDailyCalories = dailyCalories || calculateDailyCalories();

    const detailsData = {
      user_id: user.id,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      height: data.height,
      current_weight: data.currentWeight,
      goal_weight: data.goalWeight,
      activity_level: data.activityLevel,
      dietary_preference: data.dietaryPreference,
      allergies: hasAllergies ? data.allergies : "na",
      medical_conditions: hasMedicalConditions ? data.medicalConditions : "na",
      goal: data.goal,
      timeline: data.timeline,
      calculated_daily_calories: calculatedDailyCalories,
    };

    // Update or insert user details
    let error;
    if (isExistingUser) {
      const { error: updateError } = await supabase
        .from("user_details")
        .update(detailsData)
        .eq("user_id", user.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("user_details")
        .insert(detailsData);
      error = insertError;
    }

    if (error) {
      console.error("Error saving user details:", error);
      alert("Failed to save your details. Please try again.");
      return;
    }

    // Save data and navigate to personalized plan
    navigate("/personalized-plan", { state: { formData: data } });
  };

  const currentWeight = watch("currentWeight");
  const goalWeight = watch("goalWeight");
  const bmi = currentWeight && watch("height") ? (currentWeight / Math.pow(watch("height") / 100, 2)).toFixed(1) : null;

  const stepTitles = [
    "Personal Information",
    "Physical Details",
    "Lifestyle & Preferences",
    "Goals & Timeline"
  ];

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setValue("gender", gender as "male" | "female" | "other");
  };

  const handleDietaryPreferenceSelect = (preference: string) => {
    setSelectedDietaryPreference(preference);
    setValue("dietaryPreference", preference as "vegetarian" | "non-vegetarian" | "vegan" | "no-preference");
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setValue("goal", goal as "weight-loss");
  };

  // Calculate safe timeline range based on weight loss goal
  const calculateSafeTimelineRange = () => {
    const currentWeight = watch("currentWeight");
    const goalWeight = watch("goalWeight");

    if (!currentWeight || !goalWeight || currentWeight <= goalWeight) {
      return { min: 1, max: 52 };
    }

    const weightToLose = currentWeight - goalWeight;
    const maxWeeklyLoss = 0.8; // kg per week (safe maximum)
    const minWeeklyLoss = 0.2; // kg per week (minimum for progress)

    const minWeeks = Math.ceil(weightToLose / maxWeeklyLoss);
    const maxWeeks = Math.floor(weightToLose / minWeeklyLoss);

    return {
      min: Math.max(minWeeks, 1),
      max: Math.min(maxWeeks, 52)
    };
  };

  const handleTimelineChange = (weeks: number) => {
    const safeRange = calculateSafeTimelineRange();

    // Ensure the selected timeline is within safe range
    const safeWeeks = Math.max(safeRange.min, Math.min(weeks, safeRange.max));

    setTimelineWeeks(safeWeeks);
    setValue("timeline", safeWeeks);
  };

  // Calculate weekly weight loss rate for display
  const getWeeklyLossRate = () => {
    const currentWeight = watch("currentWeight");
    const goalWeight = watch("goalWeight");

    if (!currentWeight || !goalWeight || currentWeight <= goalWeight) {
      return 0;
    }

    const weightToLose = currentWeight - goalWeight;
    return weightToLose / timelineWeeks;
  };

  // Check if current timeline is safe
  const isTimelineSafe = () => {
    const weeklyRate = getWeeklyLossRate();
    return weeklyRate <= 0.8 && weeklyRate >= 0.2;
  };

  // Calculate daily calories based on current form data with timeline considerations
  const calculateDailyCalories = () => {
    const currentWeight = watch("currentWeight");
    const goalWeight = watch("goalWeight");
    const height = watch("height");
    const age = watch("age");
    const gender = watch("gender");
    const activityLevel = watch("activityLevel");
    const goal = watch("goal");

    if (!currentWeight || !height || !age || !gender || !activityLevel || !goalWeight) {
      return 1500; // Default value
    }

    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * currentWeight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      "sedentary": 1.2,
      "lightly-active": 1.375,
      "moderately-active": 1.55,
      "very-active": 1.725
    };

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];

    if (goal === "weight-loss" && currentWeight > goalWeight) {
      // Calculate deficit needed based on timeline
      const weightToLose = currentWeight - goalWeight; // in kg
      const totalCaloriesToLose = weightToLose * 7700; // 1kg = ~7700 calories
      const daysInTimeline = timelineWeeks * 7;
      const dailyDeficitNeeded = totalCaloriesToLose / daysInTimeline;
      
      // Apply the deficit, but ensure it's not too aggressive
      const maxSafeDeficit = tdee * 0.25; // Max 25% deficit for safety
      const actualDeficit = Math.min(dailyDeficitNeeded, maxSafeDeficit);
      
      // Ensure minimum calories for health (1200 for women, 1500 for men)
      const minCalories = gender === "male" ? 1500 : 1200;
      const targetCalories = Math.max(tdee - actualDeficit, minCalories);
      
      return Math.round(targetCalories);
    }

    return Math.round(tdee);
  };

  // Recalculate calories whenever relevant form data changes including timeline
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Only recalculate if relevant fields changed
      const relevantFields = ['currentWeight', 'goalWeight', 'height', 'age', 'gender', 'activityLevel', 'goal', 'timeline'];
      if (relevantFields.includes(name || '')) {
        const newDailyCalories = calculateDailyCalories();
        setDailyCalories(newDailyCalories);

        // Update the calories in the database when timeline or other relevant data changes
        const updateCaloriesInDatabase = async () => {
          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
              console.error("User not authenticated");
              return;
            }

            // Only update if user exists in database
            if (isExistingUser) {
              const { error } = await supabase
                .from("user_details")
                .update({ 
                  calculated_daily_calories: newDailyCalories,
                  timeline: timelineWeeks 
                })
                .eq("user_id", user.id);

              if (error) {
                console.error("Error updating daily calories:", error);
              }
            }
          } catch (error) {
            console.error("Error in updateCaloriesInDatabase:", error);
          }
        };

        // Only update database if we have valid data and user is existing
        if (isExistingUser && newDailyCalories > 0) {
          updateCaloriesInDatabase();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isExistingUser, timelineWeeks]);

  // Initial calculation when component mounts or when timeline changes
  useEffect(() => {
    const newDailyCalories = calculateDailyCalories();
    setDailyCalories(newDailyCalories);
  }, [timelineWeeks]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {isExistingUser ? (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Update Your{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Details
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                  Review and update your information to ensure your meal plan is perfectly tailored to your current needs.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  🗑️ Delete All Details
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Let's Create Your{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Perfect Plan
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Tell us about yourself so we can design a personalized meal plan that fits your lifestyle and helps you achieve your goals.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      i + 1 <= currentStep
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        i + 1 < currentStep
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </h2>
              <p className="text-gray-600">
                {currentStep} of {totalSteps} completed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("fullName")}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter your full name"
                      readOnly
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter your email address"
                      readOnly
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                      placeholder="Enter your phone number"
                      readOnly
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Physical Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        {...register("age", { valueAsNumber: true })}
                        type="number"
                        min="18"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your age"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {errors.age && (
                        <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleGenderSelect(option.value)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                              selectedGender === option.value
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm) *
                    </label>
                    <input
                      {...register("height", { valueAsNumber: true })}
                      type="number"
                      min="120"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your height in centimeters"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    {errors.height && (
                      <p className="text-red-600 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Weight (kg) *
                      </label>
                      <input
                        {...register("currentWeight", { valueAsNumber: true })}
                        type="number"
                        min="30"
                        max="300"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter current weight"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {errors.currentWeight && (
                        <p className="text-red-600 text-sm mt-1">{errors.currentWeight.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Goal Weight (kg) *
                      </label>
                      <input
                        {...register("goalWeight", { valueAsNumber: true })}
                        type="number"
                        min="30"
                        max="300"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter goal weight"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {errors.goalWeight && (
                        <p className="text-red-600 text-sm mt-1">{errors.goalWeight.message}</p>
                      )}
                    </div>
                  </div>

                  {bmi && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Current BMI:</strong> {bmi} (
                        {parseFloat(bmi) < 18.5 ? "Underweight" :
                         parseFloat(bmi) < 25 ? "Normal" :
                         parseFloat(bmi) < 30 ? "Overweight" : "Obese"})
                      </p>
                      {dailyCalories > 0 && (
                        <p className="text-sm text-orange-700 mt-1">
                          <strong>Estimated Daily Calories:</strong> {dailyCalories} kJ
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Lifestyle & Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Level *
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
                        { value: "lightly-active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
                        { value: "moderately-active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
                        { value: "very-active", label: "Very Active", desc: "Heavy exercise 6-7 days/week" }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            {...register("activityLevel")}
                            type="radio"
                            value={option.value}
                            className="mt-1 text-orange-500 focus:ring-orange-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.activityLevel && (
                      <p className="text-red-600 text-sm mt-1">{errors.activityLevel.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preference *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "vegetarian", label: "Vegetarian" },
                        { value: "non-vegetarian", label: "Non-Vegetarian" },
                        { value: "vegan", label: "Vegan" },
                        { value: "no-preference", label: "No Preference" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleDietaryPreferenceSelect(option.value)}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            selectedDietaryPreference === option.value
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {errors.dietaryPreference && (
                      <p className="text-red-600 text-sm mt-1">{errors.dietaryPreference.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Allergies or Restrictions
                    </label>
                    <div className="flex gap-4 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setHasAllergies(false);
                          setValue("allergies", "");
                        }}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                          !hasAllergies
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                        }`}
                      >
                        No Allergies
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasAllergies(true)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                          hasAllergies
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        I Have Allergies
                      </button>
                    </div>
                    {hasAllergies ? (
                      <textarea
                        {...register("allergies")}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="List any food allergies, intolerances, or foods you prefer to avoid..."
                      />
                    ) : (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        No allergies
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <div className="flex gap-4 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setHasMedicalConditions(false);
                          setValue("medicalConditions", "");
                        }}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                          !hasMedicalConditions
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                        }`}
                      >
                        No Medical Conditions
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasMedicalConditions(true)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                          hasMedicalConditions
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        I Have Medical Conditions
                      </button>
                    </div>
                    {hasMedicalConditions ? (
                      <textarea
                        {...register("medicalConditions")}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Any medical conditions that might affect your diet (diabetes, hypertension, etc.)..."
                      />
                    ) : (
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        No medical conditions
                      </div>
                    )}
                  </div>

                  {dailyCalories > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        <strong>Updated Daily Calorie Target:</strong> {dailyCalories} kJ
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        This target is calculated based on your physical details and activity level
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Goals & Timeline */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Goal *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: "weight-loss", label: "Weight Loss", icon: "⚖️" },

                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleGoalSelect(option.value)}
                          className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                            selectedGoal === option.value
                              ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-105'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                          style={{ width: '100%' }}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className={`font-medium ${
                            selectedGoal === option.value ? 'text-orange-700' : 'text-gray-900'
                          }`}>{option.label}</div>
                        </button>
                      ))}
                    </div>
                    {errors.goal && (
                      <p className="text-red-600 text-sm mt-1">{errors.goal.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline: {timelineWeeks} weeks *
                    </label>
                    {currentWeight && goalWeight && currentWeight > goalWeight && (
                      <div className="mb-4">
                        <div className={`text-sm p-3 rounded-lg ${
                          isTimelineSafe() 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <span>{isTimelineSafe() ? '✅' : '⚠️'}</span>
                            <span className="font-medium">
                              Weekly loss rate: {getWeeklyLossRate().toFixed(2)}kg/week
                            </span>
                          </div>
                          {!isTimelineSafe() && (
                            <div className="mt-1 text-xs">
                              Safe range: 0.2kg - 0.8kg per week. Adjust your timeline for safer results.
                            </div>
                          )}
                          {dailyCalories > 0 && (
                            <div className="mt-2 text-xs font-medium">
                              📊 Daily calories adjusted to: {dailyCalories} kJ for this timeline
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="px-4">
                      {(() => {
                        const safeRange = calculateSafeTimelineRange();
                        const sliderMin = safeRange.min;
                        const sliderMax = safeRange.max;
                        const adjustedValue = Math.max(sliderMin, Math.min(timelineWeeks, sliderMax));

                        return (
                          <>
                            <input
                              type="range"
                              min={sliderMin}
                              max={sliderMax}
                              value={adjustedValue}
                              onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, ${isTimelineSafe() ? '#10b981' : '#f97316'} 0%, ${isTimelineSafe() ? '#10b981' : '#f97316'} ${((adjustedValue - sliderMin) / (sliderMax - sliderMin)) * 100}%, #e5e7eb ${((adjustedValue - sliderMin) / (sliderMax - sliderMin)) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                              <span>{sliderMin} weeks</span>
                              <span className="text-xs">
                                {currentWeight && goalWeight && currentWeight > goalWeight ? 'Safe Range' : 'Timeline'}
                              </span>
                              <span>{sliderMax} weeks</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {errors.timeline && (
                      <p className="text-red-600 text-sm mt-1">{errors.timeline.message}</p>
                    )}
                  </div>

                  {currentWeight && goalWeight && (
                    <div className={`rounded-lg p-4 ${
                      isTimelineSafe() 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                        : 'bg-gradient-to-r from-red-50 to-orange-50'
                    }`}>
                      <h4 className="font-medium text-gray-900 mb-2">Your Goal Summary</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Target: {Math.abs(currentWeight - goalWeight).toFixed(1)}kg {currentWeight > goalWeight ? 'weight loss' : 'weight gain'} over {timelineWeeks} weeks
                      </p>
                      {dailyCalories > 0 && (
                        <p className="text-sm text-blue-700 mb-2">
                          <strong>Daily Calorie Target:</strong> {dailyCalories} kJ (adjusted for your timeline)
                        </p>
                      )}
                      {currentWeight > goalWeight && (
                        <div className={`text-xs ${
                          isTimelineSafe() ? 'text-green-700' : 'text-red-700'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <span>{isTimelineSafe() ? '✅' : '⚠️'}</span>
                            <span>
                              {isTimelineSafe() 
                                ? 'This is a safe and sustainable weight loss plan' 
                                : 'This timeline may be too aggressive - consider extending your goal period'
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                  >
                    Create My Plan
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete All Details?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all your saved information including your health details, preferences, and meal plans. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDetails}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EnterDetails;
