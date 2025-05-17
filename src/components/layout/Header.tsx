import { NavLink } from "react-router-dom";
import logo from "../../assets/imgs/logo.png";
import { menuItems } from "../../constants/menu";
import { ConfigurationModal } from "../../pages/Configuration/ConfigurationModal";
import { useState } from "react";
import { Modal } from "../Modal";
import cn from "classnames";

export const Header = () => {
    let [isOpen, setIsOpen] = useState(false);

    return (
        <header className="hidden bg-white shadow-sm min-[860px]:block">
            <nav className="flex items-center justify-between mx-auto max-w-9/10">
                <ul className="flex items-center justify-start gap-2 py-3">
                    <li className="me-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto min-w-[96px]" />
                    </li>
                    {menuItems.map((menuItem, index) => (
                        <li key={index} className="cursor-pointer w-fit text-brand-gray hover:text-brand-blue">
                            <NavLink
                                to={menuItem.to}
                                className={({ isActive }) => cn("flex items-center gap-2 w-32 justify-center py-2 rounded-md focus-visible:outline-1 outline-brand-blue focus-visible:text-brand-blue transition", isActive && " text-white focus-visible:text-white bg-brand-blue")}>
                                <i className={menuItem.icon}></i>
                                <span className="leading-none">{menuItem.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <button className="text-gray-700 transition duration-100 focus-visible:outline-0 focus-within:text-brand-blue hover:text-brand-blue">
                    <i
                        onClick={() => setIsOpen(true)}
                        className="text-3xl cursor-pointer mgc_settings_5_line"
                        title="Configuración"></i>
                </button>
                <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <ConfigurationModal onClose={() => setIsOpen(false)} />
                </Modal>
            </nav>
        </header>
    );
};
