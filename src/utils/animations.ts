export const appearAnimationProps = {
    appear: true,
    enterFrom: "opacity-0 invisible",
    enterTo: "opacity-100 visible",
    leaveFrom: "opacity-100 visible",
    leaveTo: "opacity-0 invisible",
    leave: "transition-all",
    enter: "transition-all",
};

export const expandAnimationProps = {
    appear: true,
    enterFrom: "max-h-0 opacity-0",
    enterTo: "max-h-[1000px] opacity-100",
    leaveFrom: "max-h-[1000px] opacity-100",
    leaveTo: "max-h-0 opacity-0",
    leave: "transition-all duration-400 ease-in-out",
    enter: "transition-all duration-400 ease-in-out",
};

export const scaleAnimationProps = {
    appear: true,
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leaveFrom: "transform opacity-0 scale-95",
    leaveTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    enter: "transition ease-in duration-100",
};
