import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//Server Side Authentication
export async function  requireAuthSSR(redirectTo: string = "/login"){
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;;
    if(!token) redirect(redirectTo) //TODO: Should we you push
    return token;
}