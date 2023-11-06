"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginIcon } from "@/icons";
import { useState, useCallback } from "react";
import { default as LoginSection } from "./login-section";
import { usePicket } from "@picketapi/picket-react";
import { useRouter } from "next/router";

const LoginButton = () => {
  const [open, setOpen] = useState(false);
  const { loginWithRedirect, logout, authState } = usePicket();

  const handleLogin = useCallback(async () => {
    let auth = authState;
    console.log(auth);

    if (!auth) {
      await loginWithRedirect();
    }
  
    // // login failed
    // if (!auth) return;
  
    // // create a supabase access token
    // await fetch("/api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         accessToken: auth.accessToken,
    //     }),
    // });
  
    // redirect to their todos page
    // router.push("/dashboard");
  }, [authState, loginWithRedirect]);
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex sm:ml-4 sm:mt-0">
          {/* <button type="button">
            <LoginIcon className="h-10 w-10" />
          </button> */}
          <div className="flex flex-1 justify-end">
        <button className="h-12 w-40 px-4 py-2 border border-white bg-transparent text-white rounded-lg flex items-center justify-center font-semibold" >
          Login
        </button>
    </div>
        </div>
      </DialogTrigger>
      <DialogContent className="font-sans sm:max-w-[425px]">
        <LoginSection setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  
  );
};

export default LoginButton;
