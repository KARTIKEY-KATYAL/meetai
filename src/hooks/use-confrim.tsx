import { JSX, useState } from "react";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";

export const useConfrim = (
    title: string,
    description: string
): [() => JSX.Element, () => Promise<boolean>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void
    } | null>(null)

    const confrim = (): Promise<boolean> => {
        return new Promise((resolve) => {
            setPromise({ resolve })
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfrim = () => {
        promise?.resolve(true)
        handleClose()
    }
    
    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const ConfrimationDialog = (): JSX.Element => {
        return (
            <ResponsiveDialog
                open={promise != null}
                onOpenChange={handleClose}
                title={title}
                description={description}
            >
                <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                    <Button
                        onClick={handleCancel}
                        className="w-full lg:w-auto rounded-md font-bold bg-red-600 text-white hover:bg-red-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfrim}
                        className="w-full lg:w-auto rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Confirm
                    </Button>
                </div>
            </ResponsiveDialog>
        )
    }

    return [ConfrimationDialog, confrim]
}