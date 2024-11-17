"use client";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Page() {
  const session = useSession();
  console.log(session);
    return <div>
    <button onClick={() => signIn()}>Signin</button>
    <button onClick={() => signOut()}>Sign out</button>
    {JSON.stringify(session.data?.user)}
  </div>
}