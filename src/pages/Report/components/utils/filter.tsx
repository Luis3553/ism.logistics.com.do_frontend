import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import cn from "classnames";

export function Filter({ filter, setFilter, className }: { filter: string; setFilter: React.Dispatch<React.SetStateAction<string>>; className?: string }) {
    return (
        <div className={cn('relative flex w-full items-center hover:bg-blue-50 focus-within:bg-blue-50', className)}>
            <label htmlFor='search' className='p-2'>
                <HiMagnifyingGlass />
            </label>
            <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type='text'
                name='search'
                id='search'
                placeholder='Buscar'
                className='w-full py-1.5 transition bg-transparent outline-none md:p-2 pe-8 ps-10'
                autoComplete="off"
            />
            <button onClick={() => setFilter("")} className='mx-2 p-1 transition-all rounded-full outline-none top-1.5 md:top-2 end-2 aspect-square focus-visible:bg-red-100 hover:bg-red-100 active:bg-red-200'>
                <HiXMark />
            </button>
        </div>
    );
}