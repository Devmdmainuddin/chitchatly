import { useState } from "react";
import PropTypes from 'prop-types'
import { useSelector } from "react-redux";
import { MdCancel, MdOutlinePersonAddAlt } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
const Userlist = ({ userdata, friendrequestlist, friendlist, userfilter, handlesearch, handlefriendrequest }) => {
  const data = useSelector((state) => state.user.userInfo);
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="relative">
        <div className="relative  mt-12">
          <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center">
            <h2>User List</h2>
            <div><FaPlus className={`absolute right-2 top-2 -translate-y-1/2 transition-all duration-150 ${isOpen ? "opacity-0 rotate-90" : "opacity-100"}`}></FaPlus><FaMinus className={`absolute right-2 top-2 -translate-y-1/2 transition-all duration-150 ${isOpen ? "opacity-100 " : "opacity-0 rotate-90"}`}></FaMinus></div>
          </div>

          <input
            onChange={handlesearch}
            placeholder="search"
            className="w-full border border-spacing-10 py-2 px-3  outline-0 my-2"
          />
        </div>
        {isOpen && <div className={`mt-4 ${userdata.length > 0 ? 'h-[320px] overflow-y-scroll' : 'h-[55px]'}   transition-all duration-500`}>
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
                <h3>{item.username.slice(0, 16)}</h3>
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
        </div>}

      </div>

    </>
  );
};
Userlist.propTypes = {
  // userdata,friendrequestlist,friendlist,userfilter,handlesearch
  userdata: PropTypes.array,
  friendrequestlist: PropTypes.array,
  friendlist: PropTypes.array,
  userfilter: PropTypes.array,
  handlesearch: PropTypes.func,
  handlefriendrequest: PropTypes.func,
}
export default Userlist;
