import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRef } from "react";

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
  const quillRef = useRef();
  const [socket, setSocket] = useState();

  const [value, setValue] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:8001");
    setSocket(socket);
    const updateChangesWithDelta = delta => {
      if (quillRef.current == null) return;
      quillRef.current?.getEditor()?.updateContents(delta);
    };
    socket.on("receive-changes", updateChangesWithDelta);

    return () => {
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
