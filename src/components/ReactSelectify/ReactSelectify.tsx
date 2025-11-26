import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import "./ReactSelectify.css";
import { Icon, TextField } from "@fluentui/react";
import { ReactSelectifyProps, Option, OptionGroup } from "../../types";
import { useSelection } from "../../hooks/useSelection";
import { useFilter } from "../../hooks/useFilter";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useDropdownPosition } from "../../hooks/useDropdownPosition";
import { OptionItem } from "../OptionItem/OptionItem";

export default function ReactSelectify(props: ReactSelectifyProps) {
    const {
        options = [],
        groups = [],
        selectedKeys,
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

    // Refs
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<{ [key: string]: HTMLLabelElement | null }>({});
    const hasOpened = useRef<boolean>(false);
    const hasSetInitialHighlight = useRef<boolean>(false);
    const inputRef = useRef<HTMLInputElement | any>(null);

    // Hooks
    const { selected, handleSelection } = useSelection({
        selectedKeys,
        options: !groups || groups.length === 0 ? options : groups.flatMap(g => g.options),
        multiple,
        onChange
    });

    const { flatOptions, filteredOptions, filteredGroups } = useFilter({
        options,
        groups,
        filter
    });

    // Create Set for O(1) lookup instead of O(n) with some()
    const selectedKeysSet = useMemo(() => {
        return new Set(selected.map(s => s.key));
    }, [selected]);

    // Create Map for O(1) lookup instead of O(n) with findIndex()
    const optionIndexMap = useMemo(() => {
        const map = new Map<string, number>();
        flatOptions.forEach((opt, index) => {
            map.set(opt.key, index);
        });
        return map;
    }, [flatOptions]);


    // Calculate position synchronously in render phase to avoid flickering
    // This calculates based on input element (available before dropdown renders)
    const calculatedPosition = useMemo(() => {
        if (!isOpen) {
            return positionOffset || 'bottom';
        }

        // Get the actual input element
        let inputElement: HTMLElement | null = null;
        if (inputRef.current) {
            if (inputRef.current instanceof HTMLElement) {
                inputElement = inputRef.current;
            } else if ((inputRef.current as any).element) {
                inputElement = (inputRef.current as any).element;
            } else if ((inputRef.current as any).querySelector) {
                inputElement = (inputRef.current as any).querySelector('input');
            }
        }

        // Fallback: try to find input from document
        if (!inputElement) {
            const inputWrapper = document.querySelector('.hh-Input-Wrapper');
            inputElement = inputWrapper?.querySelector('input') as HTMLElement || null;
        }

        if (!inputElement) {
            return positionOffset || 'bottom';
        }

        const inputRect = inputElement.getBoundingClientRect();
        if (!inputRect) {
            return positionOffset || 'bottom';
        }

        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;
        const estimatedDropdownHeight = 300;

        if (positionOffset === 'top') {
            return 'top';
        } else if (positionOffset === 'bottom') {
            if (spaceBelow >= estimatedDropdownHeight || spaceBelow >= spaceAbove) {
                return 'bottom';
            } else {
                return spaceAbove > spaceBelow ? 'top' : 'bottom';
            }
        } else {
            return spaceAbove > spaceBelow && spaceAbove >= estimatedDropdownHeight ? 'top' : 'bottom';
        }
    }, [isOpen, positionOffset, inputRef]);

    // Create handleSelect that will be used by both keyboard and click handlers
    const handleSelectRef = useRef<(event: React.KeyboardEvent<HTMLInputElement> | React.FormEvent<HTMLElement | HTMLInputElement>, option: Option, checked?: boolean) => void>(() => {});
    
    const { highlightIndex, handleKeyDown, resetHighlight, setHighlight } = useKeyboard({
        isOpen,
        filteredOptions,
        selected,
        multiple,
        onSelect: (event, option) => {
            // Call the actual handleSelect if it exists (for keyboard navigation)
            handleSelectRef.current?.(event, option, undefined);
        },
        optionRefs
    });

    // Now create handleSelect with access to resetHighlight
    const handleSelect = useCallback((event: React.KeyboardEvent<HTMLInputElement> | React.FormEvent<HTMLElement | HTMLInputElement>, option: Option, checked?: boolean) => {
        // Check if this is a keyboard event (Enter/Space) or click event
        // KeyboardEvent has key property, FormEvent from click doesn't
        const isKeyboardEvent = 'key' in event;
        
        if (multiple) {
            // For multiple mode, pass the checked value directly to handleSelection
            // handleSelection will handle the toggle logic internally
            handleSelection(event, option, checked);
            
            // Only reset highlight and refocus on click, not on keyboard navigation
            // This allows user to continue using arrow keys after Enter
            if (!isKeyboardEvent) {
                resetHighlight();
                // Use setTimeout to ensure focus happens after state updates
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            }
        } else {
            // For single select, always select and close
            handleSelection(event, option, true);
            setIsOpen(false);
            setFilter(""); // Clear filter when closing
        }
    }, [multiple, handleSelection, resetHighlight]);

    // Update ref so keyboard handler can use it
    handleSelectRef.current = handleSelect;

    // Use calculated position directly, only recalculate on scroll/resize
    const actualPosition = useDropdownPosition({
        isOpen,
        positionOffset: calculatedPosition,
        dropdownRef,
        inputRef
    });

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setFilter("");
        resetHighlight();
        inputRef.current?.blur();
    }, [resetHighlight]);

    useClickOutside({
        ref: dropdownRef,
        isOpen,
        onClose: handleClose,
        inputRef
    });

    // When dropdown opens, highlight selected item in single select mode
    // But only set it once when opening, don't reset on every change
    useEffect(() => {
        if (!isOpen) {
            resetHighlight();
            hasSetInitialHighlight.current = false;
        } else if (isOpen && !multiple && !hasSetInitialHighlight.current) {
            // Only set highlight once when dropdown first opens
            if (selected.length > 0 && filteredOptions.length > 0) {
                // Find the first selected option in filteredOptions
                const firstSelectedIndex = filteredOptions.findIndex(opt => 
                    selected.some(sel => sel.key === opt.key)
                );
                if (firstSelectedIndex >= 0) {
                    // Use setTimeout to ensure this runs after the dropdown is rendered
                    setTimeout(() => {
                        setHighlight(firstSelectedIndex);
                        hasSetInitialHighlight.current = true;
                    }, 0);
                } else {
                    hasSetInitialHighlight.current = true;
                }
            } else {
                hasSetInitialHighlight.current = true;
            }
        }
    }, [isOpen, multiple, selected, filteredOptions, setHighlight, resetHighlight]);

    // When dropdown opens, scroll first selected option into view
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

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(true);
        }
    };

    const handleInputChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.currentTarget.value);
        setIsOpen(true);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const shouldClose = handleKeyDown(e);
        if (shouldClose === false) {
            setIsOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (selected.length === 0) return "";
        if (!multiple) return selected[0].text;
        return selected.map(x => x.text).join(", ");
    };

    const getInputValue = () => {
        if (isOpen) {
            return filter;
        }
        return "";
    };

    return (
        <div className={`hh-Multi-Select ${className}`} ref={dropdownRef} style={{ ...styles['root'] }}>
            <div className={`hh-Input-Wrapper ${disabled ? 'disabled' : ''}`}>
                <TextField
                    componentRef={inputRef}
                    placeholder={getDisplayValue() || placeholder}
                    onClick={toggleDropdown}
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
                    value={getInputValue()}
                    className="hh-Input-Display"
                    disabled={disabled}
                    style={{ ...styles['input'] }}
                    autoComplete="off"
                    readOnly={!isOpen && multiple}
                />
                <div className="hh-ChevronDown-Icon">
                    <Icon iconName="ChevronDown" style={{ fontSize: 16 }} />
                </div>
            </div>

            {isOpen && (
                <div className={`hh-Dropdown ${actualPosition}`}>
                    <div className="hh-Options-List" style={{ ...styles['callOut'] }}>
                        {filteredGroups !== undefined ? (
                            filteredGroups.length === 0 ? (
                                <div className="hh-No-Result">
                                    No results found
                                </div>
                            ) : filteredGroups.map((group) => (
                            <div key={group.label} className="hh-Option-Group">
                                <div style={{ ...styles['groupLabel'] }} className="hh-Option-GroupLabel">
                                    {group.label}
                                </div>
                                {group.options.map((option) => {
                                    const globalIndex = optionIndexMap.get(option.key) ?? -1;
                                    const isSelected = selectedKeysSet.has(option.key);
                                    const isHighlighted = highlightIndex === globalIndex;

                                    return (
                                        <OptionItem
                                            key={option.key}
                                            option={option}
                                            isSelected={isSelected}
                                            isHighlighted={isHighlighted}
                                            multiple={multiple}
                                            showTooltip={showTooltip}
                                            renderOption={renderOption}
                                            onSelect={handleSelect}
                                            optionRef={(el: HTMLLabelElement | null) => {
                                                optionRefs.current[option.key] = el;
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ))
                        ) : filteredOptions.length === 0 ? (
                            <div className="hh-No-Result">
                                No results found
                            </div>
                        ) : filteredOptions.map((option, i) => {
                            const isSelected = selectedKeysSet.has(option.key);
                            const isHighlighted = highlightIndex === i;

                            return (
                                <OptionItem
                                    key={option.key}
                                    option={option}
                                    isSelected={isSelected}
                                    isHighlighted={isHighlighted}
                                    multiple={multiple}
                                    showTooltip={showTooltip}
                                    renderOption={renderOption}
                                    onSelect={handleSelect}
                                    optionRef={(el: HTMLLabelElement | null) => {
                                        optionRefs.current[option.key] = el;
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

