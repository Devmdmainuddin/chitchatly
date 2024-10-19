import  { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";

import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { activeChatId } from "../Featured/slices/activeSlice";
const Friends = () => {
  const [friends, setFriends] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.user.userInfo);
  let dispatch = useDispatch();
  useEffect(() => {
    const fCountRef = ref(db, "friend/");
    onValue(fCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().receiverid || item.val().senderid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriends(arr);
    });
  }, [db,data.uid]);

  let handleblock = (item) => {
    if (data.uid == item.senderid) {
      set(push(ref(db, "block")), {
        block: item.receivername,
        blockid: item.receiverid,
        blockbyname: item.sendername,
        blockbyid: item.senderid,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.sendername,
        blockid: item.senderid,
        blockbyname: item.receivername,
        blockbyid: item.receiverid,
      }).then(() => {
        remove(ref(db, "friend/" + item.key));
      });
    }
  };

  let handleActiveChat = (item) => {
    if (item.receiverid == data.uid) {
      dispatch(
        activeChatId({
          status: "single",
          id: item.senderid,
          name: item.sendername,
        })
      );
    } else {
      dispatch(
        activeChatId({
          status: "single",
          id: item.receiverid,
          name: item.receivername,
        })
      );
    }
  };

  return (
    <>
      <div className="relative  mt-12">
        <h2>Friend</h2>
        <BiDotsVerticalRounded className="absolute top-[30%] right-[26px]" />
      </div>
      <div className={` ${friends.length>3 ? 'h-[190px] overflow-scroll':''}`}>
        {friends.map((item,idx) => (
          <div key={idx}
            onClick={() => handleActiveChat(item)}
            className="flex items-center justify-between mt-5 border-b border-b-[#d1d1d1] border-t-[none] py-[10px]"
          >
            <div>
                <div className="w-8 h-8 rounded-full">
                  <img
                    className="w-full h-full object-cover rounded-full "
                    src={data.photoURL ? data.photoURL : '/user.png'}
                  />
                </div>
              </div>
            <div className="">
              <h3>
                {data.uid == item.senderid
                  ? item.receivername.slice(0,16)
                  : item.sendername.slice(0,16)}
              </h3>
             
            </div>
            <div className="">
              <button
                onClick={() => handleblock(item)}
                className="py-1 px-3 bg-[#ff1420cf] text-[#fff] rounded capitalize"
              >
                block
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Friends;
