import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import cn from "classnames";

export function Filter({ filter, setFilter, className }: { filter: string; setFilter: React.Dispatch<React.SetStateAction<string>>; className?: string }) {
    return (
        <div className={cn('relative', className)}>
            <label htmlFor='search' className='absolute start-2 top-2 md:top-3'>
                <HiMagnifyingGlass />
            </label>
            <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type='text'
                name='search'
                id='search'
                placeholder='Buscar'
                className='w-full p-1.5 transition outline-none md:p-2 pe-8 focus:bg-blue-50 ps-10 focus:border-brand-blue'
                autoComplete="off"
            />
            <button onClick={() => setFilter("")} className='absolute p-1 transition-all rounded-full outline-none top-1.5 md:top-2 end-2 aspect-square focus-visible:bg-red-100 hover:bg-red-100 active:bg-red-200'>
                <HiXMark />
            </button>
        </div>
    );
}