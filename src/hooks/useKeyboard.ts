import { useState, useCallback, useEffect, useRef } from 'react';
import { Option } from '../types';

interface UseKeyboardProps {
    isOpen: boolean;
    filteredOptions: Option[];
    selected: Option[];
    multiple: boolean;
    onSelect: (event: React.KeyboardEvent<HTMLInputElement>, option: Option) => void;
    optionRefs: React.MutableRefObject<{ [key: string]: HTMLLabelElement | null }>;
}

export function useKeyboard({
    isOpen,
    filteredOptions,
    selected,
    multiple,
    onSelect,
    optionRefs
}: UseKeyboardProps) {
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();

                setHighlightIndex((prev) => {
                    if (filteredOptions.length === 0) return -1;

                    let nextIndex = prev;
                    const direction = e.key === "ArrowDown" ? 1 : -1;
                    let attempts = 0;

                    do {
                        nextIndex =
                            (nextIndex + direction + filteredOptions.length) %
                            filteredOptions.length;
                        attempts++;
                    } while (
                        filteredOptions[nextIndex].disabled &&
                        attempts < filteredOptions.length
                    );

                    return nextIndex;
                });
            } else if (e.key === "Enter") {
                e.preventDefault();

                if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
                    const option = filteredOptions[highlightIndex];
                    if (!option.disabled) {
                        onSelect(e, option);
                    }
                }
            } else if (e.key === " ") {
                // Only prevent space if an option is highlighted (to select it)
                // Otherwise, allow space for typing/searching
                if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
                    e.preventDefault();
                    const option = filteredOptions[highlightIndex];
                    if (!option.disabled) {
                        onSelect(e, option);
                    }
                }
                // If no option is highlighted, allow space to be typed normally
            } else if (e.key === "Escape") {
                e.preventDefault();
                return false; // Signal to close dropdown
            }
            return true;
        },
        [filteredOptions, highlightIndex, isOpen, multiple, selected, onSelect]
    );

    // Scroll highlighted option into view
    useEffect(() => {
        if (!isOpen || highlightIndex < 0 || highlightIndex >= filteredOptions.length) return;

        const option = filteredOptions[highlightIndex];
        const el = optionRefs.current[option.key];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [highlightIndex, isOpen, filteredOptions, optionRefs]);

    const resetHighlight = useCallback(() => {
        setHighlightIndex(-1);
    }, []);

    return { highlightIndex, handleKeyDown, resetHighlight };
}

