import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Game from "./pages/Game"
import Auth from "./pages/Auth"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="game" element={<Game />} />
                <Route path="auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}