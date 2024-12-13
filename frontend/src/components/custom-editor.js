import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";

export default function CustomEditor({ content, setContent }) {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Start typing...",
    });

    if (content) {
      quill.root.innerHTML = content;
    }

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }, []);

  return <div ref={quillRef}></div>;
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
