import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <div className="flex h-full">

        <Sidebar />
       
          <ChatWindow />
      
      </div>
    </div>
  );
}

export default Home;
