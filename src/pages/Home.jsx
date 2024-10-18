import {  useState } from "react";
import { Link } from "react-router-dom";
import { LuContact2, LuPhoneCall } from "react-icons/lu";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoPowerSharp, IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
const Home = () => {

const [show,setShow] = useState(false)
const [isHide,setIsHide] = useState(true)

    return (
        <div className="overflow-hidden">
           <nav className="border-b">
            <div className="flex items-center justify-between py-4 px-6  relative">
                <h1 className="text-2xl font-bold">Chitchatly</h1>
                <div onClick={()=>setIsHide(!isHide)} className="md:hidden"><span><IoIosMenu /></span></div>
                <div className="flex items-center w-1/3">
                    <input type="text" name="" id=""  placeholder=" Search a Friend" className="min-w-[220px] w-full border outline-0 py-2 px-3"/>
                </div>
                <div onClick={()=>setShow(!show)} className="logo">
                        <button><img src="/user.png" alt=""  className="w-12 h-12 rounded-full"/> </button>    
                </div>

                     <div
                        className={`bg-[#f7f7f8] h-screen min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col absolute top-full right-0 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ transform: `translateX(${show ? '0' : '100%'})`, zIndex: 100 }}
                    >
                    <ul className="space-y-3 flex-1 mt-6">
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <IoMdNotificationsOutline className="w-[18px] h-[18px] text-lg mr-4"/>
                                <span>Notification</span>
                                <span className="bg-red-400 w-[18px] h-[18px] flex items-center justify-center text-white text-[11px] font-bold ml-auto rounded-full">7</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                            <CgProfile className="w-[18px] h-[18px] mr-4 text-lg"/>
                                <span className="capitalize">Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                            <LuContact2 className="w-[18px] h-[18px] mr-4 text-lg"/>
                                <span className="capitalize">contact</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                            <AiTwotoneMessage className="w-[18px] h-[18px] mr-4 text-lg"/>
                                <span className="capitalize">Message</span>
                            </Link>
                        </li>
                        
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                            <LuPhoneCall className="w-[18px] h-[18px] mr-4 text-lg"/>
                                <span className="capitalize">call</span>
                            </Link>
                        </li>
                      
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                            
                                <IoPowerSharp className="w-[18px] h-[18px] mr-4 text-lg"/>
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
         
            <aside className={`bg-[#f7f7f8] h-screen min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col fixed top-[87px] md:top-0 left-0 transition-all duration-500 ${
                    isHide ? '-left-full' : 'left-0'
                } md:relative md:left-0`}
            >

                   <div className="flex justify-between items-center">
                   <h2 className="text-2xl capitalize">contact</h2> <button><IoSearch className=" text-2xl mr-4"/></button>
                    </div> 
                    <ul className="space-y-3 flex-1 mt-6">
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-black hover:text-[#077fbb] text-sm flex items-center gap-3 hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                <img src="/user.png" alt=""  className="w-8 h-8 rounded-full "/>
                                <span>md.main uddin</span>
                            </Link>
                        </li>
                        
                    </ul>
                </aside>
                <main className="w-full md:w-[calc(100vw-260px)] h-screen bg-red-100">
                    <div>
                        <h2>home page</h2>
                        {/* name:{userData?.username}<br></br>
                        email:{userData?.email}
                        creatAt:{userData?.timestamp} */}
                    </div>
                </main>
            </div>
        
        </div>
    );
};

export default Home;

// import React, { useEffect, useRef, useState } from "react";
// import a1 from "../../../public/n1.jpg";
// import { GalleryIcon } from "../../SVG Icons/GalleryIcon";
// import { SmileIcon } from "../../SVG Icons/SmileIcon";
// import { useSelector } from "react-redux";
// import { getDatabase, onValue, push, ref, set } from "firebase/database";
// import EmojiPicker from "emoji-picker-react";
// import { getDownloadURL, getStorage, ref as Ref, uploadBytes } from "firebase/storage";
// import { AudioRecorder } from "react-audio-voice-recorder";

// export const Chatting = () => {
//   const activeFriend = useSelector((single) => single.Active.active);
//   const user = useSelector((user) => user.login.logIn);
//   const [sms, setSms] = useState("");
//   const [allSms, setAllSms] = useState([]);
//   const db = getDatabase();
//   const storage = getStorage();
//   const scrollRef = useRef();
//   const [emoji, setEmoji] = useState(false);

//   const handleSend = () => {
//     if (activeFriend?.status === "single") {
//       set(push(ref(db, "messages")), {
//         sendarName: user.displayName,
//         sendarId: user.uid,
//         receiverName: activeFriend.name,
//         receiverId: activeFriend.id,
//         message: sms,
//         date: new Date().toISOString(),
//       }).then(() => {
//         setSms("");
//         setEmoji(false);
//       });
//     }
//   };

//   useEffect(() => {
//     onValue(ref(db, "messages/"), (snapshot) => {
//       let signleSmsArr = [];
//       snapshot.forEach((item) => {
//         if (
//           (user.uid === item.val().sendarId && item.val().receiverId === activeFriend.id) ||
//           (user.uid === item.val().receiverId && item.val().sendarId === activeFriend.id)
//         ) {
//           signleSmsArr.push(item.val());
//         }
//       });
//       setAllSms(signleSmsArr);
//     });
//   }, [activeFriend?.id]);

//   const handleEmojiSend = ({ emoji }) => {
//     setSms(sms + emoji);
//   };

//   const addAudioElement = (blob) => {
//     const storageRef = ref(storage, audios/${user.uid}/${Date.now()}.webm);
    
//     uploadBytes(storageRef, blob).then((snapshot) => {
//       console.log("Uploaded a blob or file!", snapshot);
//       getDownloadURL(snapshot.ref).then((downloadURL) => {
//         set(push(ref(db, "messages")), {
//           sendarName: user.displayName,
//           sendarId: user.uid,
//           receiverName: activeFriend.name,
//           receiverId: activeFriend.id,
//           audio: downloadURL,
//           date: new Date().toISOString(),
//         });
//       });
//     });
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [allSms]);

//   const handleSendButton = (e) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   return (
//     <div classNameName="m-3 bg-white rounded-md">
//       <div>
//         <div classNameName="flex items-center gap-x-2 mb-5 bg-[#232323] py-3 rounded-t-md px-10">
//           <div classNameName="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
//             <img classNameName="object-cover w-full h-full rounded-full" src={activeFriend.profile || a1} alt="" />
//           </div>
//           <h2 classNameName="text-xl text-white">
//             {activeFriend?.name || "please select your friend for chatting"}
//           </h2>
//         </div>

//         <div classNameName="w-full h-[470px] bg-white overflow-y-auto">
//           {activeFriend?.status === "single"
//             ? allSms.map((item, i) => (
//                 <div key={i} ref={scrollRef}>
//                   {item.sendarId === user.uid ? (
//                     <div classNameName="flex flex-col items-end w-1/2 ml-auto">
//                       {item.audio ? (
//                         <audio controls src={item.audio}></audio>
//                       ) : (
//                         <p classNameName="inline-block p-3 mb-2 text-white bg-blue-600 rounded-t-md rounded-l-md">
//                           {item.message}
//                         </p>
//                       )}
//                       <span classNameName="text-zinc-500">{item.date}</span>
//                     </div>
//                   ) : (
//                     <div classNameName="flex flex-col items-start w-1/2 mr-auto">
//                       {item.audio ? (
//                         <audio controls src={item.audio}></audio>
//                       ) : (
//                         <p classNameName="inline-block p-3 mb-2 text-white bg-gray-400 rounded-t-md rounded-r-md">
//                           {item.message}
//                         </p>
//                       )}
//                       <span classNameName="text-zinc-500">{item.date}</span>
//                     </div>
//                   )}
//                 </div>
//               ))
//             : ""}
//         </div>

//         <div classNameName="mx-auto w-[532px] bg-white flex items-center justify-between rounded-md px-3">
//           <div classNameName="flex items-center gap-x-3">
//             <div classNameName="relative cursor-pointer">
//               {emoji && (
//                 <div classNameName="absolute -left-5 bottom-10">
//                   <EmojiPicker onEmojiClick={handleEmojiSend} />
//                 </div>
//               )}
//               <div onClick={() => setEmoji(!emoji)}>
//                 <SmileIcon />
//               </div>
//             </div>
//             <div classNameName="cursor-pointer" onClick={() => choseFile.current.click()}>
//               <GalleryIcon />
//             </div>
//             <input onChange={handleImageSend} hidden ref={choseFile} type="file" />

//             <AudioRecorder
//               onRecordingComplete={addAudioElement}
//               audioTrackConstraints={{
//                 noiseSuppression: true,
//                 echoCancellation: true,
//               }}
//               downloadOnSavePress={true}
//               downloadFileExtension="webm"
//             />
//           </div>

//           <input
//             onChange={(e) => setSms(e.target.value)}
//             classNameName="w-full px-5 py-2 outline-none"
//             type="text"
//             placeholder="send your message"
//             value={sms}
//             onKeyUp={handleSendButton}
//           />

//           <button
//             onClick={handleSend}
//             classNameName="text-center bg-[#4A81D3] text-white text-base w-[98px] py-2 rounded-md"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

