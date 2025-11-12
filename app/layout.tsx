// "use client";

// import "./globals.css";
// import Link from "next/link";
// import { ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import { SessionProvider, useSession, signOut } from "next-auth/react";

// // ✅ Navbar Component (shows login/logout based on session)
// function Navbar() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   return (
//     <nav className="flex justify-between items-center p-6 bg-blue-600 text-white shadow">
//       {/* 🔷 Brand / Home Link */}
//       <Link href="/" className="text-2xl font-bold hover:opacity-90">
//         Recover Cart
//       </Link>

//       {/* 🔗 Navigation Links */}
//       <div className="flex items-center space-x-4">
//         <Link href="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         <Link href="/dashboard/connect-shopify" className="hover:underline">
//           Connect Shopify
//         </Link>

//         {/* 🧑‍💻 Auth Buttons */}
//         <button
//           onClick={() => {
//             // Remove the stored token
//             localStorage.removeItem("authToken");

//             // Optionally clear any user-related state (if using Redux, Context, etc.)

//             // Redirect to login page
//             router.push("/login");
//           }}
//           className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

// // ✅ Wrap entire app with SessionProvider
// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased bg-gray-50 text-gray-900">
//         <SessionProvider>
//           <Navbar />
//           <main className="p-8">{children}</main>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import "./globals.css";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  };

  // Run once on mount and listen for storage changes (from other tabs)
  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Re-check auth whenever the pathname changes (route change in app router)
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  // ✅ Handle login
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-blue-600 text-white shadow">
      {/* 🔷 Brand / Home Link */}
      <Link href="/" className="text-2xl font-bold hover:opacity-90">
        Recover Cart
      </Link>

      {/* 🔗 Navigation Links */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/dashboard/connect-shopify" className="hover:underline">
          Connect Shopify
        </Link>

        {/* 🧑‍💻 Auth Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-medium transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <SessionProvider>
          <Navbar />
          <main className="p-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
