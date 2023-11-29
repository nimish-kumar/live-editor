import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];
export default function TextEditor() {
  console.log("##env", import.meta.env.PROJ_DEPLOYED_SERVER_URL)
  const quillRef = useRef();
  const { id } = useParams();
  const [socket, setSocket] = useState();

  const [value, setValue] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.PROJ_DEPLOYED_SERVER_URL);

    // socket.on("connect", ()=> {
    //   console.info("Socket working??", socket.connected)
    // })
    const editor = quillRef.current.getEditor();

    const timer = setInterval(() => {
      socket.emit("save-document", editor.getContents());
    }, 3000);

    editor.disable();
    editor.setText("Loading...");
    setSocket(socket);

    socket.emit("get-document", id);

    // load document
    const loadDocument = document => {
      editor.setContents(document);
      editor.enable();
    };
    // once() cleans up itself when the
    socket.once("load-document", loadDocument);

    // Receive changes
    const updateChangesWithDelta = (delta, receivedId) => {
      if (quillRef.current == null || id !== receivedId) return;
      editor?.updateContents(delta);
    };
    socket.on("receive-changes", updateChangesWithDelta);

    return () => {
      clearInterval(timer);
      socket.off("receive-changes", updateChangesWithDelta);
      socket.disconnect();
    };
  }, []);

  const changeHandler = (value, delta, source) => {
    setValue(value);
    if (socket == null) return;
    if (source !== "user") return;
    socket.emit("send-changes", delta);
  };
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={changeHandler}
      modules={{ toolbar: TOOLBAR_OPTIONS }}
      ref={node => (quillRef.current = node)}
    />
  );
}
