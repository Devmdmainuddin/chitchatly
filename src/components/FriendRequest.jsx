import { useState, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  const [friendrequestlist, setFriendrequestlist] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid == data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriendrequestlist(arr);
    });
  }, [db, data.uid]);

  let handlefriendrequest = (item) => {
    set(push(ref(db, "friend/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendrequest/" + item.key));
    });
  };
  return (
    <>
   
      <div className="relative  mt-5">
        <h2>Friend Request</h2>
        <BiDotsVerticalRounded className="absolute top-1/2 -translate-y-1/2 right-[26px]" />
      </div>
      <div className={` ${friendrequestlist.length>0?'h-[150px] overflow-scroll':''}`}>
        {friendrequestlist.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
            <div>
                <div className="w-8 h-8 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full "
                    src={item.photoURL ? item.photoURL : '/user.png'}
                  />
                </div>
              </div>
            <div >
              <h3>{item.sendername}</h3>
             
            </div>
            <div className="">
              <a
                className="py-1 px-3 bg-[#3558f5] text-[#fff] rounded cursor-pointer"
                onClick={() => handlefriendrequest(item)}
              >
                Accept
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FriendRequest;
