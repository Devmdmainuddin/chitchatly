import { useEffect, useRef, useState } from "react";

import useAuth from "../hooks/useAuth";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { equalTo, getDatabase, limitToLast, onValue, orderByChild, push, query, ref, remove, set } from "firebase/database";
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
import FriendGropup from "../components/FriendGropup";
import Friends from "../components/Friends";
import Userlist from "../components/Userlist";
import BlockUser from "../components/BlockUser";
import { useSelector } from "react-redux";


const Home = () => {
    const { user, } = useAuth()

    const [isHide, setIsHide] = useState(true)
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState([])
    let [msglist, setMsglist] = useState([]);
    const [sms, setSms] = useState("");
    let activechatname = useSelector((state) => state.activeChat);
    console.log(message);
    const data = useSelector((state) => state.user.userInfo);
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

    // const handleSend = () => {
    //     if (sms.trim() === "") return;
    //     if (activechatname.active.status == "single") {
    //         const newMsg = {
    //             sendarName: user.displayName,
    //             sendarId: user.uid,
    //             receiverid: activechatname.active.id,
    //             receivername: activechatname.active.name,
    //             message: sms,
    //             date: new Date().toISOString()
    //         };
    //         set(push(ref(db, "messages")), newMsg).then(() => {
    //             setSms("");
    //             // setMessage((prevMessages) => [...prevMessages, newMsg]);
    //         });


    //     } else {
    //         console.log("only friends messages");
    //     }

    // }
    const handleSend = () => {
        if (sms.trim() === "") return; // Ensure there is a message to send
    
        // Only send new message if not in edit mode (i.e., editId is null)
        if (!editId && activechatname?.active?.status === "single") {
            set(push(ref(db, "messages")), {
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
    // const getMessagesByUserId = (userId) => {
    //     const messagesRef = ref(db, 'messages');
    //     const userMessagesQuery = query(messagesRef, orderByChild('sendarId'), equalTo(userId), limitToLast(3));

    //     // Set up real-time listener using onValue
    //     onValue(userMessagesQuery, (snapshot) => {
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             const messagesArray = Object.values(data); // Convert data object to array
    //             setMessage(messagesArray);
    //         } else {
    //             // console.log("No messages found for this user.");
    //             setMessage([]); // Clear messages if none are found
    //         }
    //     });
    // };

    // single message by userId
    // useEffect(() => {
    //     if (user?.uid) {
    //         getMessagesByUserId(user.uid);
    //     }
    //     const messagesRef = ref(db, 'messages');
    //     const messagesQuery = query(messagesRef, orderByChild('sendarId'), equalTo(user.uid));

    //     const unsubscribe = onValue(messagesQuery, (snapshot) => {
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             const formattedMessages = Object.keys(data).map(key => ({
    //                 id: key,
    //                 ...data[key]
    //             }));
    //             setMessage(formattedMessages); // Get the last 10 messages
    //         } else {
    //             setMessage([]); // Clear messages if none found
    //         }
    //     });

    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();

    // }, [user.uid, db]);


    // Function to handle message editing

    //    singleMessage by friend
    console.log(data);



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

    //   message Update from db  

    const handleUpdate = () => {
        if (editId && sms.trim() !== "") {
            const messageRef = ref(db, `messages/${editId}`);
            set(messageRef, {
                sendarName: user.displayName,
                sendarId: user.uid,
                message: sms,
                date: new Date().toISOString()
            }).then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Message updated successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setSms("");
                setEditId(null); // Reset editId to null after update
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
    // const handleUpdate = () => {
    //     if (editId && sms.trim() !== "") {
    //         const messageRef = ref(db, `messages/${editId}`);
    //         set(messageRef, {
    //             sendarName: user.displayName,
    //             sendarId: user.uid,
    //             message: sms,
    //             date: new Date().toISOString(),
    //         }).then(() => {
    //             Swal.fire({
    //                 position: "top-end",
    //                 icon: "success",
    //                 title: "Message updated successfully.",
    //                 showConfirmButton: false,
    //                 timer: 1500,
    //             });
    //             setSms("");     
    //             setEditId(null); 
    //         }).catch((error) => {
    //             Swal.fire({
    //                 position: "top-end",
    //                 icon: "error",
    //                 title: `Error updating message: ${error}`,
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             });
    //         });
    //     }
    // };


    // Function to delete a message from Firebase

    //  deletes a message from Firebase
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

    console.log(activechatname?.active?.status);

    // ............................
    return (
        <div className="overflow-hidden">


            <div className="w-[1200px flex  relative">
                {/* md:h-[calc(100vh-87px)] */}
                <aside className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col fixed top-[87px] md:top-0  transition-all duration-500 ${isHide ? '-left-full' : 'left-0'
                    } md:relative md:left-0`}
                >
                    <FriendRequest />
                    <FriendGropup />
                    <Friends />
                    <Userlist />
                    <BlockUser />
                </aside>
                <main className="w-full md:w-[calc(100vw-260px)] h-screen   bg-[url('/bg-o.svg')] bg-cover bg-no-repeat flex flex-col justify-end">

                    {/* {activechatname?.active?.status === "single" ?
                        <div className="flex items-center gap-x-2 mb-5 bg-[#232323] py-3 rounded-t-md px-10">
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
                        </div> : <div className="flex justify-center items-center px-12">
                            <img src="/public/bg.svg" alt="" className=" w-full h-[250px] object-cover" />
                        </div>}



                    <div className=" ">

                        {activechatname?.active?.status === "single" ?

                            message.map((msg, index) => (
                                <li key={index} className=" my-6">
                                    {msg.sendarId == user.uid ?
                                        (
                                            <div className="flex gap-2 justify-end ">
                                                <div className="">
                                                    <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl "> {msg.message}</p>

                                                    <div> {new Date(msg.date).toLocaleString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}</div>
                                                </div>

                                            </div>
                                        ) :
                                        (
                                            <div className="flex gap-2 justify-end ">
                                                <div className="">
                                                    <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl "> {msg.message}</p>

                                                    <div> {new Date(msg.date).toLocaleString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}</div>
                                                </div>

                                            </div>
                                        )}

                                </li>
                            ))
                            : 'no friends actively available'
                        }



                    </div> */}

                    <div>
                        {activechatname?.active?.status === "single" ? (
                            <div>
                                {/* Chat Header with Friend's Profile */}
                                <div className="flex items-center gap-x-2 mb-5 bg-[#232323] py-3 rounded-t-md px-10">
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
                                <ul>
                                    {message.map((msg, index) => (
                                        <li key={index} className="my-6">
                                            {/* Check if it's the current user's message */}
                                            {msg.sendarId === user.uid ? (
                                                <div className="flex gap-2 justify-end">
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
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 justify-start">
                                                    <div className="">
                                                        <p className="bg-gray-700 text-white p-3 rounded-2xl">
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
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center px-12">
                                <img
                                    src="/public/bg.svg"
                                    alt=""
                                    className="w-full h-[250px] object-cover"
                                />
                            </div>
                        )}
                    </div>




                    <div className="text-white flex-1 overflow-y-scroll">
                        <h2>home page</h2>
                        <h1>User Messages</h1>
                        <div>

                        </div>
                        {/* <ul className="">
                            {message.map((msg, index) => (
                                <li key={index} className=" my-6">



                                    <div className="flex gap-2 justify-end ">
                                        <div className="">
                                            <p className="bg-slate-200 text-[#262626] p-3 rounded-2xl "> {msg.message}</p>
                                          
                                            <div> {new Date(msg.date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}</div>

                                         
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
                                {imageURL && <img src={imageURL} alt="Uploaded" className="w-12 h-12 object-cover" />}

                                <br />

                                {recordedUrl && (
                                    <audio controls>
                                        <source src={recordedUrl} type="audio/webm" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}

                            </div>
                        </ul>  */}

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
                            onClick={editId ? handleUpdate : handleSend} // Trigger update if editId exists, send otherwise
                            className="text-center -ml-6 bg-[#f55eb9] text-white text-base w-[98px] py-2 rounded-md"
                        >
                            {editId ? "Update" : "Send"} {/* Change button text based on whether editId is set */}
                        </button>
                    </div>
                </main>
            </div >

        </div >
    );
};

export default Home;
