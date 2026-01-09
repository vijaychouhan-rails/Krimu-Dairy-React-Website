"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchAuth } from "@/lib/appCookies";

export default function GlobalAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  
  const authData = fetchAuth();
  const isDairyJoined = authData?.isDairyJoined;

  useEffect(() => {
    if (
      isDairyJoined &&
      pathname !== "/joined-dairy"
    ) {
      router.replace("/joined-dairy");
    }
  }, [isDairyJoined, pathname, router]);

  return null;
}
