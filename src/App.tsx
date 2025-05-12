import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home/index";
import { Driver } from "./pages/Driver";
import { Details } from "./pages/Details";
import { Charts } from "./pages/Charts";
import { Reports } from "./pages/Report";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="drivers" element={<Driver />} />
                    <Route path="details" element={<Details />} />
                    <Route path="charts" element={<Charts />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="*" element={<Navigate to="home" replace />} />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
