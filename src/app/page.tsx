"use client"

import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e:any) =>{
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("로그인 성공", user)
            router.push("/main");
        } catch (error:any){
            console.error("로그인 실패", error.message);
        }
    };

    const handleEmailChange = (e:any) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e:any) => {
        setPassword(e.target.value);
    };

    const RegisterToGo = (e:any) => {
        e.preventDefault()
        router.push("/register")
    };

  return (
      <div className="flex flex-col h-screen items-center justify-center">
          <div className="flex">
              {/* Reigster Form */}
              <div className="flex-1 p-8 mr-20 mb-20 mt-20">
                  <div>
                      <p className="font-bold mb-20 text-3xl">Login</p>
                      <form>
                            <div className="mb-4">
                              <p className="font-medium ml-4 text-lg">Email</p>
                              <input name="email" value={email} onChange={handleEmailChange} className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                          </div>
                          <div className="mb-4">
                              <p className="font-medium ml-4 text-lg">Password</p>
                              <input name="password" value={password} onChange={handlePasswordChange} type="password" className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                          </div>
                            <div className="mt-20 flex justify-between">
                                <button onClick={RegisterToGo} className="hover:underline font-regular flex items-center"><ChevronLeftIcon className="h-6 w-6"/>Register</button>
                                <button type="submit" onClick={handleLogin} className="bg-main-color text-white font-medium py-2 px-4 hover:bg-input-hover-color rounded">confirm</button>
                            </div>
                      </form>
                  </div>
              </div>
              {/* Instructions */}
              <div className="flex-1 p-8 mt-8">
                  <div className="bg-input-color-1 rounded">
                      <div>
                          <div style={{ padding: "1rem" }}>
                              <p className="font-bold text-3xl">Instructions</p>
                              <ul className="list-disc list-inside font-regular mt-4">
                                  <li style={{padding: "1rem"}}>The service we are currently providing is for students at Berkeley University in California, USA.</li>
                                  <li className="mt-4" style={{padding: "1rem"}}>The service currently being provided is in the beta testing stage, and a full version will be released later.</li>
                                  <li className="mt-4" style={{padding: "1rem"}}>Login provides Toucan&apos;s own DB and proves security.</li>
                                  <li className="mt-4" style={{padding: "1rem"}}>The services currently provided are timetables and bulletin boards, and we plan to provide more services in the future.</li>
                                  <li className="mt-4" style={{padding: "1rem"}}>All these services are provided by Toucan.</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          {/* 하단 텍스트 */}
          <div className="text-center mb-4">
              <p className="font-light text-xs">© 2023. <span className="font-medium">TOUCAN</span> Co. all rights reserved.</p>
          </div>
      </div>
  )
}
