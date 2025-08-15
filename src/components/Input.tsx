import React, { useRef } from "react";
import classNames from "classnames";
import { HiXMark } from "react-icons/hi2";

export default function Input({ clearable = false, label = undefined, ...props }: { label?: string; clearable?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className='relative'>
            <input
                {...props}
                ref={inputRef}
                type='text'
                className={classNames(
                    "w-full p-3 pe-12 caret-brand-blue transition-all border rounded-md outline-none",
                    "focus-visible:border-brand-blue hover:border-brand-light-blue",
                )}
            />
            {clearable && (
                <button
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.value = "";
                            if (props.onChange) {
                                const event = new Event("input", { bubbles: true });
                                inputRef.current.dispatchEvent(event);
                            }
                        }
                    }}
                    type='button'
                    className='absolute inset-0 p-1 my-auto transition-all bg-white rounded-full shadow-lg outline-none w-min ms-auto me-4 h-min hover:bg-slate-100 focus-visible:bg-slate-100 active:bg-slate-200 shadow-white'>
                    <HiXMark />
                </button>
            )}
        </div>
    );
}
