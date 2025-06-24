import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

import { userAuthStore } from "./store/userAuthStore";
import { restaurantAuthStore } from "./restaurant/store/restaurantAuthStore";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantPage from "./pages/RestaurantPage";
import SignupPageRest from "./restaurant/pages/SignupPageRest";

import Navbar from "./Components/skeleton/Navbar";
import LoginPageRest from "./restaurant/pages/LoginPageRest";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();
  const { authRestaurant, checkAuthRestaurant, isCheckingRestaurant } =
    restaurantAuthStore();

  useEffect(() => {
    checkAuth();
    checkAuthRestaurant();
  }, [checkAuth, checkAuthRestaurant]);

  if (isCheckingAuth || isCheckingRestaurant)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          {/* Customer */}
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
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/restaurants" element={<RestaurantPage />} />

          {/* Restaurant */}
          <Route
            path="/partner/signup"
            element={
              !authRestaurant ? <SignupPageRest /> : <Navigate to="/partner" />
            }
          />
          <Route
            path="/partner/login"
            element={
              !authRestaurant ? (
                <LoginPageRest />
              ) : (
                <Navigate to="/restaurant/" />
              )
            }
          />

          {/* Rider routes will go here */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// import { useEffect } from "react";
// import Header from "./Components/Header";
// import { userAuthStore } from "./store/userAuthStore";
// import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import { Loader } from "lucide-react";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import Navbar from "./Components/skeleton/Navbar";
// import ProfilePage from "./pages/ProfilePage";
// import RestaurantPage from "./pages/RestaurantPage";
// import restaurantAuthStore from "./restaurant/store/restaurantAuthStore";
// import SignupPageRest from "./restaurant/pages/SignupPageRest";

// function App() {
//   const { authUser, checkAuth, isCheckingAuth } = userAuthStore();

//   const { authRestaurant, checkAuthRestaurant, isCheckingRestaurant } =
//     restaurantAuthStore();

//   useEffect(() => {
//     checkAuth();
//     checkAuthRestaurant();
//   }, [checkAuth, checkAuthRestaurant]);

//   console.log(authUser);
//   console.log(authRestaurant);

//   if (
//     (isCheckingAuth && !authUser) ||
//     (isCheckingRestaurant && !authRestaurant)
//   )
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );

//   return (
//     <div>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           {/* for customer */}
//           <Route path="/" element={<HomePage />} />
//           <Route
//             path="/login"
//             element={!authUser ? <LoginPage /> : <Navigate to="/" />}
//           />
//           <Route
//             path="/signup"
//             element={!authUser ? <SignupPage /> : <Navigate to="/" />}
//           />
//           <Route
//             path="/profile"
//             element={!authUser ? <Navigate to="/" /> : <ProfilePage />}
//           ></Route>
//           <Route path="/restaurants" element={<RestaurantPage />} />

//           {/* for restaurant */}
//           <Route
//             path="/restaurant/signup"
//             element={
//               !authRestaurant ? (
//                 <SignupPageRest />
//               ) : (
//                 <Navigate to="/restaurant/" />
//               )
//             }
//           />

//           {/* for rider */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
