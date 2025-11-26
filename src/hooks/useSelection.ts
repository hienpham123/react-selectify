import { useState, useEffect, useCallback } from 'react';
import { Option } from '../types';

interface UseSelectionProps {
    selectedKeys?: string[];
    options: Option[];
    multiple: boolean;
    onChange?: (event?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: Option) => void;
}

export function useSelection({ selectedKeys, options, multiple, onChange }: UseSelectionProps) {
    const [selected, setSelected] = useState<Option[]>([]);

    // Sync selected state with selectedKeys prop
    // Only sync if selectedKeys is provided (not undefined)
    useEffect(() => {
        // If selectedKeys is explicitly provided (even if empty array), sync with it
        // If selectedKeys is undefined, keep internal state
        if (selectedKeys !== undefined) {
            setSelected((prev) => {
                const kept = prev.filter((sel) => selectedKeys.includes(sel.key));

                const added = selectedKeys
                    .filter((val) => !prev.some((sel) => sel.key === val))
                    .map((val) => {
                        const opt = options.find((o) => o.key === val);
                        return opt ?? { key: val, text: val };
                    });

                return Array.from(new Set([...kept, ...added]));
            });
        }
    }, [selectedKeys, options]);

    const handleSelection = useCallback((
        event?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: Option,
        checked?: boolean
    ) => {
        if (!option || option.disabled) return;

        setSelected((prev) => {
            if (!multiple) {
                // Single-select mode: replace selected with current option
                const updated = [option];
                // Always call onChange, even if selectedKeys is not provided
                onChange?.(event, { ...option, selected: true });
                return updated;
            } else {
                // Multi-select mode: toggle the option
                const exists = prev.find((x) => x.key === option.key);
                const updated = exists
                    ? prev.filter((x) => x.key !== option.key)
                    : [...prev, option];
                
                // Calculate the new selected state
                const isSelected = checked !== undefined ? checked : !exists;
                // Always call onChange, even if selectedKeys is not provided
                onChange?.(event, { ...option, selected: isSelected });
                return updated;
            }
        });
    }, [multiple, onChange]);

    return { selected, handleSelection };
}

