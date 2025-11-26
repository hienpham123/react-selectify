/// <reference types="react" />
import { Option } from '../types';
interface UseKeyboardProps {
    isOpen: boolean;
    filteredOptions: Option[];
    selected: Option[];
    multiple: boolean;
    onSelect: (event: React.KeyboardEvent<HTMLInputElement>, option: Option) => void;
    optionRefs: React.MutableRefObject<{
        [key: string]: HTMLLabelElement | null;
    }>;
}
export declare function useKeyboard({ isOpen, filteredOptions, selected, multiple, onSelect, optionRefs }: UseKeyboardProps): {
    highlightIndex: number;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => boolean | undefined;
    resetHighlight: () => void;
};
export {};
