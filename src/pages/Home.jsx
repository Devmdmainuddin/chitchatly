import { useEffect, useRef, useState } from "react";
import Container from '../components/Container'
import useAuth from "../hooks/useAuth";
import { AudioRecorder } from 'react-audio-voice-recorder';
import { equalTo, get, getDatabase, limitToLast, onValue, orderByChild, push, query, ref, remove, set, update } from "firebase/database";
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
import { IoIosImages } from "react-icons/io";


const Home = () => {
    const { user, } = useAuth()

    const [isHide, setIsHide] = useState(true)
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState([])
    const [sms, setSms] = useState("");
    let activechatname = useSelector((state) => state.activeChat);
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
    // const addAudioElement = (blob) => {
    //     if (blob && blob.size > 0) {
    //         const url = URL.createObjectURL(blob);
    //         setRecordedUrl(url);
    //         handleSendAudio(url);
    //     } else {
    //         console.error('Invalid blob or recording failed');
    //     }
    // };

    const handleSendAudio = (blob) => {
        if (!blob || blob.size === 0) {
            console.error('Invalid blob or recording failed');
            return;
        }
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);

        // Define the file name and storage reference
        const audioFileName = `${user.displayName}-audio-${Date.now()}.webm`;
        const storageRef = Ref(storage, `${user.displayName}/sendaudio/${audioFileName}`);

        // Upload the audio blob to Firebase storage
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress); // Update progress bar if needed
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
                        setSms(''); // Clear input field after sending
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

    //   message Update from db  

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
                setProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageURL(url);
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



    // ............................
    return (
        <div className="overflow-hidden">

            <Container>
                <div className="w-[1200px flex  relative overflow-hidden">
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


                        <div>
                            {activechatname?.active?.status === "single" ?
                                (
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
                                                                    {/* <button onClick={() => handleEdit({ ...msg, id: msg.id })}>
                                                                <CiEdit className="text-[#f9f9f9] text-xl" />
                                                            </button>
                                                            <button onClick={() => handleDelete(msg.id)}><RiChatDeleteFill className="text-red-600 text-xl" /></button>
                                                         */}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                                :
                                (
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


                        </div>

                        {/* <div>
                            <div className="bg-slate-200   flex items-center">
                                <input type="file" ref={choseFile} accept="image/*" onChange={handleUpload} className="w-6" />
                                

                                <progress value={progress} max="100" />

                            </div>
                        </div> */}
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
