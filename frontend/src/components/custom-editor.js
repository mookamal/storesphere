import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
export default function CustomEditor({ content, setContent }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = new EditorJS({
      holder: editorRef.current,
      onChange: async () => {
        const savedData = await editor.save();
        setContent(savedData);
      },
      data: content ? JSON.parse(content) : {},
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link", "bold"],
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
      },
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div className="prose mx-auto dark:prose-invert" ref={editorRef}></div>
  );
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("upload", file);

          fetch("http://api.nour.com/s/stores/images/upload/", {
            method: "POST",
            body: data,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((res) => {
              resolve({
                default: res.url,
              });
            })
            .catch((err) => {
              console.error("Upload error:", err);
              reject(err);
            });
        })
    );
  }

  abort() {}
}
