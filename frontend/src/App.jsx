import { useEffect } from "react";
import Header from "./Components/Header";
import { userAuthStore } from "./store/userAuthStore";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Loader } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./Components/skeleton/Navbar";
import ProfilePage from "./pages/ProfilePage";
import RestaurantPage from "./pages/RestaurantPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={!authUser ? <Navigate to="/" /> : <ProfilePage />}
          ></Route>
          <Route path="/restaurants" element={<RestaurantPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
