export const Button = ({ children }: { children: string }) => {
    return (
        <button
            aria-selected="true"
            className="btns-home-chart aria-selected:bg-brand-blue aria-selected:text-white cursor-pointer rounded-lg px-4 py-2 bg-white hover:bg-brand-blue shadow-sm shadow-black/10 text-brand-blue hover:text-white transition-all duration-100">
            {children}
        </button>
    );
};
