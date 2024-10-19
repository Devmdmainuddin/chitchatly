import  { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const FriendGropup = () => {
  const db = getDatabase();
  let [show, setShow] = useState(false);
  let [group, setGroup] = useState("");
  let [grouplist, setGrouplist] = useState([]);
  let [tagline, setTagline] = useState("");
  let [grouperr, setGrouperr] = useState("");
  const data = useSelector((state) => state.user.userInfo);

  let handleGrouprequest = () => {
    setShow(!show);
  };

  let handleGroup = (e) => {
    setGroup(e.target.value);
    setGrouperr("");
  };
  let handleTagline = (e) => {
    setTagline(e.target.value);
    setGrouperr("");
  };
  let handlegroupRequest = () => {
    if ((group, tagline)) {
      set(push(ref(db, "group")), {
        group: group,
        grouptagline: tagline,
        adminmame: data.displayName,
        adminid: data.uid,
      }).then(() => {
        setShow(false);
      });
    } else {
      setGrouperr("Please Create Group");
    }
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.val().adminid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGrouplist(arr);
    });
  }, [db,data.uid]);

  let handlejoinrequest = (item) => {
    set(push(ref(db, "groupjoinrequest")), {
      groupid: item.key,
      groupname: item.group,
      grouptag: item.grouptagline,
      adminmame: item.adminmame,
      adminid: item.adminid,
      userid: data.uid,
      username: data.displayName,
    });
  };
  return (
    <>
      <div className="relative  mt-5">
        <h2>Groups Request</h2>
        {show ? (
          <button
            onClick={handleGrouprequest}
            className="absolute top-[0%] right-[26px] p-1 bg-[#ca2e79] text-[#fff] rounded"
          >
            Go back
          </button>
        ) : (
          <button
            onClick={handleGrouprequest}
            className="absolute top-[0%] right-0 p-1 bg-[#f55b35] text-[#fff] rounded"
          >
            Create Group
          </button>
        )}
      </div>
      <p className="text-[red] ">{grouperr}</p>
      <div className={`${grouplist.length>3 ?'h-[220px] overflow-scroll':''}`}>
        {show ? (
          <div className="flex flex-col  mr-3">
            
            <input
              onChange={handleGroup}
              placeholder="Group Name"
              className="border border-secondary outline-0 py-2 px-2 rounded-sm mt-7"
            />
            <input
              onChange={handleTagline}
              placeholder="Tagline"
              className="border border-secondary outline-0  py-2 px-2 rounded-sm mt-3 mb-3"
            />
            <button
              onClick={handlegroupRequest}
              type="submit"
              className=" py-2 px-3 rounded-sm text-[#242241] bg-slate-200 block"
            >
              Submit
            </button>
          </div>
        ) : (
          grouplist.map((item,idx) => (
            <div key={idx} className="flex items-center mt-5 border-b border-b-[#d1d1d1] border-t-[none] pb-[10px]">
              <div className="w-[25%] text-center pl-5">
                <img src="images/user.png" />
              </div>
              <div className="w-[50%]">
                <h3>admin:{item.adminmame}</h3>
                <h3>{item.group}</h3>
                <p>Hi Guys, Wassup!</p>
              </div>
              <div className="w-[25%]">
                <button
                  onClick={() => handlejoinrequest(item)}
                  className="p-3 bg-[#f535b2] text-[#fff] rounded"
                >
                  join
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FriendGropup;
