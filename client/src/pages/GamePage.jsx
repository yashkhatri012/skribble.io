import { useEffect } from "react";
import { socket } from "../socket/socket";
import CanvasBoard from "../components/CanvasBoard";
import { useParams } from "react-router-dom";

function GamePage() {
const { roomId } = useParams();
  useEffect(() => {

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      
      // JOIN ROOM
    socket.emit("join-room", roomId);

    // SEND MESSAGE
    socket.emit("message", {
      roomId: roomId,
      text: "Hello"
    });
    
      
    });

        // RECEIVE MESSAGE
  socket.on("reply", (msg) => {
    console.log(msg);
  });

    return () => {
      socket.off("connect");
       socket.off("reply");
       socket.off("draw");
      socket.disconnect();
    };

  }, [roomId]);

  return (
    <div >
      
      <CanvasBoard roomId={roomId} />
    </div>
  );
}

export default GamePage;