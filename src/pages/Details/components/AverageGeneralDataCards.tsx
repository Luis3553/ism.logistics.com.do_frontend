import { averageGeneralDataCardsStructure } from "../constants";

const AverageGeneralDataCards = () => {
    return (
        <>
            {averageGeneralDataCardsStructure.map((card, i) => (
                <div
                    key={i}
                    className="grid grid-cols-2 relative bottom-0 hover:bottom-1 transition-all duration-300 grid-rows-[1fr_auto] p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-brand-blue group">
                    <span className="group-hover:text-white col-start-1 col-end-2 leading-none text-brand-dark-gray">{card.title}</span>
                    <div className="flex col-start-1 col-end-2 gap-2 text-2xl font-bold group-hover:text-white">
                        <span className="col-start-1 col-end-2 text-2xl font-bold group-hover:text-white">{card.value}</span>
                        {card.valueSubfix && <span>{card.valueSubfix}</span>}
                    </div>
                    <i className={`group-hover:text-white col-start-2 col-end-3 row-start-1 row-end-3 my-auto text-4xl text-right ${card.icon} text-brand-dark-gray`}></i>
                </div>
            ))}
        </>
    );
};

export default AverageGeneralDataCards;
