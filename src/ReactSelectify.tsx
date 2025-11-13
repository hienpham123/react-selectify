import React, { useState, useRef, useEffect, useCallback, useMemo, FormEvent } from "react";
import "./ReactSelectify.css";
import { Checkbox, Icon, TextField } from "@fluentui/react";

export interface Option {
    key: string;
    text: string;
    disabled?: boolean;
    data?: any;
    selected?: boolean;
}

export interface OptionGroup {
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
    styles?: { [key: string]: React.CSSProperties };

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


export default function ReactSelectify(props: ReactSelectifyProps) {
    const {
        options = [],
        groups = [],
        selectedKeys = [],
        onChange,
        disabled = false,
        placeholder,
        positionOffset = 'bottom',
        styles = {},
        showTooltip = false,
        className = '',
        multiple = false,
        renderOption
    } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [selected, setSelected] = useState<Option[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    // Ref for the entire dropdown container
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Ref to store references to option label elements for scrolling
    const optionRefs = useRef<{ [key: string]: HTMLLabelElement | null }>({});
    // Ref to track whether the dropdown has been opened at least once
    const hasOpened = useRef<boolean>(false);
    // Ref for the input element
    const inputRef = useRef<HTMLInputElement | any>(null);

    const toggleDropdown = () => setIsOpen(true);

    const flatOptions = !groups || groups.length === 0
        ? options
        : groups.flatMap(g => g.options);

    /**
     * Filters the flat list of options (when no groups are used)
     * - If groups exist, skip filtering since grouped data is handled separately
     * - Otherwise, filter options by text based on the user's input
     */
    const filteredOptions = useMemo(() => {
        if (groups && groups.length > 0) return flatOptions;
        return flatOptions.filter(opt =>
            opt.text.toLowerCase().includes(filter.toLowerCase())
        );
    }, [groups, flatOptions, filter]);

    /**
     * Filters grouped options when groups are provided
     * - Returns undefined if no groups exist
     * - Returns all groups if the filter input is empty
     * - Otherwise, filters each group and keeps only groups with matching options
     */
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

    /**
     * Handles checkbox selection changes
     * @param event - The form event from the checkbox
     * @param checked - The new checked state
     * @param option - The option being toggled
     */
    const handleCheckboxChange = useCallback((
        event?: React.FormEvent<HTMLElement | HTMLInputElement>,
        checked?: boolean,
        option?: Option
    ) => {
        if (event?.type === "click" && (event.target as HTMLElement).tagName !== "INPUT") {
            setHighlightIndex(-1);
            inputRef.current?.focus();
        }

        if (!option || option.disabled) return;
        setSelected((prev) => {
            if (!multiple) {
                // Single-select mode: replace selected with current option
                const updated = [option];
                onChange?.(event, { ...option, selected: true });
                return updated;
            } else {
                // Multi-select mode (existing behavior)
                const exists = prev.find((x) => x.key === option.key);
                const updated = exists
                    ? prev.filter((x) => x.key !== option.key)
                    : [...prev, option];
                onChange?.(event, { ...option, selected: checked ?? !exists });
                return updated;
            }
        });
    }, [multiple, onChange]);

    /**
     * Handles keyboard navigation and selection for the dropdown list
     * - ArrowUp / ArrowDown: move highlight between options (skip disabled)
     * - Enter / Space: select highlighted option
     * - Escape: close dropdown
     */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!isOpen) return; // Do nothing if dropdown is closed

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();

                setHighlightIndex((prev) => {
                    if (filteredOptions.length === 0) return -1;

                    let nextIndex = prev;
                    const direction = e.key === "ArrowDown" ? 1 : -1;
                    let attempts = 0;

                    // Loop through options until a non-disabled one is found or all checked
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
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                // Select the highlighted option if valid
                if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
                    const option = filteredOptions[highlightIndex];
                    if (!option.disabled) {
                        if (multiple) {
                            // Multi-select: toggle the option
                            handleCheckboxChange(e, !selected.some((s) => s.key === option.key), option);
                        } else {
                            // Single-select: select option and close dropdown
                            setSelected([option]);
                            onChange?.(e, { ...option, selected: true });
                            setIsOpen(false);
                        }
                    }
                }
            } else if (e.key === "Escape") {
                // Close dropdown when Escape is pressed
                setIsOpen(false);
            }
        },
        [filteredOptions, highlightIndex, isOpen, multiple, selected, handleCheckboxChange, onChange]
    );

    /**
     * Sync selected state with the value prop
     * Keeps existing selected items that are still in value, and adds new ones from value
     */
    useEffect(() => {
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
    }, [selectedKeys, options]);

    /**
     * Close the dropdown when clicking outside of it
     * Allows clicks inside modal/dialog to not close dropdown
     */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current) return;
            if (dropdownRef.current.contains(e.target as Node)) return;

            const dialogElement = document.querySelector(".ms-Dialog-main, .bc-dialog, .ms-Layer");
            if (dialogElement && dialogElement.contains(e.target as Node)) {
                const comboTrigger = dropdownRef.current.querySelector("input");
                if (comboTrigger && comboTrigger.contains(e.target as Node)) return;
            }

            setIsOpen(false);
            setFilter("");
            setHighlightIndex(-1);
            inputRef.current?.blur();
        };

        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    /**
     * When dropdown opens, scroll the first selected option into view
     * Selected options are sorted alphabetically (A → Z) before scrolling
     */
    useEffect(() => {
        if (isOpen && !hasOpened.current && selected.length > 0) {
            const sortedSelected = [...selected].sort((a, b) =>
                a.text.localeCompare(b.text)
            );

            const firstCheckedKey = sortedSelected[0].key;
            const el = optionRefs.current[firstCheckedKey];
            if (el) {
                el.scrollIntoView({ block: "nearest" });
            }

            hasOpened.current = true;
        }

        if (!isOpen) {
            hasOpened.current = false;
        }
    }, [isOpen, selected]);

    /**
     * Scroll the highlighted option into view when navigating with keyboard
     * Only triggers when the dropdown is open and highlightIndex is valid
     * This ensures the user always sees the currently highlighted option
     */
    useEffect(() => {
        if (!isOpen || highlightIndex < 0 || highlightIndex >= filteredOptions.length) return;

        const option = filteredOptions[highlightIndex];
        const el = optionRefs.current[option.key];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [highlightIndex, isOpen, filteredOptions]);

    const commonProps = (
        option: Option,
        isHighlighted: boolean,
        isSelected: boolean,
    ) => ({
        "data-key": option.key,
        key: option.key,
        className: `th-Option-Item ${option.disabled ? "disabled" : ""} ${isHighlighted ? "highlighted" : ""}`,
        tabIndex: 0,
        ref: (el: HTMLLabelElement | null) => {
            optionRefs.current[option.key] = el;
        },
        title: showTooltip ? option.text : undefined,
        onClick: (event: React.FormEvent<HTMLElement | HTMLInputElement>) => {
            if (option.disabled) return;
            if (multiple) {
                handleCheckboxChange(event, !isSelected, option);
            } else {
                setSelected([option]);
                onChange?.(event, { ...option, selected: true });
                setIsOpen(false);
            }
        }
    });

    return (
        <div className={`th-Multi-Select ${className}`} ref={dropdownRef} style={{ ...styles['root'] }}>
            <div className={`th-Input-Wrapper ${disabled ? 'disabled' : ''}`}>
                {/* Input field to display selected items and filter options */}
                <TextField
                    componentRef={inputRef}
                    placeholder={
                        selected.length
                            ? !multiple
                                ? selected[0].text
                                : selected.map(x => x.text).join(", ")
                            : placeholder
                    }
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    onChange={(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setFilter(e.currentTarget.value);
                        setIsOpen(true);
                    }}
                    value={filter}
                    className="th-Input-Display"
                    disabled={disabled}
                    style={{ ...styles['input'] }}
                    autoComplete="off"
                />
                {/* Chevron icon indicating dropdown */}
                <div className="th-ChevronDown-Icon">
                    <Icon iconName="ChevronDown" style={{ fontSize: 16 }} />
                </div>
            </div>

            {isOpen && (
                <div className={`th-Dropdown ${positionOffset}`}>
                    <div className="th-Options-List" style={{ ...styles['callOut'] }}>
                        {filteredGroups ? filteredGroups.map((group) => (
                            <div key={group.label} className="th-Option-Group">
                                <div style={{ ...styles['groupLabel'] }} className="th-Option-GroupLabel">
                                    {group.label}
                                </div>
                                {group.options.map((option, i) => {
                                    const globalIndex = flatOptions.findIndex(o => o.key === option.key);
                                    const isSelected = selected.some(s => s.key === option.key);
                                    const isHighlighted = highlightIndex === globalIndex;
                                    const defaultProps = commonProps(option, isHighlighted, isSelected);

                                    if (renderOption) {
                                        return (
                                            <label {...defaultProps}>
                                                {renderOption({
                                                    option,
                                                    selected: isSelected,
                                                    highlighted: isHighlighted,
                                                    disabled: option.disabled,
                                                    onSelect: (e: FormEvent<HTMLElement | HTMLInputElement>) => defaultProps.onClick?.(e),
                                                })}
                                            </label>
                                        );
                                    }

                                    return (
                                        <label {...defaultProps}>
                                            {multiple && (
                                                <Checkbox
                                                    ariaLabelledBy={option.key}
                                                    ariaDescribedBy={option.text}
                                                    checked={isSelected}
                                                    onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => handleCheckboxChange(ev, checked, option)}
                                                    disabled={option.disabled}
                                                />
                                            )}
                                            {option.text}
                                        </label>
                                    );
                                })}
                            </div>
                        )) : filteredOptions.map((option, i) => {
                            const globalIndex = i;
                            const isSelected = selected.some(s => s.key === option.key);
                            const isHighlighted = highlightIndex === globalIndex;

                            const defaultProps = commonProps(option, isHighlighted, isSelected);

                            if (renderOption) {
                                return (
                                    <label {...defaultProps}>
                                        {renderOption({
                                            option,
                                            selected: isSelected,
                                            highlighted: isHighlighted,
                                            disabled: option.disabled,
                                            onSelect: (e: FormEvent<HTMLElement | HTMLInputElement>) => defaultProps.onClick?.(e),
                                        })}
                                    </label>
                                );
                            }

                            return (
                                <label {...defaultProps}>
                                    {multiple && (
                                        <Checkbox
                                            ariaLabelledBy={option.key}
                                            ariaDescribedBy={option.text}
                                            checked={isSelected}
                                            onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => handleCheckboxChange(ev, checked, option)}
                                            disabled={option.disabled}
                                        />
                                    )}
                                    {option.text}
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
