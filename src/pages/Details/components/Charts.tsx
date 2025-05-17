const Charts = () => {
    return (
        <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="flex justify-between p-4 bg-white rounded-lg shadow-sm">
                <button
                    aria-selected="true"
                    className="btns-details-chart aria-selected:bg-brand-blue aria-selected:text-white truncate bg-[var(--light-gray)] py-1.5 px-3 rounded-lg cursor-pointer border border-[#DFE4EA] hover:bg-[var(--light-blue)]">
                    Cant. viajes
                </button>
                <button
                    aria-selected="false"
                    className="btns-details-chart aria-selected:bg-brand-blue aria-selected:text-white truncate bg-[var(--light-gray)] py-1.5 px-3 rounded-lg cursor-pointer border border-[#DFE4EA] hover:bg-[var(--light-blue)]">
                    Vel. promedio
                </button>
                <button
                    aria-selected="false"
                    className="btns-details-chart aria-selected:bg-brand-blue aria-selected:text-white truncate bg-[var(--light-gray)] py-1.5 px-3 rounded-lg cursor-pointer border border-[#DFE4EA] hover:bg-[var(--light-blue)]">
                    Dist. recorrida
                </button>
                <button
                    aria-selected="false"
                    className="btns-details-chart aria-selected:bg-brand-blue aria-selected:text-white truncate bg-[var(--light-gray)] py-1.5 px-3 rounded-lg cursor-pointer border border-[#DFE4EA] hover:bg-[var(--light-blue)]">
                    Tiempo de viaje
                </button>
                <button
                    aria-selected="false"
                    className="btns-details-chart aria-selected:bg-brand-blue aria-selected:text-white truncate bg-[var(--light-gray)] py-1.5 px-3 rounded-lg cursor-pointer border border-[#DFE4EA] hover:bg-[var(--light-blue)]">
                    Tiempo en mov.
                </button>
            </div>
            <div className="relative p-4 bg-white rounded-lg shadow-sm">
                <div className="absolute inset-0" id="details-chart"></div>
            </div>
        </div>
    );
};

export default Charts;
