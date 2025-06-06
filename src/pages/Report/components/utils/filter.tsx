import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export function Filter({ filter, setFilter }: { filter: string; setFilter: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div className='relative border-y'>
            <label htmlFor='search' className='absolute start-2 top-3.5'>
                <HiMagnifyingGlass />
            </label>
            <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type='text'
                name='search'
                id='search'
                placeholder='Buscar'
                className='w-full p-2 transition outline-none pe-8 focus:bg-blue-100/50 ps-10 focus:border-brand-blue'
                autoComplete="off"
            />
            <button onClick={() => setFilter("")} className='absolute p-1 transition-all rounded-lg outline-none top-2 end-2 aspect-square focus-visible:bg-red-100 hover:bg-red-100 active:bg-red-200'>
                <HiXMark />
            </button>
        </div>
    );
}