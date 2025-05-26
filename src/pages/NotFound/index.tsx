import { IoHome } from "react-icons/io5";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="p-10 bg-white shadow-lg rounded-xl">
                <h1 className="mb-8 text-4xl font-black text-center ">404</h1>
                <img src="src/assets/imgs/logo.png" alt="Logo" />
                <h2 className="my-8 text-2xl font-medium text-center">Página no encontrada</h2>
                <a href="/home" className="flex items-center justify-center gap-4 px-4 py-1 font-bold text-center transition rounded shadow hover:bg-brand-blue hover:text-white bg-brand-light-blue text-brand-blue">
                    <IoHome />
                    Ir a la página principal
                </a>
            </div>
        </div>
    );
};
