import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Topbar(){

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const router = useRouter();
    const router1 = useRouter();
    const router2 = useRouter();
    const router3 = useRouter();

    const TimeTableToGo = (e:any) => {
        e.preventDefault();
        router.push("/timetable");
    };

    const BoardToGo = (e:any) => {
        e.preventDefault();
        router1.push("/board");
    };


    const MyAccountToGo = (e:any) => {
        e.preventDefault();
        router2.push("/account");
    };

    const SignOutToGo = (e:any) => {
        e.preventDefault();
        router3.push("/");
    };

    return (
        <>
        {/* Topbar */}
        <nav className="flex bg-main-color h-16">
                <div className="flex-auto flex items-center">
                    <Image className="ml-4" src="/main_logo.png" width={50} height={50} alt="main_logo"/>
                    <span className="border-l-2 pl-4 border-white text-sm text-white ml-2">Hello, <span className="font-bold">USERAME</span>, <br/>a Berkeley college student.</span>
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
                        <button className="bg-white rounded-full w-24 text-main-color border border-main-color font-medium hover:bg-main-color hover:text-white hover:border-1 hover:border-white h-8" onClick={SignOutToGo}>Sign out</button>
                    </div>
                </div>
            </nav>
        </>
    )
}