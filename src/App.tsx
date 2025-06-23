import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Meals from "./pages/Meals";
import Plan from "./pages/Plan";
import Contact from "./pages/Contact";
import EnterDetails from "./pages/EnterDetails";
import PersonalizedPlan from "./pages/PersonalizedPlan";
import FinalizeMeals from "./pages/FinalizeMeals";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Define all routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/enter-details"
            element={
              <ProtectedRoute>
                <EnterDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personalized-plan"
            element={
              <ProtectedRoute>
                <PersonalizedPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finalize-meals"
            element={
              <ProtectedRoute>
                <FinalizeMeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* IMPORTANT: DO NOT place any routes below this. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
