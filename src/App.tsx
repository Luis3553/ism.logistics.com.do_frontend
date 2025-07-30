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
import { Tasks } from "./pages/Tasks/index.tsx";
import { UIProvider } from "./contexts/ui-context.tsx";
import { ModalProvider } from "@contexts/modal-context.tsx";
import ManagedModal from "@contexts/managed-modal.tsx";
import Forms from "@pages/Forms/index.tsx";
import Checkins from "@pages/Checkins/index.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UIProvider>
                <ModalProvider>
                    <Router>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path='home' element={<Home />} />
                                <Route path='drivers' element={<Driver />} />
                                <Route path='details' element={<Details />} />
                                <Route path='charts' element={<Charts />} />
                                <Route path='reports' element={<Reports />} />
                                <Route path='notifications' element={<Alerts />} />
                                <Route path='tasks' element={<Tasks />} />
                                <Route path='forms' element={<Forms />} />
                                <Route path='checkins' element={<Checkins />} />
                                <Route path='*' element={<NotFound />} />
                                <Route path='/' element={<Navigate to='/home' replace />} />
                            </Route>
                        </Routes>
                    </Router>
                    <ManagedModal />
                </ModalProvider>
            </UIProvider>
        </QueryClientProvider>
    );
}

export default App;
