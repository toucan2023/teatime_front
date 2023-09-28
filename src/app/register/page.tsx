"use client"

import axios from "axios";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function Register() {
  const SEVER_URL = 'http://localhost:9999/'; // 임시로 만듬
  const [register, setregister] = useState<any[]>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(SEVER_URL + 'register');
      setregister(response.data);
    } catch (error) {
      console.error('Error fetching data :', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // 서버 값 보내는 onRegisterHandler 함수
  const onRegisterHandler = async (e:any) => {
    e.preventDefault();
    const nickname = e.target.nickname.value;
    const email = e.target.email.value;
    const id = e.target.id.value;
    const password = e.target.password.value;
    try {
      await axios.post(SEVER_URL + 'register', {nickname, email, id, password});
      fetchData();
      console.log(nickname, email, id, password);
    } catch(error) {
      console.error('Error register data :', error);
    }
  };

  const router = useRouter();
  const LoginToGo = (e:any) => {
      e.preventDefault()
      router.push('/')
  }

    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <div className="flex">
                {/* Reigster Form */}
                <div className="flex-1 p-8 mr-20 mb-20 mt-4">
                    <div>
                        <p className="font-bold mb-20 text-3xl">Register</p>
                        <form onSubmit={onRegisterHandler}>
                            <div className="mb-4">
                                <p className="font-medium ml-4 text-lg">NickName</p>
                                <input name="nickname" className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                            </div>
                            <div className="mb-4">
                                <p className="font-medium ml-4 text-lg">Email</p>
                                <input name="email" className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                            </div>
                            <div className="mb-4">
                                <p className="font-medium ml-4 text-lg">ID</p>
                                <input name="id" className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                            </div>
                            <div className="mb-4">
                                <p className="font-medium ml-4 text-lg">Password</p>
                                <input name="password" type="password" className="border bg-input-color-1 shadow-inner w-full py-2 px-3 h-12 focus:bg-white focus:border-main-color focus:outline-none rounded" />
                            </div>
                        <div className="mt-20 flex justify-between">
                            <button type="submit" className="bg-main-color text-white font-medium py-2 px-4 hover:bg-input-hover-color rounded">Register</button>
                            <button type="button" onClick={LoginToGo} className="hover:underline font-regular">Already Registered?</button>
                        </div>
                        </form>
                    </div>
                </div>
                {/* Instructions */}
                <div className="flex-1 p-8 mt-20">
                    <div className="bg-input-color-1 rounded">
                        <div>
                            <div style={{ padding: '1rem' }}>
                                <p className="font-bold text-3xl">Instructions</p>
                                <ul className="list-disc list-inside font-regular mt-4">
                                    <li style={{padding: '1rem'}}>The service we are currently providing is for students at Berkeley University in California, USA.</li>
                                    <li className="mt-4" style={{padding: '1rem'}}>The service currently being provided is in the beta testing stage, and a full version will be released later.</li>
                                    <li className="mt-4" style={{padding: '1rem'}}>Login provides Toucan&apos;s own DB and proves security.</li>
                                    <li className="mt-4" style={{padding: '1rem'}}>The services currently provided are timetables and bulletin boards, and we plan to provide more services in the future.</li>
                                    <li className="mt-4" style={{padding: '1rem'}}>All these services are provided by Toucan.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 하단 텍스트 */}
            <div className="text-center mb-12">
                <p className="font-light text-xs">© 2023. <span className="font-medium">TOUCAN</span> Co. all rights reserved.</p>
            </div>
        </div>
    )
}

