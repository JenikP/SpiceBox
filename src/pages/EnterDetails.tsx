
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

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
  dietaryPreference: z.enum(["vegetarian", "non-vegetarian", "vegan", "pescatarian"]),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  goal: z.enum(["weight-loss", "muscle-gain", "maintenance", "general-health"]),
  timeline: z.enum(["1-month", "3-months", "6-months", "1-year"]),
});

type FormData = z.infer<typeof formSchema>;

const EnterDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
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
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Let's Create Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about yourself so we can design a personalized meal plan that fits your lifestyle and helps you achieve your goals.
            </p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email address"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your phone number"
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
                      />
                      {errors.age && (
                        <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        {...register("gender")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
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
                    <select
                      {...register("dietaryPreference")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select your dietary preference</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="pescatarian">Pescatarian</option>
                    </select>
                    {errors.dietaryPreference && (
                      <p className="text-red-600 text-sm mt-1">{errors.dietaryPreference.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Allergies or Restrictions
                    </label>
                    <textarea
                      {...register("allergies")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="List any food allergies, intolerances, or foods you prefer to avoid..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      {...register("medicalConditions")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Any medical conditions that might affect your diet (diabetes, hypertension, etc.)..."
                    />
                  </div>
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
                        { value: "muscle-gain", label: "Muscle Gain", icon: "💪" },
                        { value: "maintenance", label: "Weight Maintenance", icon: "🎯" },
                        { value: "general-health", label: "General Health", icon: "❤️" }
                      ].map((option) => (
                        <label key={option.value} className="cursor-pointer">
                          <input
                            {...register("goal")}
                            type="radio"
                            value={option.value}
                            className="sr-only"
                          />
                          <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors duration-200 peer-checked:border-orange-500 peer-checked:bg-orange-50">
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.goal && (
                      <p className="text-red-600 text-sm mt-1">{errors.goal.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline *
                    </label>
                    <select
                      {...register("timeline")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select your timeline</option>
                      <option value="1-month">1 Month</option>
                      <option value="3-months">3 Months</option>
                      <option value="6-months">6 Months</option>
                      <option value="1-year">1 Year</option>
                    </select>
                    {errors.timeline && (
                      <p className="text-red-600 text-sm mt-1">{errors.timeline.message}</p>
                    )}
                  </div>

                  {currentWeight && goalWeight && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Your Goal Summary</h4>
                      <p className="text-sm text-gray-700">
                        Target: {Math.abs(currentWeight - goalWeight).toFixed(1)}kg {currentWeight > goalWeight ? 'weight loss' : 'weight gain'}
                      </p>
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
    </Layout>
  );
};

export default EnterDetails;
