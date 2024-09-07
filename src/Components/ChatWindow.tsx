import { child, get, ref, set, } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, database } from "../firebase";
import { Avatar, ListItemAvatar } from "@mui/material";

const ChatWindow: React.FC = () => {
  const [message, setMessage] = useState("");
  const [friend, setFreind] = useState<any>();
  const [chats, setChats] = useState<any>([]);
  const [singLi, setSignle] = useState();
  const [ownEmail, setOwnEmail] = useState();
  const ID = useSelector((state: any) => state.chat.id);

  function formatDate() {
    const dateObj = new Date();

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { day: formattedDate, time: formattedTime };
  }

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const number = Math.ceil(Math.random() * 123125191545);
    const date = formatDate();

    set(ref(database, "chats/" + singLi + "/" + number), {
      day: date.day,
      time: date.time,
      text: message,
      from: ownEmail,
      id: number,
    });
    getChats(singLi);
    setMessage("");
  };

  const removePunctuation = (str: any) => {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?<>[\]\\|+]/g, "");
  };

  const sortAlphabetically = (str1: any, str2: any) => {
    if (str1.localeCompare(str2) > 0) {
      return removePunctuation(`${str2}${str1}`);
    } else {
      return removePunctuation(`${str1}${str2}`);
    }
  };

  type ChatMessage = {
    day: string; // "07.09.2024" format
    time: string; // "19:14:35" format
  };

  function compareDates(a: ChatMessage, b: ChatMessage): number {
    const [dayA, monthA, yearA] = a.day.split(".").map(Number);
    const [dayB, monthB, yearB] = b.day.split(".").map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    const [hoursA, minutesA, secondsA] = a.time.split(":").map(Number);
    const [hoursB, minutesB, secondsB] = b.time.split(":").map(Number);

    const timeA = new Date(0, 0, 0, hoursA, minutesA, secondsA).getTime();
    const timeB = new Date(0, 0, 0, hoursB, minutesB, secondsB).getTime();

    return timeA - timeB;
  }

  function sortMessages(messages: any): any {
    return messages.sort(compareDates);
  }

  const getChats = (keyId: any) => {
    // Listener yordamida har bir yangi xabar qo'shilganda yangilanishni kuzatamiz
    const dbRef = ref(database);
    get(child(dbRef, `chats/${keyId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const pureData = Object.values(snapshot.val());
          setChats(sortMessages(pureData));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };




  useEffect(() => {
    if (ID) {
      const dbRef = ref(database);
      get(child(dbRef, `users/${ID}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setFreind(snapshot.val());
            const own: any = auth.currentUser?.email;
            setOwnEmail(own);
            const keyId = sortAlphabetically(snapshot.val().email, own);
            setSignle(keyId);
            getChats(keyId); // Realtime xabarlarni kuzatish
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [ID]);

  return (
    <>
      {friend ? (
        <div className=" hidden md:flex flex-col flex-grow h-full">
          <div className="flex items-center bg-gray-200 gap-2 justify-start px-4 py-2">
            <ListItemAvatar>
              <Avatar sizes="large">{friend.logo}</Avatar>
            </ListItemAvatar>
            <span className="text-[24px] font-[500]">{friend.username}</span>
          </div>
          <div className="flex-grow flex justify-end  flex-col p-4 overflow-y-auto">
            {chats.map((chat: any, index: number) => (
              <div
                key={index}
                className={`flex ${
                  chat.from === ownEmail ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    chat.from === ownEmail
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-gray-300 flex gap-2 border-t"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex w-[70%] h-full font-bold justify-center items-center text-[28px]">
          Select a chat to start messaging
        </div>
      )}
    </>
  );
};

export default ChatWindow;
