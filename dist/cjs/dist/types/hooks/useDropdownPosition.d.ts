import { RefObject } from 'react';
interface UseDropdownPositionProps {
    isOpen: boolean;
    positionOffset?: 'top' | 'bottom';
    dropdownRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
}
export declare function useDropdownPosition({ isOpen, positionOffset, dropdownRef, inputRef }: UseDropdownPositionProps): "top" | "bottom";
export {};
