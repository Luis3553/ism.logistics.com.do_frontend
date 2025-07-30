import FormsTemplatesList from "./components/forms-templates-list"
import Form from "./components/form";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ErrorBoundary } from "react-error-boundary";

export default function Forms() {
    useLocalStorage("showDescriptions", true);
    useLocalStorage("expandFilesAutomatically", true);
    useLocalStorage("storeInLocalStorage", true);
    
    return (
        <div className="relative flex flex-row min-h-[calc(100%-64px)] h-[calc(100%-64px)] gap-x-4">
            <ErrorBoundary fallback={<div className='p-4 text-red-500'>Error al cargar los formularios</div>}>
                <FormsTemplatesList />
                <Form />
            </ErrorBoundary>
        </div>
    );
};
