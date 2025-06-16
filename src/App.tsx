import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home/index";
import { Driver } from "./pages/Driver";
import { Details } from "./pages/Details";
import { Charts } from "./pages/Charts";
import { Reports } from "./pages/Report";
import { Alerts } from "./pages/Alert/index.tsx";
import { NotFound } from "./pages/NotFound/index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router basename={import.meta.env.VITE_BASE_URL}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="home" element={<Home />} />
                        <Route path="drivers" element={<Driver />} />
                        <Route path="details" element={<Details />} />
                        <Route path="charts" element={<Charts />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="notifications" element={<Alerts />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
