import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Game from "./pages/Game"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import CreateQuestionSet from "./pages/CreateQuestionSet"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="game" element={<Game />} />
                <Route path="auth" element={<Auth />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="questionset/create/:questionSetId" element={<CreateQuestionSet />} />
            </Routes>
        </BrowserRouter>
    );
}