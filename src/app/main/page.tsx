"use client"

import Topbar from "../components/topbar";
import Bottombar from "../components/bottombar";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { TimetableEvent } from "./timetableevent_type";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import Image from "next/image";

export default function MainPage(){
    const [timetable, setTimetable] = useState<TimetableEvent[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // 월 ~ 금
    const hoursOfDay = Array.from({ length: 13 }, (_, index) => index + 8); // 8시부터 20시까지
    const router = useRouter();
    
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if (user){
                setUser(user);
            }else{
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("로그아웃 실패", error)
        }
    }
    const TimeTableToGo = (e:any) => {
        e.preventDefault();
        router.push("/timetable");
    };

    const BoardToGo = (e:any) => {
        e.preventDefault();
        router.push("/board");
    };


    const MyAccountToGo = (e:any) => {
        e.preventDefault();
        router.push("/account");
    };
    return(
        <div className="min-h-screen flex flex-col relative">
            {/* Topbar */}
            <nav className="flex bg-main-color h-16">
                <div className="flex-auto flex items-center">
                    <Image className="ml-4" src="/main_logo.png" width={50} height={50} alt="main_logo"/>
                    {user &&(
                        <span className="border-l-2 pl-4 border-white text-sm text-white ml-2">Hello, <span className="font-bold">{user.email}</span>, <br/>a Berkeley college student.</span>
                    )}
                </div>
                <div className="flex-auto flex items-center justify-end hidden md:flex space-x-4">
                    <div className="flex-auto text-white">
                        <ul className="flex list-none p-5">
                            <li className="mr-4 hover:underline" style={{cursor: 'pointer'}} onClick={TimeTableToGo}>TimeTable</li>
                            <li className="hover:underline" style={{cursor: 'pointer'}} onClick={BoardToGo}>Board</li>
                        </ul>
                    </div>
                    <div className="space-x-4 mr-4">
                        <button className="bg-white rounded-full w-28 text-main-color border border-main-color font-medium hover:bg-main-color hover:text-white hover:border-1 hover:border-white h-8" onClick={MyAccountToGo}>My Account</button>
                        <button className="bg-white rounded-full w-24 text-main-color border border-main-color font-medium hover:bg-main-color hover:text-white hover:border-1 hover:border-white h-8" onClick={handleLogout}>Sign out</button>
                    </div>
                </div>
            </nav>
            {/* 시간표 UI */}
            <div className="flex justify-center">
                <main className="bg-white p-8 rounded-lg shadow-lg">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th></th>
                                {daysOfWeek.map((day, dayIndex) => (
                                <th key={dayIndex} className="text-center font-bold border p-2 min-w-[50px]">
                                    {day}
                                </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {hoursOfDay.map((hour, hourIndex) => (
                                <tr key={hourIndex}>
                                <td className="text-center font-bold border p-2">{`${hour}:00`}</td>
                                {daysOfWeek.map((day, dayIndex) => {
                                    const cellId = `${dayIndex + 1}-${hourIndex + 1}`;
                                    const eventsInCell = timetable.filter(
                                    (event) => event.day === dayIndex && event.startHour <= hour && event.endHour > hour
                                    );

                                    return (
                                    <td key={dayIndex} id={cellId} className="border p-2 min-w-[100px]" style={{ position: 'relative', width: '300px', height: '100px' }}>
                                        {eventsInCell.map((event, index) => (
                                        <div
                                            key={index}
                                            className="p-1"
                                            style={{
                                            backgroundColor: event.color,
                                            position: 'absolute',
                                            top: `${(event.startHour - hour) * 100}px`, // 시간 당 100px로 위치 조절
                                            height: `${(event.endHour - event.startHour) * 100}px`, // 시간 간격에 따라 높이 설정
                                            left: 0,
                                            right: 0,
                                            color: '#ffffff', // 텍스트 컬러
                                            }}
                                        >
                                            {event.title} ({event.room})
                                        </div>
                                        ))}
                                    </td>
                                    );
                                })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </main>

                {/* 안내 문구 */}
                <div className="p-4 flex flex-col gap-y-4">
                    {/* gototimetable */}
                    <div className="p-4 bg-[#6366F1] text-white">
                        <p className="font-bold p-8 text-3xl ml-4">Welcome!<br/>This is TeaTime.</p>
                        <p className="ml-12 font-semi">We provide a lot of university information and a service that allows you to create<br/> your own timetable. If you create a teatime timetable, your college life will become easier. Click the button below to create your timetable! Then click on the lecture in your schedule to check the information!</p>
                        <div className="p-12">
                            <button onClick={TimeTableToGo} className="flex items-center border-2 border-white p-4 overflow-hidden hover:text-[#6366F1] hover:bg-white">
                                Create TimeTable<ChevronRightIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 bg-[#D9D9D9] text-[#6B7280] h-full grid place-items-center">
                        <p className="text-2xl font-bold">There is no courses selected.</p>
                    </div>
                </div>
            </div>

            {/* Board & News */}
            {/* <hr className="bg-[#D9D9D9] h-px"/>
            <div className="flex flex-row">
                <div className="basis-2/3">
                    <div className="">
                        <br/>
                        <p className="text-2xl font-bold text-center">Board</p>
                        <p className="text-center mt-16">I'm sorry. This function is Developing now...</p>
                    </div>
                </div>
                <div className="basis-1/3 border-l-2">
                    <div>
                        <div>
                            <br/>
                            <p className="text-2xl font-bold text-center">News</p>
                            <br/>
                            <ul className="p-2">
                                <li className="border-2 p-2">
                                    <p className="text-base font-bold">title1</p>
                                    <p className="text-sm font-normal">contents</p>
                                </li>
                                <li className="border-2 p-2 mt-4">
                                    <p className="text-base font-bold">title1</p>
                                    <p className="text-sm font-normal">contents</p>
                                </li>
                                <li className="border-2 p-2 mt-4">
                                    <p className="text-base font-bold">title1</p>
                                    <p className="text-sm font-normal">contents</p>
                                </li>
                                <li className="border-2 p-2 mt-4">
                                    <p className="text-base font-bold">title1</p>
                                    <p className="text-sm font-normal">contents</p>
                                </li>
                                <li className="border-2 p-2 mt-4">
                                    <p className="text-base font-bold">title1</p>
                                    <p className="text-sm font-normal">contents</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> */}
            <Bottombar/>
        </div>
    )
}
