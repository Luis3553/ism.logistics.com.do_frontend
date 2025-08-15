import { LoadSpinner } from "@components/LoadSpinner";
import { Modal } from "@components/Modal";
import { HiXMark } from "react-icons/hi2";

export const ImageModal = ({ isOpen, onClose, imageUrl, loading = false }: { isOpen: boolean; onClose: () => void; imageUrl: string; loading?: boolean; }) => {
    return (
        <Modal className='h-min w-min max-w-[500px]' onClose={onClose} isOpen={isOpen}>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-lg font-semibold'>Imagen</h1>
                <button
                    className='flex items-center justify-center p-1 transition rounded-full outline-none focus-visible:bg-black/10 hover:bg-black/10 active:bg-black/20'
                    onClick={onClose}>
                    <HiXMark className='size-5' />
                </button>
            </div>
            <div className='flex items-center justify-center w-full h-full min-h-[300px] min-w-[300px]'>
                {loading ? (
                    <LoadSpinner />
                ) : (
                    <img
                        src={imageUrl}
                        className='w-auto h-auto max-w-[90vw] max-h-[500px] rounded-xl'
                        style={{ objectFit: "contain", display: "block", margin: "auto" }}
                        alt='Preview' />
                )}
            </div>
        </Modal>
    );
};
