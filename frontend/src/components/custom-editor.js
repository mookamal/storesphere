import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Image,
  ImageInsert,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  LinkImage,
  Highlight,
  Alignment,
  Font,
  List,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "../styles/custom-editor-styles.css";

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

function CustomEditor({ content, setContent }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "heading",
            "alignment",
            "|",
            "insertImage",
            "highlight",
            "fontSize",
            "fontFamily",
            "fontColor",
            "bulletedList",
            "numberedList",
          ],
          shouldNotGroupWhenFull: true,
        },
        image: {
          toolbar: [
            "imageStyle:block",
            "imageStyle:side",
            "imageStyle:alignLeft",            
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "linkImage",
          ],
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
          ],
        },
        plugins: [
          Bold,
          Essentials,
          Italic,
          Mention,
          Paragraph,
          Undo,
          Heading,
          Image,
          ImageInsert,
          ImageCaption,
          ImageResize,
          ImageStyle,
          LinkImage,
          ImageToolbar,
          Highlight,
          Alignment,
          Font,
          List,
        ],

        extraPlugins: [MyCustomUploadAdapterPlugin],
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
      }}
    />
  );
}

export default CustomEditor;

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
