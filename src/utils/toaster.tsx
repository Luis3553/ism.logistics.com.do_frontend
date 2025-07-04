import { Message } from "rsuite";
import cn from "classnames";

export default function messageToaster(message: string, type: "warning" | "success" | "info" | "error" = "error") {
    return (
        <Message
            className={cn(
                "*:flex *:flex-row *:items-center border bg-white/75 my-2 *:gap-x-4 p-4 rounded-lg transition-all duration-500 backdrop-blur-sm hover:backdrop-blur-md",
                type === "success" && "border-green-500/75 text-green-500",
                type === "warning" && "border-amber-400/75 text-amber-400",
                type === "info" && "border-blue-500/75 text-blue-500",
                type === "error" && "border-red-500/75 text-red-500",
            )}
            showIcon
            type={type ?? "error"}
            closable>
            {message}
        </Message>
    );
}
