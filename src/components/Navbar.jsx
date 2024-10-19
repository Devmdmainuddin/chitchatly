import { Link } from "react-router-dom";
import { LuContact2, LuPhoneCall } from "react-icons/lu";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoPowerSharp, } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdCancel, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoIosMenu, IoMdNotificationsOutline } from "react-icons/io";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const Navbar = () => {
    const db = getDatabase();
    const data = useSelector((state) => state.user.userInfo);
    const [userdata, setUserdata] = useState([]);
    const { user, logOut } = useAuth()
    const [show, setShow] = useState(false)
    const [isHide, setIsHide] = useState(true)
    const [userfilter, setUserfilter] = useState([]);
    const [friendrequestlist, setFriendrequestlist] = useState([]);
    const [friendlist, setFriendlist] = useState([]);

    useEffect(() => {
        const starCountRef = ref(db, "users/");
        onValue(starCountRef, (snapshot) => {
          let arr = [];
          snapshot.forEach((item) => {
            if (data.uid != item.key) {
              arr.push({ ...item.val(), userid: item.key });
            }
          });
          setUserdata(arr);
        });
      }, [data.uid, db]);

      let handlefriendrequest = (item) => {
        set(push(ref(db, "friendrequest/")), {
          sendername: data.displayName,
          senderid: data.uid,
          receivername: item.username,
          receiverid: item.userid,
        });
      };
    
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




    return (
        <div>
            <nav className="border-b relative">
                <div className="flex items-center justify-between py-4 px-6  relative">
                    <h1 className="text-2xl font-bold">Chitchatly</h1>
                    <div onClick={() => setIsHide(!isHide)} className="md:hidden"><span><IoIosMenu /></span></div>
                    <div className="flex items-center w-1/3">
                        <input onChange={handlesearch} type="text" name="" id="" placeholder=" Search a Friend" className="min-w-[220px] w-full border outline-0 py-2 px-3" />
                    </div>
                    <div onClick={() => setShow(!show)} className="logo">
                        <button><img src="/user.png" alt="" className="w-12 h-12 rounded-full" /> </button>
                    </div>

                    <div
                        className={`bg-[#f7f7f8]  min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col absolute top-full right-0 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ transform: `translateX(${show ? '0' : '100%'})`, zIndex: 100 }}
                    >
                        <ul className="space-y-3 flex-1 mt-6">
                            <h2>{user?.displayName}</h2>
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
                <div className={` z-50 w-[365px] px-6 absolute top-full left-1/2 -translate-x-1/2 bg-slate-400  ${userfilter.length > 3 ? 'h-[235px] overflow-y-scroll' : ''}`}>
                    {userfilter.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3  border-b border-b-[#d1d1d1] hover:text-[#077fbb]  hover:bg-gray-200  transition-all duration-500  border-t-[none] py-3">
                                <div>
                                    <div className="w-8 h-8 rounded-full">
                                        <img
                                            className="w-full h-full object-cover rounded-full "
                                            src={data.photoURL ? data.photoURL : '/user.png'}
                                        />
                                    </div>
                                </div>
                                <h3>{item.username.slice(0, 16)}</h3>

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

            </nav>
        </div>
    );
};

export default Navbar;