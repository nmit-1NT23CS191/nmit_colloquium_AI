import Upload from "./components/Upload";
import Chat from "./components/Chat";
import Events from "./components/Events";

export default function App() {
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>NMIT Colloquium AI</h1>
      <Upload />
      <Chat />
      <Events />
    </div>
  );
}
