import { useEffect, useState } from "react";
import { animated } from "@react-spring/web";
import { cardsInfo } from "./constants";
import api from "../../api";
import { useFadeInUpAnimation } from "../../hooks/useFadeInAnimation";
import { useCountUp } from "../../hooks/useCountUp";

export const HomeCards = ({ date }: { date: string }) => {
    const [animate, setAnimate] = useState(false);
    const [cards, setCards] = useState(cardsInfo);

    useEffect(() => {
        setAnimate(true);

        cardsInfo.forEach(async (card) => {
            try {
                const response = await api.get(card.endpoint, { params: { date: date } });
                setCards((prevCards) => prevCards.map((c) => (c.accessor === card.accessor ? { ...c, value: response.data[card.accessor] ?? 0 } : c)));
            } catch (error) {
                console.error(`Failed to fetch ${card.endpoint}`, error);
            }
        });
    }, [date]);

    return (
        <div className="grid w-full gap-4 mt-4 grid-cols-1 min-[400px]:grid-cols-2 min-[640px]:grid-cols-3 min-[1156px]:grid-cols-6">
            {cards.map((card, i) => {
                const fadeInStyle = useFadeInUpAnimation(i * 180, animate);
                const { number } = useCountUp(card.value);

                return (
                    <animated.div
                        key={card.accessor}
                        style={fadeInStyle}
                        className="gap-2 flex min-[400px]:flex-col items-center justify-between grow basis-0 shadow-sm rounded-lg p-4 bottom-0 hover:bottom-1 hover:bg-[var(--blue)] select-none text-[var(--dark-gray)] hover:text-white hover:shadow-md relative transition-all duration-300 bg-white">
                        <i className={`text-3xl ${card.icon}`}></i>
                        <div className="flex items-center justify-between px-6 min-[400px]:justify-around min-[400px]:px-0 w-full">
                            <span className="leading-none">{card.label}</span>
                            <animated.span className="text-2xl font-semibold leading-none" id={card.accessor}>
                                {number.to((n) => Math.floor(n))}
                            </animated.span>
                        </div>
                    </animated.div>
                );
            })}
        </div>
    );
};
