"use client";

import React from "react";
import { LogOut, Smartphone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { logoutOperation } from "@/services/auth";
import { destroyCookies } from "@/lib/appCookies";
import { clearCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Button } from "../components/ui/button";

function JoinedUser() {
  const dispatch = useDispatch();

  const logoutAuthMutation = useMutation({
    mutationFn: () => logoutOperation(),
  });

  const afterLogout = () => {
    destroyCookies();
    dispatch(clearCart());
    toast.success("Logout successful");
    setTimeout(() => {
      window.location.replace("/login");
    }, 800);
  };

  const handleLogout = () => {
    logoutAuthMutation.mutate(undefined, {
      onSuccess: afterLogout,
      onError: afterLogout,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6 space-y-6 text-center">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="h-7 w-7 text-blue-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">
            Dairy Already Joined
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            You have already joined a Dairy account.
            <br />
            Website access is disabled for you.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
          Please download and use our <span className="font-medium">mobile application</span> to continue
          managing your dairy services.
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          <p className="text-xs text-gray-400">
            Need help? Contact your Dairy administrator
          </p>
        </div>
      </div>
    </div>
  );
}

export default JoinedUser;
