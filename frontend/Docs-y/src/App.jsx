import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Landing from "./components/Landing/Landing";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";
import FileManager from "./components/FileManager/FileManager";
import TextEditor from "./components/TextEditor/TextEditor";

function App() {
  return (
    <>
      <div id="app">
        <Router>
          <Routes>
            <Route path="/landing" element={<Landing />} />

            <Route path="/signup" element={<SignUp />} />

            <Route path="/login" element={<LogIn />} />

            <Route path="/file-manager/:username" element={<FileManager />} />

            <Route
              path="/"
              element={<Navigate to={`/documents/${uuidV4()}`} />}
            />
            <Route path="/documents/:id" element={<TextEditor />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
