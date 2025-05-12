import { useSpring } from "@react-spring/web";

export const useCountUp = (value: number) => {
    return useSpring({
        from: { number: 0 },
        number: value,
        config: { duration: 1000 },
    });
};
