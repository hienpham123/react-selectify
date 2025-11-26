import { RefObject } from 'react';
interface UseClickOutsideProps {
    ref: RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    onClose: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
}
export declare function useClickOutside({ ref, isOpen, onClose, inputRef }: UseClickOutsideProps): void;
export {};
