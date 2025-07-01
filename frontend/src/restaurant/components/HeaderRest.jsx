import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { restaurantAuthStore } from "../store/restaurantAuthStore";

const HeaderRest = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const { logout, authRestaurant } = restaurantAuthStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Good Morning, Chef!</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders, menu items..."
              className="pl-10 w-80 bg-gray-800 text-white border-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          <div className="flex items-center space-x-3 relative" ref={menuRef}>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {authRestaurant.name}
              </p>
              <p className="text-xs text-gray-400">Premium Partner</p>
            </div>
            <button
              className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full focus:outline-none"
              onClick={() => setShowMenu((v) => !v)}
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-white" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 mt-2 w-40 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 z-50 animate-fade-in">
                <button
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                    if (onLogout) onLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderRest;

// import React, { useState, useRef, useEffect } from "react";
// import { Bell, Search, User, LogOut } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { restaurantAuthStore } from "../store/restaurantAuthStore";

// const HeaderRest = ({ onLogout }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const menuRef = useRef();

//   const { logout, authRestaurant } = restaurantAuthStore();

//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     }
//     if (showMenu) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showMenu]);

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Good Morning, Chef!
//           </h1>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search orders, menu items..."
//               className="pl-10 w-80 bg-gray-50 border-gray-200"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-5 w-5" />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//               3
//             </span>
//           </Button>

//           <div className="flex items-center space-x-3 relative" ref={menuRef}>
//             <div className="text-right">
//               <p className="text-sm font-medium text-gray-900">
//                 {authRestaurant.name}
//               </p>
//               <p className="text-xs text-gray-500">Premium Partner</p>
//             </div>
//             <button
//               className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full focus:outline-none"
//               onClick={() => setShowMenu((v) => !v)}
//               aria-label="User menu"
//             >
//               <User className="h-5 w-5 text-white" />
//             </button>
//             {showMenu && (
//               <div className="absolute right-0 top-12 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
//                 <button
//                   className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-t-lg"
//                   onClick={() => {
//                     setShowMenu(false);
//                     logout();
//                     if (onLogout) onLogout();
//                   }}
//                 >
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderRest;
