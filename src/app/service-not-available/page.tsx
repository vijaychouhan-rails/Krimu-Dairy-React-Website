"use client";

import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function ServiceNotAvailablePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold mb-4">Service not found in your area</h1>
      <p className="mb-6 text-muted-foreground">
        We currently do not provide service at your location. Please try another location or check back later.
      </p>
      <Link href="/">
        <Button variant="default">Go back to Home</Button>
      </Link>
    </div>
  );
}
