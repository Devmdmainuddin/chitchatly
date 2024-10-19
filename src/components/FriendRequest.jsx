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
          <div key={idx} className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
            <div className="w-[25%] text-center pl-5">
              <img src="images/user.png" />
            </div>
            <div className="w-[50%]">
              <h3>{item.sendername}</h3>
              <p>Hi Guys, Wassup!</p>
            </div>
            <div className="w-[25%]">
              <a
                className="p-3 bg-[#5F35F5] text-[#fff] rounded"
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
