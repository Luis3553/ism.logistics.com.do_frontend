// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ErrorBoundary fallback={<div className='text-red-500'>Hubo un error al cargar la aplicación. Por favor, inténtelo de nuevo.</div>}>
        <App />
    </ErrorBoundary>
    // {/* </StrictMode> */}
);
