import classNames from "classnames";
import React from "react";

export const Button = ({
    children,
    rounded = "md",
    variant = "solid",
    strength = "primary",
    bordered = false,
    ...props 
}: {
    children: JSX.Element | string | React.ReactNode;
    variant?: "outlined" | "subtle" | "solid" | "shadowed";
    strength?: "primary" | "muted";
    rounded?: "full" | "lg" | "md" | "xl" | "2xl" | "none";
    bordered?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const color = () => {
        if (strength === "primary") {
            if (variant === "solid") return {
                base: "bg-brand-blue text-white", 
                hover: "hover:bg-brand-blue/90 focus-visible:bg-brand-blue/90",
                active: "active:bg-brand-dark-blue active:text-white"
            };
            if (variant === "outlined") return {
                base: "border border-brand-blue text-brand-blue",
                hover: "hover:bg-brand-blue/10 focus-visible:bg-brand-blue/10",
                active: "active:bg-brand-blue/20 "
            }; 
            if (variant === "subtle") return {
                base: "bg-brand-light-blue text-brand-blue",
                hover: "hover:bg-brand-blue hover:text-white focus-visible:text-white focus-visible:bg-brand-blue",
                active: "active:shadow-md active:bg-brand-blue/80 active:text-white"
            }; 
            return {
                base: "shadow-md text-brand-blue",
                hover: "hover:shadow-lg focus-visible:shadow-lg",
                active: "active:bg-brand-dark-blue shadow-md active:text-white"
            }
        } else {
            if (variant === "solid") return {
                base: "bg-slate-500 text-white",
                hover: "hover:bg-slate-600 focus-visible:bg-slate-600",
                active: "active:bg-slate-700"
            };
            if (variant === "outlined") return {
                base: "border border-slate-200 text-slate-800",
                hover: "hover:bg-slate-100 focus-visible:bg-slate-100",
                active: "active:bg-slate-200"
            };
            if (variant === "subtle") return {
                base: "bg-slate-100 text-slate-500",
                hover: "hover:bg-slate-200 focus-visible:bg-slate-200",
                active: "active:bg-slate-300"
            };
            return {
                base: "shadow-md text-slate-500",
                hover: "hover:shadow-lg focus-visible:shadow-lg",
                active: "active:shadow-md active:bg-slate-100"
            }
        }
    };
    return (
        <button
            { ...props }
            className={classNames(
                "px-4 py-2 transition-all outline-none disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none disabled:cursor-not-allowed",
                {
                    "rounded-full": rounded === "full",
                    "rounded-lg": rounded === "lg",
                    "rounded-md": rounded === "md",
                    "rounded-xl": rounded === "xl",
                    "rounded-2xl": rounded === "2xl",
                    "rounded-none": rounded === "none",
                    "border": bordered,
                    "font-medium": variant === "subtle" || variant === "shadowed" || variant === "outlined" || variant === "solid",
                },
                color().base,
                color().hover,
                color().active,
                props.className
            )}>
            {children}
        </button>
    );
};
