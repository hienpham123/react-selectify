import { useMemo } from 'react';
import { Option, OptionGroup } from '../types';

interface UseFilterProps {
    options: Option[];
    groups: OptionGroup[];
    filter: string;
}

export function useFilter({ options, groups, filter }: UseFilterProps) {
    const flatOptions = !groups || groups.length === 0
        ? options
        : groups.flatMap(g => g.options);

    const filteredOptions = useMemo(() => {
        if (groups && groups.length > 0) return flatOptions;
        return flatOptions.filter(opt =>
            opt.text.toLowerCase().includes(filter.toLowerCase())
        );
    }, [groups, flatOptions, filter]);

    const filteredGroups = useMemo(() => {
        if (!groups || groups.length === 0) return undefined;
        if (!filter) return groups;

        return groups
            .map(group => ({
                ...group,
                options: group.options.filter(opt =>
                    opt.text.toLowerCase().includes(filter.toLowerCase())
                ),
            }))
            .filter(group => group.options.length > 0);
    }, [groups, filter]);

    return { flatOptions, filteredOptions, filteredGroups };
}

