import { Option, OptionGroup } from '../types';
interface UseFilterProps {
    options: Option[];
    groups: OptionGroup[];
    filter: string;
}
export declare function useFilter({ options, groups, filter }: UseFilterProps): {
    flatOptions: Option[];
    filteredOptions: Option[];
    filteredGroups: OptionGroup[] | undefined;
};
export {};
