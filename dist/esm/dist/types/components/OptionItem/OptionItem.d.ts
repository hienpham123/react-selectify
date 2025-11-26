import React from 'react';
import { Option } from '../../types';
interface OptionItemProps {
    option: Option;
    isSelected: boolean;
    isHighlighted: boolean;
    multiple: boolean;
    showTooltip: boolean;
    renderOption?: (props: any) => React.ReactNode;
    onSelect: (event: React.FormEvent<HTMLElement | HTMLInputElement>, option: Option, checked?: boolean) => void;
    optionRef: (el: HTMLLabelElement | null) => void;
}
declare const OptionItem: React.FC<OptionItemProps>;
export declare const MemoizedOptionItem: React.NamedExoticComponent<OptionItemProps>;
export { OptionItem };
