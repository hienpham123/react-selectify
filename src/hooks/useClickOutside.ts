import { useEffect, RefObject } from 'react';

interface UseClickOutsideProps {
    ref: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    onClose: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

export function useClickOutside({ ref, isOpen, onClose, inputRef }: UseClickOutsideProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (!ref.current) return;
            if (ref.current.contains(e.target as Node)) return;

            const dialogElement = document.querySelector(".ms-Dialog-main, .bc-dialog, .ms-Layer");
            if (dialogElement && dialogElement.contains(e.target as Node)) {
                const comboTrigger = ref.current.querySelector("input");
                if (comboTrigger && comboTrigger.contains(e.target as Node)) return;
            }

            onClose();
        };

        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, [isOpen, ref, onClose, inputRef]);
}

