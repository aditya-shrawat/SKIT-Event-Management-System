import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import socket from "@/Socket/socket";
import { Link } from "react-router-dom";


dayjs.extend(relativeTime);

const Notifications = ({ setIsNotificationsOpen }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchAllRecivedNotifications = async () => {
    try {
      const BackendURL = import.meta.env.VITE_backendURL;
      const response = await axios.get(`${BackendURL}/api/notification/all`, {
        withCredentials: true,
      });

      setNotifications(response.data.notifications);
    } catch (error) {
      console.log("Error while fetching recived notifications - ", error);
    }
  };

  useEffect(() => {
    fetchAllRecivedNotifications();
  }, []);

  return (
    <div>
      <button
        aria-label="Close notifications"
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[70] cursor-default"
        onClick={() => setIsNotificationsOpen(false)}
      />
      {/* Right drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="fixed right-0 top-0 z-[80] h-screen w-full max-w-sm bg-white border-l border-gray-200 shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b-2 border-gray-200 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Notifications
            </h2>
            <p className="text-xs text-gray-500">
              Updates and alerts for your events
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <button
              className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, status: "seen" }))
                );
              }}
            >
              Mark all read
            </button>
          </div> */}
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {notifications && notifications.length === 0 ? (
              <li className="p-4 text-sm text-gray-500">
                You're all caught up.
              </li>
            ) : ( notifications &&
              notifications?.map((n) => (
                <li key={n._id} className="p-4 hover:bg-gray-50">
                    <NotificationItem notification={n} setNotifications={setNotifications} />
                </li>
              ))
            )}
          </ul>
        </div>
        {/* Footer */}
        <div className="block sm:hidden border-t-2 border-gray-200 px-3 py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <button
            className="w-full primary-button px-3 py-2"
            onClick={() => setIsNotificationsOpen(false)}
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Notifications;

const NotificationItem = ({notification,setNotifications}) => {
    const createdAt = dayjs(notification.createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdAt, 'hour');
    const displayTime = diffInHours < 24 ? createdAt.fromNow() : createdAt.format('MMM DD, YYYY, hh:mm A');


    const markAsSeen = async () => {
      try {
        if (notification.status === 'seen') return;
        const BackendURL = import.meta.env.VITE_backendURL;
        await axios.post(`${BackendURL}/api/notification/${notification?._id}/seen`,
            { status: "seen" },
            { withCredentials: true }
        );
        setNotifications(prev => prev.map(n =>
            n._id === notification._id ? { ...n, status: 'seen' } : n
        ));
      } catch (error) {
        console.log("Error marking notification as seen - ", error);
      }
    }


    // sub admin invitation - accept
    const accept_subAdmin_Invitation = async ()=>{
        try {
            socket.emit("accept_subAdmin_invitation",{eventId:notification.eventId._id,userId:notification.receiver._id,senderId:notification.sender._id })

            // mark notification as seen
            const BackendURL = import.meta.env.VITE_backendURL;
            const response = await axios.post(`${BackendURL}/api/notification/${notification._id?.toString()}/seen`,{status:"seen"},
                {withCredentials:true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notification._id?.toString()));
        } catch (error) {
            console.log("Error in accepting sub admin invitation - ",error)
        }
    }

    // sub admin invitation - rejected
    const reject_subAdmin_Invitation = async ()=>{
        try {
            socket.emit("reject_subAdmin_invitation",{eventId:notification.eventId._id,userId:notification.receiver._id,senderId:notification.sender._id })

            // mark notification as seen
            const BackendURL = import.meta.env.VITE_backendURL;
            const response = await axios.post(`${BackendURL}/api/notification/${notification._id?.toString()}/seen`,{status:"seen"},
                {withCredentials:true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notification._id?.toString()));
        } catch (error) {
            console.log("Error in accepting sub admin invitation - ",error)
        }
    }

    // admin invitation (Permission) - approve
    const approve_student_event = async ()=>{
        try {
            socket.emit("approve_student_event",{eventId:notification.eventId._id,adminId:notification.receiver._id,senderId:notification.sender._id })

            // mark notification as seen
            const BackendURL = import.meta.env.VITE_backendURL;
            const response = await axios.post(`${BackendURL}/api/notification/${notification._id?.toString()}/seen`,{status:"seen"},
                {withCredentials:true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notification._id?.toString()));
        } catch (error) {
            console.log("Error in approving student event - ",error)
        }
    }


    // admin invitation (Permission) - reject
    const reject_student_event = async ()=>{
        try {
            socket.emit("reject_student_event",{eventId:notification.eventId._id,adminId:notification.receiver._id,senderId:notification.sender._id })

            // mark notification as seen
            const BackendURL = import.meta.env.VITE_backendURL;
            const response = await axios.post(`${BackendURL}/api/notification/${notification._id?.toString()}/seen`,{status:"seen"},
                {withCredentials:true}
            );

            setNotifications((prev) => prev.filter((n) => n._id !== notification._id?.toString()));
        } catch (error) {
            console.log("Error in accepting sub admin invitation - ",error)
        }
    }


  // Sender avatar 
  const SenderAvatar = () => (
    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-[#C9514F] to-[#A94442] font-semibold text-base text-white flex justify-center items-center overflow-hidden">
      {notification.sender?.name?.charAt(0).toUpperCase()}
    </div>
  );


  // for sub admin invitation notification
  if(notification.type === "sub_admin_invitation")  {
      return (
        <div className="min-w-0">
          <Link to={`/event/${notification.eventId?._id}`} className="w-full flex ">
            <div className=" mr-2">
              <SenderAvatar />
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-base text-gray-800 mr-2">
                {notification.sender.name}
              </span>
              {`invited you as a sub-admin for the event "${notification.eventId.name}".`}
            </p>
          </Link>
          <div className="w-full mt-4 flex gap-6">
            <button onClick={reject_subAdmin_Invitation} className="outline-button flex-1 px-2 py-1">Reject</button>
            <button onClick={accept_subAdmin_Invitation} className="primary-button flex-1 px-2 py-1">Accept</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">{displayTime}</p>
        </div>
      )
  }

  // for admin invitation (permission) notification
  if(notification.type === "admin_invitation") {
      return(
        <div className="min-w-0">
          <Link to={`/event/${notification.eventId?._id}`} className="w-full flex ">
            <div className=" mr-2">
              <SenderAvatar />
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-base text-gray-800 mr-2">
                {notification.sender.name}
              </span>
              {`requested approval to host "${notification.eventId.name}".`}
            </p>
          </Link>
          <div className="w-full mt-4 flex gap-6">
            <button onClick={reject_student_event} className="outline-button flex-1 px-2 py-1">Reject</button>
            <button onClick={approve_student_event} className="primary-button flex-1 px-2 py-1">Approve</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">{displayTime}</p>
        </div>
      ) 
  }


  if (
    [
        'subAdmin_invitation_accepted',
        'subAdmin_invitation_rejected',
        'approved_student_event',
        'rejected_student_event'
    ].includes(notification.type)
  ) {
    const messageMap = {
        subAdmin_invitation_accepted: `accepted your sub-admin invitation for "${notification.eventId?.name}".`,
        subAdmin_invitation_rejected: `rejected your sub-admin invitation for "${notification.eventId?.name}".`,
        approved_student_event: `approved your event "${notification.eventId?.name}".`,
        rejected_student_event: `rejected your event "${notification.eventId?.name}".`
    };

    return (
      <Link to={`/event/${notification.eventId?._id}`} onClick={markAsSeen}
       className="flex items-start justify-between gap-3">
        <div className="min-w-0">
            <div className="w-full flex">
                <div className="mr-2">
                    <SenderAvatar />
                </div>
                <p className={`text-sm ${
                    notification.status === "unseen"
                      ? "font-semibold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                    <span className={`${ notification.status === "unseen"? "font-bold text-gray-900": "font-semibold text-gray-700"} text-base mr-2`}>
                        {notification.sender.name}
                    </span>
                    {messageMap[notification.type]}
                </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">{displayTime}</p>
        </div>
        {notification.status === "unseen" && (
            <span className="shrink-0 mt-2 h-2.5 w-2.5 rounded-full bg-[#00A1A1]" />
        )}
      </Link>
    );
  }


  const Wrapper = notification.type === 'event_updated'
    ? ({ children }) => <Link to={`/event/${notification.eventId?._id}`} onClick={markAsSeen} className="flex items-start justify-between gap-3 hover:bg-gray-50 w-full">{children}</Link>
    : ({ children }) => <div onClick={markAsSeen} className="flex items-start justify-between gap-3">{children}</div>;


  return (
    <Wrapper>
          <div className="min-w-0">
            <p
              className={`text-sm ${
                notification.status === "unseen"
                  ? "font-semibold text-gray-900"
                  : "text-gray-700"
              }`}
            >
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">{displayTime}</p>
          </div>
          {notification.status === "unseen" && (
            <span className="shrink-0 mt-2 h-2.5 w-2.5 rounded-full bg-[#00A1A1]" />
          )}
    </Wrapper>
  );
};
