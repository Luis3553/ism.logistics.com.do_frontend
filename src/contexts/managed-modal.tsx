import { Modal } from "@components/Modal";
import { useModalAction, useModalState } from "./modal-context";
import TaskCreateModal from "@pages/Tasks/components/task-create-modal";
import CheckpointsImportModal from "@pages/Planification/components/checkpointsImportModal";

export default function ManagedModal() {
    const { isOpen, view, data } = useModalState();
    const { closeModal } = useModalAction();
    
    if (view === "TASK_CONFIG") return <TaskCreateModal open={isOpen} {...data} />;

    if (view === "CHECKPOINTS_IMPORT") return <CheckpointsImportModal open={isOpen} />

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            {view === "CONFIRMATION_POPUP" && <>hjjjjjjjjjjj</>}
        </Modal>
    );
}
