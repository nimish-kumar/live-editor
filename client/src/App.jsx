import "./styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "./components/TextEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${uuidv4()}`} />} />
        <Route path="/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
