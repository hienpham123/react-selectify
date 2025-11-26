/// <reference types="react" />
import { Option } from '../types';
interface UseSelectionProps {
    selectedKeys?: string[];
    options: Option[];
    multiple: boolean;
    onChange?: (event?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: Option) => void;
}
export declare function useSelection({ selectedKeys, options, multiple, onChange }: UseSelectionProps): {
    selected: Option[];
    handleSelection: (event?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: Option, checked?: boolean) => void;
};
export {};
