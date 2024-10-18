import { useState } from "react";
import { Link } from "react-router-dom";
import { LuContact2, LuPhoneCall } from "react-icons/lu";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoPowerSharp, IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import useAuth from "../hooks/useAuth";
const Home = () => {
const {user, logOut}=useAuth()
    const [show, setShow] = useState(false)
    const [isHide, setIsHide] = useState(true)
    console.log(user.email);
    return (
        <div className="overflow-hidden">
            <nav className="border-b">
                <div className="flex items-center justify-between py-4 px-6  relative">
                    <h1 className="text-2xl font-bold">Chitchatly</h1>
                    <div onClick={() => setIsHide(!isHide)} className="md:hidden"><span><IoIosMenu /></span></div>
                    <div className="flex items-center w-1/3">
                        <input type="text" name="" id="" placeholder=" Search a Friend" className="min-w-[220px] w-full border outline-0 py-2 px-3" />
                    </div>
                    <div onClick={() => setShow(!show)} className="logo">
                        <button><img src="/user.png" alt="" className="w-12 h-12 rounded-full" /> </button>
                    </div>

                    <div
                        className={`bg-[#f7f7f8] h-screen min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col absolute top-full right-0 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ transform: `translateX(${show ? '0' : '100%'})`, zIndex: 100 }}
                    >
                        <ul className="space-y-3 flex-1 mt-6">
                            <h2>{user.email}</h2>
                            <li>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                    <IoMdNotificationsOutline className="w-[18px] h-[18px] text-lg mr-4" />
                                    <span>Notification</span>
                                    <span className="bg-red-400 w-[18px] h-[18px] flex items-center justify-center text-white text-[11px] font-bold ml-auto rounded-full">7</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                    <CgProfile className="w-[18px] h-[18px] mr-4 text-lg" />
                                    <span className="capitalize">Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                    <LuContact2 className="w-[18px] h-[18px] mr-4 text-lg" />
                                    <span className="capitalize">contact</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                    <AiTwotoneMessage className="w-[18px] h-[18px] mr-4 text-lg" />
                                    <span className="capitalize">Message</span>
                                </Link>
                            </li>

                            <li>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                    <LuPhoneCall className="w-[18px] h-[18px] mr-4 text-lg" />
                                    <span className="capitalize">call</span>
                                </Link>
                            </li>

                            <li onClick={logOut}>
                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">

                                    <IoPowerSharp className="w-[18px] h-[18px] mr-4 text-lg" />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* 


*/}

            <div className="w-[1200px flex  relative">

                <aside className={`bg-[#f7f7f8] md:h-[calc(100vh-87px)] min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col fixed top-[87px] md:top-0  transition-all duration-500 ${isHide ? '-left-full' : 'left-0'
                    } md:relative md:left-0`}
                >

                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl capitalize">contact</h2> <button><IoSearch className=" text-2xl mr-4" /></button>
                    </div>
                    <ul className="space-y-3 flex-1 mt-6">
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt="" className="w-8 h-8 rounded-full " />
                                <span>md.main uddin</span>
                            </Link>
                        </li>

                    </ul>
                </aside>
                <main className="w-full md:w-[calc(100vw-292px)] h-[calc(100vh-87px)]  bg-red-100 flex flex-col justify-end">
                    <div>
                        <h2>home page</h2>
                    </div>
                    <div className="  w-full px-16 mb-6">
                        <input type="text" name="" id="" placeholder=" Search a Friend" className="min-w-[220px] w-full border outline-0 py-2 px-3" />
                    </div>
                </main>
            </div>

        </div>
    );
};

export default Home;
