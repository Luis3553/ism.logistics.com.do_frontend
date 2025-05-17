import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import logo from "../../assets/imgs/logo.png";
import { menuItems } from "../../constants/menu";
import { NavLink } from "react-router-dom";

export const MobileHeader = () => {
    const [isMenuOpen, setMenu] = useState(false);
    const toggleMenuVisibility = () => setMenu(!isMenuOpen);

    const transitions = useTransition(isMenuOpen, {
        from: { opacity: 0, transform: "translateY(-20px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-10px)" },
        config: { tension: 250, friction: 22 },
    });

    return (
        <>
            {transitions((style, show) =>
                show ? (
                    <>
                        <animated.div style={style} className="z-30 bg-black/50 fixed inset-0" onClick={toggleMenuVisibility}></animated.div>
                        <animated.div style={style} className="bg-white fixed z-30 w-full rounded-br-lg rounded-bl-lg shadow-lg">
                            <ul className="p-2 flex flex-col gap-2">
                                {menuItems.map((menu) => (
                                    <NavLink
                                        key={menu.to}
                                        to={menu.to}
                                        onClick={toggleMenuVisibility}
                                        className={({ isActive }) =>
                                            (isActive ? "text-white bg-brand-blue" : "hover:bg-brand-blue/10") + " flex items-center gap-2 w-full p-2 rounded-md"
                                        }>
                                        <i className={menu.icon}></i> {menu.name}
                                    </NavLink>
                                ))}
                            </ul>
                        </animated.div>
                    </>
                ) : null
            )}

            <header className="fixed w-full -bottom-px left-1/2 -translate-x-1/2 bg-white min-[860px]:hidden z-30 shadow-[0px_-2px_5px_rgba(0,0,0,0.15)]">
                <nav className="mx-auto max-w-9/10">
                    <ul className="flex items-center justify-between py-3">
                        <li>
                            <i onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-2xl cursor-pointer mgc_up_line"></i>
                        </li>
                        <li>
                            <img src={logo} alt="Logo" className="w-24 h-auto min-w-24" />
                        </li>
                        <li>
                            <i onClick={toggleMenuVisibility} className="text-2xl cursor-pointer mgc_menu_line ms-auto"></i>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
};
