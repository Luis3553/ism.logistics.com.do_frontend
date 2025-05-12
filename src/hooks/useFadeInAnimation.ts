import { useSpring, SpringValues } from "@react-spring/web";

export const useFadeInUpAnimation = (delay: number, animate: boolean) => {
    return useSpring<SpringValues>({
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        config: { tension: 0 },
        delay,
    });
};
