import { useState, useEffect, useLayoutEffect, useRef, RefObject } from 'react';

interface UseDropdownPositionProps {
    isOpen: boolean;
    positionOffset?: 'top' | 'bottom';
    dropdownRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
}

export function useDropdownPosition({
    isOpen,
    positionOffset,
    dropdownRef,
    inputRef
}: UseDropdownPositionProps) {
    const [actualPosition, setActualPosition] = useState<'top' | 'bottom'>(positionOffset || 'bottom');

    // Calculate position synchronously before paint to avoid flickering
    useLayoutEffect(() => {
        if (!isOpen) {
            return;
        }

        const calculatePosition = () => {
            // Get the actual input element from FluentUI TextField ref
            let inputElement: HTMLElement | null = null;
            if (inputRef.current) {
                // FluentUI TextField ref can be the component instance or the input element
                // Check if it's a DOM element directly
                if (inputRef.current instanceof HTMLElement) {
                    inputElement = inputRef.current;
                } else if ((inputRef.current as any).element) {
                    inputElement = (inputRef.current as any).element;
                } else if ((inputRef.current as any).querySelector) {
                    inputElement = (inputRef.current as any).querySelector('input');
                }
            }

            // Fallback: try to find input from parent element (before dropdown renders)
            if (!inputElement && dropdownRef.current) {
                const inputWrapper = dropdownRef.current.parentElement?.querySelector('.hh-Input-Wrapper');
                inputElement = inputWrapper?.querySelector('input') as HTMLElement || null;
            }

            // Fallback: find input from document
            if (!inputElement) {
                const inputWrapper = document.querySelector('.hh-Input-Wrapper');
                inputElement = inputWrapper?.querySelector('input') as HTMLElement || null;
            }

            if (!inputElement) {
                // If can't find input, use default position
                setActualPosition(positionOffset || 'bottom');
                return;
            }

            const inputRect = inputElement.getBoundingClientRect();
            
            if (!inputRect) {
                setActualPosition(positionOffset || 'bottom');
                return;
            }

            // Get viewport dimensions
            const viewportHeight = window.innerHeight;

            // Calculate space below and above
            const spaceBelow = viewportHeight - inputRect.bottom;
            const spaceAbove = inputRect.top;

            // Use estimated dropdown height (max-height is 300px from CSS)
            const estimatedDropdownHeight = 300;

            // If user explicitly set position, respect it unless there's not enough space
            if (positionOffset === 'top') {
                setActualPosition('top');
            } else if (positionOffset === 'bottom') {
                // Check if there's enough space below
                if (spaceBelow >= estimatedDropdownHeight || spaceBelow >= spaceAbove) {
                    setActualPosition('bottom');
                } else {
                    // Not enough space below, check if top has more space
                    if (spaceAbove > spaceBelow) {
                        setActualPosition('top');
                    } else {
                        setActualPosition('bottom');
                    }
                }
            } else {
                // Auto mode: choose position with more space
                if (spaceAbove > spaceBelow && spaceAbove >= estimatedDropdownHeight) {
                    setActualPosition('top');
                } else {
                    setActualPosition('bottom');
                }
            }
        };

        // Calculate position synchronously before render to avoid flickering
        // Use flushSync or immediate calculation
        calculatePosition();

        // Recalculate on scroll and resize (only when open)
        const handleScroll = () => {
            if (isOpen) {
                calculatePosition();
            }
        };
        
        const handleResize = () => {
            if (isOpen) {
                calculatePosition();
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, positionOffset, dropdownRef, inputRef]);

    return actualPosition;
}

