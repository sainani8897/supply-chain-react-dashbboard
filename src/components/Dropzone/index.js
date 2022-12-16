import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const DropzoneHandler = (props) => {
  console.log(props);
  const [uploadedFiles, setUploadedFiles] = useState(props.options.uploadedFile ?? []);
  const [selectedFiles, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const viewFiles = acceptedFiles.map((file) => {
      console.log(file);
      // New FormData file
      uploadFile(file);
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });
    console.log(viewFiles);
    setFiles(viewFiles);
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  // File Upload
  const uploadFile = async (file) => {
    try {
      let formData = new FormData();
      formData.append("file", file);
      const files = await axios.post(
        process.env.REACT_APP_API_URL + "/media-manager",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token") ?? null,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadedFiles((prevArray) => [...prevArray, files.data.data]);
      console.log("uploaded files",uploadedFiles);
      props.onFileUpload(uploadedFiles ?? [])
    } catch (error) {}
  };

  useEffect(() => {
    //setUploadedFiles(props.options.uploadedFile ?? []);
    props.onFileUpload(uploadedFiles ?? [])
  }, [uploadedFiles]);

  const files = acceptedFiles.map((file) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    );
  });

  const thumbs = uploadedFiles?.map((file) => (
    <div style={thumb} key={file.name}>
      <div className="container" style={thumbInner}>
        <img
          src={file.full_url}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.full_url);
          }}
        />
        {/* <div class="middle">
          <div class="text">John Doe</div>
        </div> */}
      </div>
    </div>
  ));

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {/* <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside> */}
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
};

export default DropzoneHandler;
