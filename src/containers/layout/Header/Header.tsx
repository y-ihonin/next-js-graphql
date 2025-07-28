"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// hooks
import useUserProfile from "@/hooks/useUserProfile";

// helpers
import { NAVIGATION_ITEMS } from "./constants";

// components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Header = () => {
  const { data: userData, logout } = useUserProfile();
  const router = useRouter();

  // renders
  const renderAuthView = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none p-2"
        >
          <span className="font-medium text-gray-900 hidden sm:inline">
            {userData?.username || userData?.email}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderNonAuthView = () => (
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        onClick={() => router.push("/sign-in")}
        className="text-gray-600 hover:text-gray-900"
      >
        Sign in
      </Button>
      <Button
        onClick={() => router.push("/sign-up")}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Sign up
      </Button>
    </div>
  )

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={() => router.push("/")}
            >
              GraphQL 2FA
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {userData ? renderAuthView() : renderNonAuthView()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
