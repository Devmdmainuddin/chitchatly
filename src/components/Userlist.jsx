import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import { MdCancel, MdOutlinePersonAddAlt } from "react-icons/md";
const Userlist = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [userdata, setUserdata] = useState([]);
  const [friendrequestlist, setFriendrequestlist] = useState([]);
  const [friendlist, setFriendlist] = useState([]);
  const [userfilter, setUserfilter] = useState([]);

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
    <>
      <div className="relative  mt-12">
        <div className="flex justify-between items-center">
          <h2>User List</h2>
          <BiDotsVerticalRounded className="text-xl" />
        </div>

        <input
          onChange={handlesearch}
          placeholder="search"
          className="w-full border border-spacing-10 py-2 px-3  outline-0 my-2"
        />
      </div>
      <div className={`mt-4 ${userdata.length > 0 ? 'h-[320px] overflow-y-scroll' : 'h-[55px]'}`}>
        {userfilter.length > 0
          ? userfilter.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3  border-b border-b-[#d1d1d1] hover:text-[#077fbb]  hover:bg-gray-200  transition-all duration-500  border-t-[none] py-3">
              <div>
                <div className="w-8 h-8 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full "
                    src={data.photoURL ? data.photoURL : '/user.png'}
                  />
                </div>
              </div>
              <h3>{item.username.slice(0,16)}</h3>
           
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
          ))
          : userdata.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3  border-b border-b-[#d1d1d1] hover:text-[#077fbb]  hover:bg-gray-200  transition-all duration-500 border-t-[none] py-3">
              <div>
                <div className="w-8 h-8 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full "
                    src={data.photoURL ? data.photoURL : '/user.png'}
                  />
                </div>
              </div>
                <h3>{item.username.slice(0,16)}</h3>
              <div className="">
                <div className=" p-2 ">
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
            </div>
          ))}
      </div>
    </>
  );
};

export default Userlist;
