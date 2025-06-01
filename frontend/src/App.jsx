import { useEffect } from "react";
import Header from "./Components/Header";
import { userAuthStore } from "./store/useAuthStore";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Loader } from "lucide-react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
