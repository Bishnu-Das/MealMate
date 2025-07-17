import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";

import { userAuthStore } from "./store/userAuthStore";
import { restaurantAuthStore } from "./restaurant/store/restaurantAuthStore";
import { useRiderAuthStore } from "./rider/store/riderAuthStore";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantPage from "./pages/RestaurantPage";
import SignupPageRest from "./restaurant/pages/SignupPageRest";
import LoginPageRider from "./rider/pages/LoginPageRider";
import SignupPageRider from "./rider/pages/SignupPageRider";
import HomepageRider from "./rider/pages/HomepageRider";
import DeliveryHistoryPage from "./rider/pages/DeliveryHistoryPage";
import OrderDetailsPage from "./rider/pages/OrderDetailsPage";
import ProfilePageRider from "./rider/pages/ProfilePageRider";

import OrderHistoryPage from './pages/OrderHistoryPage';


import Navbar from "./Components/skeleton/Navbar";
import HomepageRest from "./restaurant/pages/HomepageRest";
import RestaurantProfie from "./pages/RestaurantProfile";
import RestaurantReviewsPage from "./pages/RestaurantReviewsPage";
import CheckoutPage from "./pages/CheckoutPage";
import SimulatePaymentGateway from "./pages/SimulatePaymentGateway";
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import PaymentCancelledPage from './pages/PaymentCancelledPage';
import { Toaster } from "./restaurant/components/ui/toaster";


import { element } from "prop-types";
import ChatButton from "./Components/ChatButton";
import ChatModal from "./Components/ChatModal";

import socketService from "./services/socketService";

const ChatPage = ({ openChat }) => {
  const { orderId } = useParams();
  useEffect(() => {
    openChat(orderId);
  }, [orderId, openChat]);
  return <Navigate to="/order-history" />; // Redirect back to order history
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();
  const { authRestaurant, checkAuthRestaurant, isCheckingRestaurant } =
    restaurantAuthStore();
  const { authrider, checkAuthRider, isCheckingAuthRider } = useRiderAuthStore();

  // Derive current user ID and type for stable socket connection dependencies
  const currentAuthUser = authUser || authRestaurant || authrider;
  const currentUserId = currentAuthUser?.user_id || currentAuthUser?.restaurant_id;
  const currentUserType = currentAuthUser?.role || (currentAuthUser?.restaurant_id ? 'restaurant' : undefined);

  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [chatOrderId, setChatOrderId] = useState(null);

  const openChat = (orderId = null) => {
    setChatOrderId(orderId);
    setIsChatWindowOpen(true);
  };

  const closeChat = () => {
    setIsChatWindowOpen(false);
    setChatOrderId(null);
  };

  useEffect(() => {
    checkAuth();
    checkAuthRestaurant();
    checkAuthRider();
  }, [checkAuth, checkAuthRestaurant, checkAuthRider]);

  useEffect(() => {
    if (currentUserId && currentUserType) {
      console.log(`App.jsx: Attempting to connect socket for ${currentUserType} with ID ${currentUserId}`);
      socketService.connect(currentUserId, currentUserType);
    } else {
      console.log("App.jsx: No authenticated user found, disconnecting socket if connected.");
      socketService.disconnect();
    }

    return () => {
      console.log("App.jsx: Cleaning up socket connection.");
      socketService.disconnect();
    };
  }, [currentUserId, currentUserType]);

  if (isCheckingAuth || isCheckingRestaurant || isCheckingAuthRider)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Toaster />
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
          <Route path="/restaurant/:id" element={<RestaurantProfie />} />
          <Route path="/restaurant/:restaurantId/reviews" element={<RestaurantReviewsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/simulate-payment-gateway" element={<SimulatePaymentGateway />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-fail" element={<PaymentFailedPage />} />
          <Route path="/payment-cancel" element={<PaymentCancelledPage />} />
          <Route path="/chat/:orderId" element={<ChatPage openChat={openChat} />} />

          {/* Restaurant */}
          {/* <Route
            path="/partner/signup"
            element={
              !authRestaurant ? <LoginPageRest /> : <Navigate to="/partner" />
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
          /> */}
          <Route path="/partner" element={<HomepageRest />} />

          {/* Rider */}
          <Route
            path="/rider/login"
            element={!authrider ? <LoginPageRider /> : <Navigate to="/rider" />}
          />
          <Route
            path="/rider/signup"
            element={!authrider ? <SignupPageRider /> : <Navigate to="/rider" />}
          />
          <Route
            path="/rider"
            element={authrider ? <HomepageRider /> : <Navigate to="/rider/login" />}
          />
          <Route
            path="/rider/history"
            element={authrider ? <DeliveryHistoryPage /> : <Navigate to="/rider/login" />}
          />
          <Route
            path="/rider/data/profile"
            element={authrider ? <ProfilePageRider /> : <Navigate to="/rider/login" />}
          />
          <Route
            path="/rider/data/orders/:orderId"
            element={authrider ? <OrderDetailsPage /> : <Navigate to="/rider/login" />}
          />
        </Routes>
        {authUser && <ChatButton onClick={() => openChat()} />}
        <ChatModal isOpen={isChatWindowOpen} onClose={closeChat} orderId={chatOrderId} currentAuthUser={authUser || authrider || authRestaurant} />
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
