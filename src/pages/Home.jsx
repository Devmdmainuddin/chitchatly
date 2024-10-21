import { useEffect, useRef, useState } from "react";
import Container from '../components/Container'
import useAuth from "../hooks/useAuth";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { getDatabase, onValue, push, ref, remove, set, } from "firebase/database";
import Swal from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import { RiChatDeleteFill } from "react-icons/ri";
import {
    getDownloadURL,
    getStorage,
    ref as Ref,
    uploadBytesResumable,
} from "firebase/storage";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friends";
import Userlist from "../components/Userlist";
import BlockUser from "../components/BlockUser";
import { useSelector } from "react-redux";
import { IoIosImages } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { LuContact2, LuPhoneCall } from "react-icons/lu";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoPowerSharp, } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdCancel, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import { TbPasswordUser } from "react-icons/tb";
import { GrDocumentUpdate } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import UpdatePasswordModel from "../components/modal/UpdatePasswordModel";
import UpdateProfileModal from "../components/modal/UpdateProfileModal";


const Home = () => {
    const { user, logOut } = useAuth()
    const [isHide, setIsHide] = useState(true)
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState([])
    const [sms, setSms] = useState("");
    const [userdata, setUserdata] = useState([]);
    const [show, setShow] = useState(false)
    const [userfilter, setUserfilter] = useState([]);
    const [userfilterTop, setUserfilterTop] = useState([]);
    const [friendrequestlist, setFriendrequestlist] = useState([]);
    const [friendlist, setFriendlist] = useState([]);
    // const [open,setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenpass, setIsOpenpass] = useState(false)
    let activechatname = useSelector((state) => state.activeChat);
    const data = useSelector((state) => state.user.userInfo);
    const db = getDatabase()
    const storage = getStorage();
    const choseFile = useRef();
// console.log(user);
    const handleSendAudio = (blob) => {
        if (!blob || blob.size === 0) {
            console.error('Invalid blob or recording failed');
            return;
        }
        // const url = URL.createObjectURL(blob);
        const audioFileName = `${user.displayName}-audio-${Date.now()}.webm`;
        const storageRef = Ref(storage, `${user.displayName}/sendaudio/${audioFileName}`);

        // Upload the audio blob to Firebase storage
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // setProgress(progress);
            console.log(progress);
            },
            (error) => {
                console.error('Audio upload error:', error);
            },
            () => {
                // Get the download URL for the audio file
                getDownloadURL(uploadTask.snapshot.ref).then((audioUrl) => {
                    const newMessageRef = push(ref(db, "messages"));
                    const uniqueId = newMessageRef.key;

                    // Save the message with the audio URL in the Realtime Database
                    set(push(ref(db, "messages")), {
                        id: uniqueId,
                        sendarName: user.displayName,
                        sendarId: user.uid,
                        receiverid: activechatname.active.id,
                        receivername: activechatname.active.name,
                        message: sms,
                        audio: audioUrl, // Save the audio URL
                        date: new Date().toISOString(),
                    }).then(() => {
                        setSms('');
                        console.log('Audio message sent successfully');
                    }).catch((error) => {
                        console.error('Error sending audio message:', error);
                    });
                });
            }
        );
    };

    // .............


    // sms messaging
    const handleSend = () => {
        if (sms.trim() === "") return; // Ensure there is a message to send

        // Only send new message if not in edit mode (i.e., editId is null)

        if (!editId && activechatname?.active?.status === "single") {
            const newMessageRef = push(ref(db, "messages"));
            const uniqueId = newMessageRef.key;
            set(push(ref(db, "messages")), {
                id: uniqueId,
                sendarName: user.displayName,
                sendarId: user.uid,
                receiverid: activechatname.active.id,
                receivername: activechatname.active.name,
                message: sms,
                date: new Date().toISOString(),
            }).then(() => {
                setSms(""); // Clear input field after sending
                console.log("Message sent successfully");
            }).catch((error) => {
                console.error("Error sending message:", error);
            });
        }
    };

    const handleEdit = (msg) => {
        console.log("Editing message ID:", msg.id);
        console.log("Editing message content:", msg.message);
        setSms(msg.message);
        setEditId(msg.id);
    };


    const handleUpdate = () => {
        if (editId && sms.trim() !== "") {
            const messageRef = ref(db, `messages/${editId}`);
            set(messageRef, {
                ...message.find(m => m.id === editId),
                message: sms,
                date: new Date().toISOString()
            }).then(() => {
                setSms("");
                setEditId(null);
                setEditId('');
                remove(messageRef).then(() => {
                    console.log("Message deleted successfully.");
                })
            });
        }
    };



    //  get message  from db  
    useEffect(() => {
        const chatRef = ref(db, "messages");
        onValue(chatRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (
                    (item.val().sendarId === data?.uid &&
                        item.val().receiverid === activechatname?.active?.id) ||
                    (item.val().receiverid === data?.uid &&
                        item.val().sendarId === activechatname?.active?.id)
                ) {
                    arr.push(item.val());
                }
            });
            setMessage(arr);
        });
    }, [activechatname?.active?.id, data?.uid, db]);


    const handleDelete = (id) => {
        if (id) {
            const messageRef = ref(db, `messages/${id}`);
            remove(messageRef).then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Message deleted successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }).catch((error) => {
                console.error("Error deleting message: ", error);
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: ` Error deleting message: ${error}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        }
    };
    // ..................................

    // image upload function
    const handleUpload = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (!file) {
            console.error("No file selected");
            return;
        }
        const storageRef = Ref(storage, `${user.displayName}=sendimages/ ${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // setProgress(progress);
                console.log(progress);
            },
            (error) => {
                console.error("Upload error:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    const newMessageRef = push(ref(db, "messages"));
                    const uniqueId = newMessageRef.key;
                    set(push(ref(db, "messages")), {

                        // message: sms,
                        id: uniqueId,
                        sendarName: user.displayName,
                        sendarId: user.uid,
                        receiverid: activechatname.active.id,
                        receivername: activechatname.active.name,
                        message: sms,
                        image: url,
                        date: new Date().toISOString(),
                    }).then(() => {
                        setSms("");
                    });
                });
            }
        );
    };

    // useEffect(() => {
    //     if (!user) {
    //         navigate("/login");
    //     }
    // }, [user, navigate]);


    useEffect(() => {
        const starCountRef = ref(db, "users/");
        onValue(starCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data?.uid != item.key) {
                    arr.push({ ...item.val(), userid: item.key });
                }
            });
            setUserdata(arr);
        });
    }, [data?.uid, db]);
    // friendrequest send
    let handlefriendrequest = (item) => {
        set(push(ref(db, "friendrequest/")), {
            sendername: data.displayName,
            senderid: data.uid,
            receivername: item.username,
            receiverid: item.userid,
        });
    };

    // friendrequest friend
    useEffect(() => {
        const starCountRef = ref(db, "friendrequest/");
        onValue(starCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().receiverid + item.val().senderid);
            });
            setFriendrequestlist(arr);
        });
    }, [db]);
    // friend
    useEffect(() => {
        const fCountRef = ref(db, "friend/");
        onValue(fCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().receiverid + item.val().senderid);
            });
            setFriendlist(arr);
        });
    }, [db]);


    // search
    let handlesearch = (e) => {
        let arr = [];
        if (e.target.value.length == 0) {
            setUserfilter(arr);
        } else {
            userdata.filter((item) => {
                if (
                    item.username.toLowerCase().includes(e.target.value.toLowerCase())
                ) {
                    arr.push(item);
                }
                setUserfilter(arr);
            });
        }
    };
    let handlHeaderesearch = (e) => {
        let arr = [];
        if (e.target.value.length == 0) {
            setUserfilterTop(arr);
        } else {
            userdata.filter((item) => {
                if (
                    item.username.toLowerCase().includes(e.target.value.toLowerCase())
                ) {
                    arr.push(item);
                }
                setUserfilterTop(arr);
            });
        }
    };


    // ............................
    return (
     

            <div className="px-6">
                <Container>
                    <div className="relative ">
                        <header className="">
                            <nav className={`border-b relative } `}>
                                <div className="flex items-center justify-between py-4 px-6   ">
                                    <h1 className="text-2xl font-bold">Chitchatly</h1>
                                    <div onClick={() => setIsHide(!isHide)} className="md:hidden"><span><IoIosMenu /></span></div>
                                    <div className="flex items-center w-1/3">
                                        <input onChange={handlHeaderesearch} type="text" name="" id="" placeholder=" Search a Friend" className="min-w-[220px] w-full border outline-0 py-2 px-3" />
                                    </div>
                                    <div onClick={() => setShow(!show)} className="logo ">
                                        <button><img src={user.photoURL ? user.photoURL :'/user.png'} alt="" className="w-12 h-12 rounded-full" /> </button>
                                        <div className={` z-50 w-[365px] px-6 absolute top-full left-1/2 -translate-x-1/2 bg-slate-400  ${userfilterTop.length > 3 ? 'h-[235px] overflow-y-scroll' : ''}`}>
                                        {userfilterTop.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-3  border-b border-b-[#d1d1d1] hover:text-[#077fbb]  hover:bg-gray-200  transition-all duration-500  border-t-[none] py-3">
                                                <div>
                                                    <div className="w-8 h-8 rounded-full">
                                                        <img
                                                            className="w-full h-full object-cover rounded-full "
                                                            src={data.photoURL ? data.photoURL :'/user.png'}
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-center mx-auto">{item.username.slice(0, 16)}</h3>

                                                <div className="p-2">
                                                    {friendlist.includes(item.userid + data.uid) ||
                                                        friendlist.includes(data.uid + item.userid) ? (
                                                        <p className="text-[#166324] bg-slate-200 p-1 text-sm text-center rounded-sm">Frend</p>
                                                    ) : friendrequestlist.includes(item.userid + data.uid) ||
                                                        friendrequestlist.includes(data.uid + item.userid) ? (
                                                        <p className="text-red-600 text-lg text-center"><MdCancel /></p>
                                                    ) : (

                                                        <p
                                                            onClick={() => handlefriendrequest(item)}
                                                            className="text-[#214035] text-lg text-center"
                                                        >
                                                            <MdOutlinePersonAddAlt />
                                                        </p>
                                                    )}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                    </div>

                                    <div
                                        className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col absolute top-full right-0 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full '}`}
                                        style={{ transform: `translateX(${show ? '0 ' : '100% '})`, zIndex: 100 }}
                                    >

                                        <ul className="space-y-3 flex-1 mt-6">
                                            <h2>{user?.displayName}</h2>
                                           
                               
                                            {/* <li>
                                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all relative">
                                                    <IoMdNotificationsOutline className="w-[18px] h-[18px] text-lg mr-4" />
                                                    <span>Notification</span>
                                                    <span className="bg-red-400 w-[18px] h-[18px] flex items-center justify-center text-white text-[11px] font-bold ml-auto rounded-full">7</span>
                                                </Link>
                                            </li> */}
                                            {/* <li  onClick={() => setOpen(true)}>
                                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                                    <CgProfile className="w-[18px] h-[18px] mr-4 text-lg" />
                                                    <span className="capitalize">Views Profile</span>
                                                </Link>
                                            </li> */}
                                            <li onClick={() => setIsOpen(true)} >
                                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                                    <LuContact2 className="w-[18px] h-[18px] mr-4 text-lg" />
                                                    <span className="capitalize"> update profile</span>
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsOpenpass(true)}>
                                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                                    <TbPasswordUser className="w-[18px] h-[18px] mr-4 text-lg" />
                                                    <span className="capitalize"> password change</span>
                                                </Link>
                                            </li>

                                            {/* <li>
                                                <Link className="text-black hover:text-[#077fbb] text-sm flex items-center hover:bg-gray-200 rounded px-4 py-3 transition-all">
                                                    <LuPhoneCall className="w-[18px] h-[18px] mr-4 text-lg" />
                                                    <span className="capitalize">call</span>
                                                </Link>
                                            </li> */}

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
                        </header>
                    </div>

                    <div className=" flex  relative  overflow-hidden ">
                        {/* md:h-[calc(100vh-87px)] */}
                        <aside className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col fixed top-[87px] md:top-0  transition-all duration-500 ${isHide ? '-left-full' : 'left-0'
                            } md:relative md:left-0`}
                        >
                            <FriendRequest />
                            <Friends />
                            <Userlist handlefriendrequest={handlefriendrequest} userdata={userdata} friendrequestlist={friendrequestlist} friendlist={friendlist} userfilter={userfilter} handlesearch={handlesearch} />
                            <BlockUser />
                        </aside>
                        <main className="w-full md:w-[calc(100vw-260px)]    bg-[url('/bg-o.svg')] bg-cover bg-no-repeat flex flex-col justify-end">
                            <div>
                                {activechatname?.active?.status === "single" ?
                                    (
                                        <div className="overflow-hidden flex flex-col items-stretch">
                                            {/* Chat Header with Friend's Profile */}
                                            <div className="flex items-center gap-x-2 mb-5 bg-[#325f49] py-3 rounded-t-md px-10">
                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                                                    <img
                                                        className="object-cover w-full h-full rounded-full"
                                                        src={activechatname.profile || '/user.png'}
                                                        alt=""
                                                    />
                                                </div>
                                                <h2 className="text-xl text-white ">
                                                    {activechatname?.active?.name}
                                                </h2>
                                            </div>

                                            {/* Message List */}
                                            <ul className="h-screen overflow-y-scroll relative">
                                                {message.map((msg, index) => (
                                                    <li key={index} className="my-6">
                                                        {/* Check if it's the current user's message */}
                                                        {msg.sendarId === user.uid ?
                                                            (
                                                                <div className="flex gap-2 justify-end">
                                                                    {msg.image ?
                                                                        (
                                                                            <div className="flex flex-col items-end mb-2">
                                                                                <img src={msg.image} className="w-[100px] h-[100px] object-cover" />
                                                                                <span className="text-white text-xs mt-1">{new Date(msg.date).toLocaleString("en-US", {
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                    hour12: true,
                                                                                })}</span>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        msg.audio ? (<audio controls>
                                                                            <source src={msg.audio} type="audio/webm" />
                                                                            Your browser does not support the audio element.
                                                                        </audio>)
                                                                            :
                                                                            (
                                                                                <div className="">
                                                                                    <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl ">
                                                                                        {msg.message}
                                                                                    </p>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {new Date(msg.date).toLocaleString("en-US", {
                                                                                            year: "numeric",
                                                                                            month: "long",
                                                                                            day: "numeric",
                                                                                            hour: "2-digit",
                                                                                            minute: "2-digit",
                                                                                            hour12: true,
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <button onClick={() => handleEdit({ ...msg, id: msg.id })}>
                                                                                            <CiEdit className="text-[#f9f9f9] text-xl" />
                                                                                        </button>
                                                                                        <button onClick={() => handleDelete(msg.id)}><RiChatDeleteFill className="text-red-600 text-xl" /></button>
                                                                                    </div>
                                                                                </div>
                                                                            )}


                                                                </div>
                                                            )
                                                            :
                                                            //             (
                                                            //                 <div className="flex gap-2 justify-start">
                                                            //                     <div className="">
                                                            //                         <p className="bg-gray-700 text-white p-3 rounded-2xl">
                                                            //                             {msg.message}
                                                            //                         </p>
                                                            //                         <div className="text-xs text-gray-500">
                                                            //                             {new Date(msg.date).toLocaleString("en-US", {
                                                            //                                 year: "numeric",
                                                            //                                 month: "long",
                                                            //                                 day: "numeric",
                                                            //                                 hour: "2-digit",
                                                            //                                 minute: "2-digit",
                                                            //                                 hour12: true,
                                                            //                             })}
                                                            //                         </div>


                                                            //                         <div className="flex gap-2">
                                                            //                             {/* <button onClick={() => handleEdit({ ...msg, id: msg.id })}>
                                                            //         <CiEdit className="text-[#f9f9f9] text-xl" />
                                                            //     </button>
                                                            //     <button onClick={() => handleDelete(msg.id)}><RiChatDeleteFill className="text-red-600 text-xl" /></button>
                                                            //  */}
                                                            //                         </div>

                                                            //                     </div>
                                                            //                 </div>
                                                            //             )
                                                            (
                                                                <div className="flex gap-2 justify-start">
                                                                    {msg.image ?
                                                                        (
                                                                            <div className="flex flex-col items-end mb-2">
                                                                                <img src={msg.image} className="w-[100px] h-[100px] object-cover" />
                                                                                <span className="text-white text-xs mt-1">{new Date(msg.date).toLocaleString("en-US", {
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                    hour12: true,
                                                                                })}</span>
                                                                            </div>
                                                                        )
                                                                        :
                                                                        msg.audio ? (<audio controls>
                                                                            <source src={msg.audio} type="audio/webm" />
                                                                            Your browser does not support the audio element.
                                                                        </audio>)
                                                                            :
                                                                            (
                                                                                <div className="">
                                                                                    <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl ">
                                                                                        {msg.message}
                                                                                    </p>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {new Date(msg.date).toLocaleString("en-US", {
                                                                                            year: "numeric",
                                                                                            month: "long",
                                                                                            day: "numeric",
                                                                                            hour: "2-digit",
                                                                                            minute: "2-digit",
                                                                                            hour12: true,
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <button onClick={() => handleEdit({ ...msg, id: msg.id })}>
                                                                                            <CiEdit className="text-[#f9f9f9] text-xl" />
                                                                                        </button>
                                                                                        <button onClick={() => handleDelete(msg.id)}><RiChatDeleteFill className="text-red-600 text-xl" /></button>
                                                                                    </div>
                                                                                </div>
                                                                            )}


                                                                </div>
                                                            )

                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="flex justify-center items-center px-12 h-[425px]">
                                            <img
                                                src="/no-friend.png"
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                            </div>
                            <div>
                            <UpdatePasswordModel isOpen={isOpenpass} setIsOpen={setIsOpenpass} > </UpdatePasswordModel>
                            <UpdateProfileModal isOpen={isOpen} setIsOpen={setIsOpen} email={user?.email}></UpdateProfileModal>
                            </div>

                            {/* <progress value={progress} max="100" /> */}
                            <div>
                                <div className="flex items-center gap-1 w-1/2 justify-center mx-auto py-6">
                                    <div>
                                        <AudioRecorder
                                            onRecordingComplete={handleSendAudio}
                                            audioTrackConstraints={{
                                                noiseSuppression: true,
                                                echoCancellation: true,
                                            }}
                                            onNotAllowedOrFound={(err) => {
                                                console.table(err);

                                            }}
                                            downloadOnSavePress={false}
                                            downloadFileExtension="webm"
                                            mediaRecorderOptions={{
                                                audioBitsPerSecond: 128000,
                                            }}
                                        />
                                    </div>

                                    <div className=" text-[#f25169] ">
                                        <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
                                            <label htmlFor="file-upload" className="custom-file-upload">
                                                <IoIosImages className="text-2xl" />
                                            </label>
                                            <input id="file-upload" ref={choseFile} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

                                        </div>

                                    </div>
                                    <div className="flex">
                                        <input
                                            onChange={(e) => setSms(e.target.value)}
                                            value={sms}
                                            type="text" name="" id="" placeholder=" What's on your mind" className="min-w-[220px] w-full border outline-0 py-2 px-3 rounded-tl-full rounded-bl-full" />
                                        <button
                                            onClick={editId ? handleUpdate : handleSend}
                                            className="text-center  bg-[#f55eb9] text-white text-base w-[98px] py-1 rounded-tr-full rounded-br-full"
                                        >
                                            {editId ? "Update" : "Send"}
                                        </button>
                                    </div>

                                </div>
                            </div>


                        </main>
                    </div >
                </Container>
            </div >


    );
};

export default Home;
