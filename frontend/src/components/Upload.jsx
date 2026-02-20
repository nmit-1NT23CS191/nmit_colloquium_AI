import axios from "axios";

export default function Upload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:8000/upload/", formData);
    alert("Uploaded successfully");
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
