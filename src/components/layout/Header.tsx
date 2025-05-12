import { NavLink } from "react-router-dom";
import logo from "../../assets/imgs/logo.png";
import { menuItems } from "../../constants/menu";
import { ConfigurationModal } from "../../pages/Configuration/ConfigurationModal";
import { useState } from "react";
import { Modal } from "../Modal";

export const Header = () => {
    let [isOpen, setIsOpen] = useState(false);

    return (
        <header className="hidden bg-white shadow-sm min-[860px]:block">
            <nav className="mx-auto max-w-9/10 flex justify-between items-center">
                <ul className="flex items-center justify-start gap-2 py-3">
                    <li className="me-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto min-w-[96px]" />
                    </li>
                    {menuItems.map((menuItem, index) => (
                        <li key={index} className="w-fit text-[var(--gray)] cursor-pointer hover:text-[var(--blue)]">
                            <NavLink
                                to={menuItem.to}
                                className={({ isActive }) => (isActive ? "text-white bg-[var(--blue)]" : "") + " flex items-center gap-2 w-32 justify-center py-2 rounded-md"}>
                                <i className={menuItem.icon}></i>
                                <span className="leading-none">{menuItem.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <i
                    onClick={() => setIsOpen(true)}
                    className="mgc_settings_5_line text-3xl cursor-pointer hover:text-[var(--blue)] transition duration-100 text-gray-700"
                    title="Configuración"></i>
                <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <ConfigurationModal onClose={() => setIsOpen(false)} />
                </Modal>
            </nav>
        </header>
    );
};
