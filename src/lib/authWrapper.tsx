"use client";
import { usePathname, useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import React, { useEffect } from 'react'

type SimpleRouter = {
  replace: (url: string) => void;
};

function requireAuthCSR(pathname: string, router: SimpleRouter, redirectTo: string = "/login") {
    const cookiesClient = parseCookies();
    const token = cookiesClient["auth_token"];
    
    if(!token){
        if (!["/login", "/signup"].includes(pathname)) {
            router.replace(redirectTo);
        }
    }else {
        if (["/login", "/signup", "/forgotPassword"].includes(pathname)) {
        router.replace("/");
        }
    }

    return token;
}

//HOC
export function authWrapper<P extends object>(WrapperComponent: React.ComponentType<P>) {

  const WithAuth = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(()=>{
        requireAuthCSR(pathname, router); // client-side guard
    }, [pathname, router]);

    return <WrapperComponent {...props} />;
  }
  return WithAuth;
}