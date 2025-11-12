import React from 'react';

interface Option {
    key: string;
    text: string;
    disabled?: boolean;
    data?: any;
    selected?: boolean;
}
interface OptionGroup {
    label: string;
    options: Option[];
}
interface ReactSelectifyProps {
    /**
     * List of options when not using groups
     * Each option should have a unique `key` and a display `text`
     */
    options?: Option[];
    /**
     * List of option groups for grouping options
     * Each group has a `label` and an array of `options`
     */
    groups?: OptionGroup[];
    /**
     * List of selected option keys
     * Used to sync the selected state from outside
     */
    selectedKeys?: string[];
    /**
     * Callback triggered when selection changes
     * @param event - The original form event from the click or keyboard action
     * @param option - The option that was changed (with selected state)
     */
    onChange?: (event?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: Option) => void;
    /**
     * Whether the entire combo box is disabled
     * When true, user cannot open dropdown or change selection
     */
    disabled?: boolean;
    /**
     * Placeholder text displayed in the input when no option is selected
     */
    placeholder?: string;
    /**
     * Position of the dropdown relative to the input
     * 'bottom' (default) or 'top'
     */
    positionOffset?: 'top' | 'bottom';
    /**
     * Inline styles for customizing appearance
     * Can target `root`, `input`, `callOut`, `groupLabel` etc.
     */
    styles?: {
        [key: string]: React.CSSProperties;
    };
    /**
     * Whether to show full option text as tooltip on hover
     */
    showTooltip?: boolean;
    /**
     * Additional CSS class for the root element
     */
    className?: string;
    /**
     * Whether multiple selections are allowed
     * If true, checkboxes appear and multiple options can be selected
     */
    multiple?: boolean;
    /**
     * Custom render function for each option
     * Allows overriding default option display with custom JSX
     * @param props - The option data to render
     * @returns ReactNode - The custom element to render
     */
    renderOption?: (props: any) => React.ReactNode;
}
declare function ReactSelectify({ options, groups, selectedKeys, onChange, disabled, placeholder, positionOffset, styles, showTooltip, className, multiple, renderOption }: ReactSelectifyProps): React.JSX.Element;

export { Option, OptionGroup, ReactSelectify };
