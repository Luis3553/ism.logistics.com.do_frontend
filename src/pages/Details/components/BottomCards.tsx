import { bottomCardsStructure } from "../constants";

const BottomCards = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {bottomCardsStructure.map((card, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center justify-between group relative bottom-0 hover:bottom-1 transition-all duration-300 hover:bg-[var(--blue)] p-4 bg-white rounded-lg shadow-sm hover:shadow-md">
                    <i className={`text-[var(--dark-gray)] text-4xl group-hover:text-white ${card.icon}`}></i>
                    <div>
                        <span className="text-xl font-bold group-hover:text-white">{card.value}</span>
                        {card.valueSubfix && <span className="text-xl font-bold group-hover:text-white">{card.valueSubfix}</span>}
                    </div>
                    <span className="truncate font-semibold uppercase text-[var(--dark-gray)] group-hover:text-white">{card.title}</span>
                </div>
            ))}
        </div>
    );
};

export default BottomCards;
