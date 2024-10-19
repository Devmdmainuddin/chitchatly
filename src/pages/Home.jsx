import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LuContact2, LuPhoneCall } from "react-icons/lu";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoPowerSharp, IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import useAuth from "../hooks/useAuth";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { equalTo, getDatabase, limitToLast, onValue, orderByChild, push, query, ref, remove, set } from "firebase/database";
import Swal from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import { RiChatDeleteFill } from "react-icons/ri";
// import { FaRecordVinyl } from "react-icons/fa";

import {
    getDownloadURL,
    getStorage,
    ref as Ref,
    uploadBytesResumable,
} from "firebase/storage";
import FriendRequest from "../components/FriendRequest";
import FriendGropup from "../components/FriendGropup";


const Home = () => {
    const { user, logOut } = useAuth()
    const [show, setShow] = useState(false)
    const [isHide, setIsHide] = useState(true)
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState([])
    const [sms, setSms] = useState("");

    // image

    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState("");

    //   Audio Recording
    const [recordedUrl, setRecordedUrl] = useState('');

    //   Audio Recording
    const db = getDatabase()
    const storage = getStorage();
    const choseFile = useRef();
    // ..............
    const addAudioElement = (blob) => {
        if (blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setRecordedUrl(url);
        } else {
            console.error('Invalid blob or recording failed');
        }
    };

    // .............

    const handleSend = () => {
        if (sms.trim() === "") return;
        set(push(ref(db, "messages")), {
            sendarName: user.displayName,
            sendarId: user.uid,
            message: sms,
            date: new Date().toISOString()
        }).then(() => {
            setSms("");
        });
    }

    // const getMessages = async () => {
    //     const db = getDatabase();
    //     const messagesRef = ref(db, 'messages');

    //     try {
    //         const snapshot = await get(messagesRef);
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();

    //             setMessage(data) ; // You can return or set the data to state here
    //         } else {
    //             console.log("No data available");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data: ", error);
    //     }
    // };
    // const getMessagesByUserId = async (userId) => {
    //     const db = getDatabase();
    //     const messagesRef = ref(db, 'messages');

    //     // Create a query to find messages where 'sendarId' equals the given userId
    //     const userMessagesQuery = query(messagesRef, orderByChild('sendarId'), equalTo(userId));

    //     try {
    //         const snapshot = await get(userMessagesQuery);
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             console.log("Messages by user:", data);
    //             setMessage(Object.values(data)); // Return the filtered messages
    //         } else {
    //             console.log("No messages found for this user.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching messages: ", error);
    //     }
    // };


    // Fetch messages when the component mounts

    // Real-time listener for messages by userId
    const getMessagesByUserId = (userId) => {
        const messagesRef = ref(db, 'messages');
        const userMessagesQuery = query(messagesRef, orderByChild('sendarId'), equalTo(userId), limitToLast(3));

        // Set up real-time listener using onValue
        onValue(userMessagesQuery, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messagesArray = Object.values(data); // Convert data object to array
                setMessage(messagesArray);
            } else {
                // console.log("No messages found for this user.");
                setMessage([]); // Clear messages if none are found
            }
        });
    };


    useEffect(() => {
        if (user?.uid) {
            getMessagesByUserId(user.uid);
        }
        const messagesRef = ref(db, 'messages');
        const messagesQuery = query(messagesRef, orderByChild('sendarId'), equalTo(user.uid));

        const unsubscribe = onValue(messagesQuery, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedMessages = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setMessage(formattedMessages); // Get the last 10 messages
            } else {
                setMessage([]); // Clear messages if none found
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();

    }, [user.uid]);


    // Function to handle message editing
    const handleEdit = (msg) => {
        setSms(msg.message); 
        setEditId(msg.id); 
    };

    //    const handleUpdate = () => {
    //     if (editId && sms.trim() !== "") {
    //         const messageRef = ref(db, `messages/${editId}`); 
    //         set(messageRef, {
    //             ...message.find(m => m.id === editId), 
    //             message: sms, 
    //             date: new Date().toISOString() 
    //         }).then(() => {
    //             setSms(""); 
    //             setEditId(null); 
    //         });
    //     }
    // };

    // const handleUpdate = () => {
    //     if (editId && sms.trim() !== "") {
    //         const messageRef = ref(db, `messages/${editId}`); 
    //         set(messageRef, {
    //             sendarName: user.displayName, 
    //             sendarId: user.uid,
    //             message: sms, 
    //             date: new Date().toISOString() 
    //         }).then(() => {
    //             console.log("Message updated successfully.");
    //             setSms(""); // Clear the input
    //             setEditId(null); // Reset editId
    //         }).catch((error) => {
    //             console.error("Error updating message: ", error); 
    //         });
    //     } else {
    //         console.error("No editId or message content is empty."); 
    //     }
    // };

    const handleUpdate = () => {
        if (editId && sms.trim() !== "") {
            const messageRef = ref(db, `messages/${editId}`); // Reference to the specific message
            set(messageRef, {
                sendarName: user.displayName, // Include necessary fields
                sendarId: user.uid,
                message: sms, // Update the message content
                date: new Date().toISOString() // Update the date
            }).then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Message updated successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setSms(""); // Clear the input
                setEditId(null); // Reset editId
            }).catch((error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: `Error updating message: ${error}`,
                    showConfirmButton: false,
                    timer: 1500
                });

            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "No editId or message content is empty.",
                showConfirmButton: false,
                timer: 1500
            });

        }
    };

    // Function to delete a message from Firebase
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
    // ...................................*:first-letter:

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
                setProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageURL(url);
                    set(push(ref(db, "messages")), {
                        sendarName: user.displayName,
                        sendarId: user.uid,
                        // message: sms,
                        image: url,
                        date: new Date().toISOString()
                        
                    }).then(() => {
                        setSms("");

                    });
                });
            }
        );
    };



    // ............................
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
                        className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col absolute top-full right-0 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ transform: `translateX(${show ? '0' : '100%'})`, zIndex: 100 }}
                    >
                        <ul className="space-y-3 flex-1 mt-6">
                            <h2>{user.displayName}</h2>
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

            <div className="w-[1200px flex  relative">
{/* md:h-[calc(100vh-87px)] */}
                <aside className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col fixed top-[87px] md:top-0  transition-all duration-500 ${isHide ? '-left-full' : 'left-0'
                    } md:relative md:left-0`}
                >
                     <FriendRequest />
<FriendGropup></FriendGropup>
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
                <main className="w-full md:w-[calc(100vw-260px)] h-screen   bg-[url('/bg-o.svg')] bg-cover bg-no-repeat flex flex-col justify-end">
                    <div className="text-white flex-1 overflow-y-scroll">
                        <h2>home page</h2>
                        <h1>User Messages</h1>
                        <ul className="">
                            {message.map((msg, index) => (
                                <li key={index} className=" my-6">



                                    <div className="flex gap-2 justify-end ">
                                        <div className="">
                                            <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl "> {msg.message}</p>
                                            {/* <div><strong>Date:</strong> {new Date(msg.date).toLocaleString()}</div> */}
                                            <div> {new Date(msg.date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}</div>

                                            {/* <button onClick={() => handleEdit({ ...msg, id: index })}>Edit</button> */}
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit({ ...msg, id: msg.id })}><CiEdit className="text-[#f9f9f9] text-xl" /></button>
                                                <button onClick={() => handleDelete(msg.id)}><RiChatDeleteFill className="text-red-600 text-xl" /></button>
                                            </div>

                                        </div>
                                        <div>
                                            <img src={user.photoURL ? user.photoURL : '/user.png'} alt="" className="w-12 h-12 rounded-full" />
                                        </div>
                                    </div>

                                </li>
                            ))}


                            <div>
                            {imageURL && <img src={imageURL} alt="Uploaded"  className="w-12 h-12 object-cover"/>}

                                <br />

                                {recordedUrl && (
                                    <audio controls>
                                        <source src={recordedUrl} type="audio/webm" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}

                            </div>
                        </ul>

                    </div>

                    <div>
                    <div className="bg-slate-200   flex items-center">
                        <input type="file" ref={choseFile} accept="image/*" onChange={handleUpload} className="p-2" />
                        <progress value={progress} max="100" />
                        
                    </div>
                    </div>
                    

                    <div className="flex   w-full px-16 mb-6">
                        {/* <button onClick={startRecording}><FaRecordVinyl /></button> */}
                        <AudioRecorder
                            onRecordingComplete={addAudioElement}
                            audioTrackConstraints={{
                                noiseSuppression: true,
                                echoCancellation: true,
                            }}
                            onNotAllowedOrFound={(err) => {
                                console.table(err);

                            }}
                            downloadOnSavePress={true}
                            downloadFileExtension="webm"
                            mediaRecorderOptions={{
                                audioBitsPerSecond: 128000,
                            }}
                        />

                        <input
                            onChange={(e) => setSms(e.target.value)}
                            value={sms}
                            type="text" name="" id="" placeholder=" What's on your mind" className="min-w-[220px] w-full border outline-0 py-2 px-3 rounded-full" />

                        <button
                            onClick={editId ? handleUpdate : handleSend} // Call update if in edit mode
                            className="text-center -ml-6 bg-[#f55eb9] text-white text-base w-[98px] py-2 rounded-md"
                        >
                            {editId ? "Update" : "Send"} {/* Change button text based on state */}
                        </button>
                    </div>
                </main>
            </div >

        </div >
    );
};

export default Home;
