import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { Checkbox, TextField, Icon } from '@fluentui/react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".hh-Multi-Select {\r\n    position: relative !important;\r\n    font-family: sans-serif;\r\n    color: #1B242A;\r\n    width: auto;\r\n    box-sizing: border-box;\r\n    font-family: \"Segoe UI\", \"Segoe UI Web (West European)\", \"Segoe UI\", -apple-system, BlinkMacSystemFont, Roboto, \"Helvetica Neue\", sans-serif;\r\n}\r\n\r\n.hh-Input-Display {\r\n    width: 100%;\r\n    border: none;\r\n    outline: none;\r\n    border-radius: 6px;\r\n    font-size: 14px;\r\n    background-color: transparent;\r\n    cursor: pointer;\r\n}\r\n\r\n.hh-Input-Display:focus {\r\n    cursor: text;\r\n}\r\n\r\n.hh-Dropdown {\r\n    position: absolute !important;\r\n    top: 100%;\r\n    left: 0;\r\n    background: #ffffff;\r\n    border-radius: 2px;\r\n    box-shadow: rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px;\r\n    outline: transparent;\r\n    z-index: 99;\r\n    transition: all 0.15s ease;\r\n    width: auto !important;\r\n    min-width: 100% !important;\r\n}\r\n\r\n.hh-Dropdown.top {\r\n    top: auto;\r\n    bottom: 100%;\r\n}\r\n\r\n.hh-Options-List {\r\n    overflow-y: auto;\r\n    max-height: 300px;\r\n}\r\n\r\n.hh-Option-Item {\r\n    display: flex !important;\r\n    align-items: center;\r\n    margin-bottom: 0 !important;\r\n    padding: 6px 8px;\r\n    cursor: pointer;\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n    min-width: 0px;\r\n    max-width: 100%;\r\n    overflow-wrap: break-word;\r\n    -webkit-font-smoothing: antialiased;\r\n    border: 1px solid transparent;\r\n    box-sizing: border-box;\r\n    transition: border-color 0.15s ease;\r\n}\r\n\r\n.hh-Option-GroupLabel {\r\n    padding: 6px 8px;\r\n    font-weight: 600;\r\n    color: #3C8A2E;\r\n}\r\n\r\n.hh-Option-Item:hover {\r\n    background-color: transparent;\r\n    border: 1px solid #7FD16F;\r\n    outline: none;\r\n}\r\n\r\n.hh-Option-Item.highlighted {\r\n    background-color: #f5f5f5;\r\n    border: 1px solid transparent;\r\n    outline: none;\r\n}\r\n\r\n.hh-Option-Item.highlighted:hover {\r\n    background-color: #f5f5f5;\r\n    border: 1px solid #7FD16F;\r\n}\r\n\r\n.hh-No-Result {\r\n    padding: 10px;\r\n    color: #999;\r\n    text-align: center;\r\n    font-size: 14px;\r\n}\r\n\r\n.hh-Input-Wrapper.disabled,\r\n.hh-Option-Item.disabled {\r\n    opacity: 0.6;\r\n    pointer-events: none;\r\n    color: #aaa;\r\n}\r\n\r\n.hh-ChevronDown-Icon {\r\n    position: absolute;\r\n    right: 2px;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n    pointer-events: none;\r\n    color: #888;\r\n    background: #f5f5f5;\r\n    padding: 4.5px 6px;\r\n    cursor: pointer !important;\r\n}\r\n\r\n.hh-Input-Wrapper:focus-within .hh-ChevronDown-Icon {\r\n    padding: 3.5px 6px !important;\r\n}";
styleInject(css_248z);

function useSelection({ selectedKeys, options, multiple, onChange }) {
    const [selected, setSelected] = useState([]);
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
                    return opt !== null && opt !== void 0 ? opt : { key: val, text: val };
                });
                return Array.from(new Set([...kept, ...added]));
            });
        }
    }, [selectedKeys, options]);
    const handleSelection = useCallback((event, option, checked) => {
        if (!option || option.disabled)
            return;
        setSelected((prev) => {
            if (!multiple) {
                // Single-select mode: replace selected with current option
                const updated = [option];
                // Always call onChange, even if selectedKeys is not provided
                onChange === null || onChange === void 0 ? void 0 : onChange(event, Object.assign(Object.assign({}, option), { selected: true }));
                return updated;
            }
            else {
                // Multi-select mode: toggle the option
                const exists = prev.find((x) => x.key === option.key);
                const updated = exists
                    ? prev.filter((x) => x.key !== option.key)
                    : [...prev, option];
                // Calculate the new selected state
                const isSelected = checked !== undefined ? checked : !exists;
                // Always call onChange, even if selectedKeys is not provided
                onChange === null || onChange === void 0 ? void 0 : onChange(event, Object.assign(Object.assign({}, option), { selected: isSelected }));
                return updated;
            }
        });
    }, [multiple, onChange]);
    return { selected, handleSelection };
}

function useFilter({ options, groups, filter }) {
    const flatOptions = !groups || groups.length === 0
        ? options
        : groups.flatMap(g => g.options);
    const filteredOptions = useMemo(() => {
        if (groups && groups.length > 0)
            return flatOptions;
        return flatOptions.filter(opt => opt.text.toLowerCase().includes(filter.toLowerCase()));
    }, [groups, flatOptions, filter]);
    const filteredGroups = useMemo(() => {
        if (!groups || groups.length === 0)
            return undefined;
        if (!filter)
            return groups;
        return groups
            .map(group => (Object.assign(Object.assign({}, group), { options: group.options.filter(opt => opt.text.toLowerCase().includes(filter.toLowerCase())) })))
            .filter(group => group.options.length > 0);
    }, [groups, filter]);
    return { flatOptions, filteredOptions, filteredGroups };
}

function useKeyboard({ isOpen, filteredOptions, selected, multiple, onSelect, optionRefs }) {
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const handleKeyDown = useCallback((e) => {
        if (!isOpen)
            return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => {
                if (filteredOptions.length === 0)
                    return -1;
                // If no item is highlighted, start from first/last item
                let nextIndex = prev;
                const direction = e.key === "ArrowDown" ? 1 : -1;
                if (prev < 0) {
                    // Start from first item (index 0) for ArrowDown, or last item for ArrowUp
                    nextIndex = direction === 1 ? 0 : filteredOptions.length - 1;
                }
                else {
                    // Move to next/previous item
                    nextIndex = (prev + direction + filteredOptions.length) % filteredOptions.length;
                }
                // Skip disabled items
                let attempts = 0;
                while (filteredOptions[nextIndex].disabled &&
                    attempts < filteredOptions.length) {
                    nextIndex = (nextIndex + direction + filteredOptions.length) % filteredOptions.length;
                    attempts++;
                }
                return nextIndex;
            });
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
                const option = filteredOptions[highlightIndex];
                if (!option.disabled) {
                    onSelect(e, option);
                }
            }
        }
        else if (e.key === " ") {
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
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            return false; // Signal to close dropdown
        }
        return true;
    }, [filteredOptions, highlightIndex, isOpen, multiple, selected, onSelect]);
    // Scroll highlighted option into view
    useEffect(() => {
        if (!isOpen || highlightIndex < 0 || highlightIndex >= filteredOptions.length)
            return;
        const option = filteredOptions[highlightIndex];
        const el = optionRefs.current[option.key];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [highlightIndex, isOpen, filteredOptions, optionRefs]);
    const resetHighlight = useCallback(() => {
        setHighlightIndex(-1);
    }, []);
    const setHighlight = useCallback((index) => {
        setHighlightIndex(index);
    }, []);
    return { highlightIndex, handleKeyDown, resetHighlight, setHighlight };
}

function useClickOutside({ ref, isOpen, onClose, inputRef }) {
    useEffect(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (e) => {
            if (!ref.current)
                return;
            if (ref.current.contains(e.target))
                return;
            const dialogElement = document.querySelector(".ms-Dialog-main, .bc-dialog, .ms-Layer");
            if (dialogElement && dialogElement.contains(e.target)) {
                const comboTrigger = ref.current.querySelector("input");
                if (comboTrigger && comboTrigger.contains(e.target))
                    return;
            }
            onClose();
        };
        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, [isOpen, ref, onClose, inputRef]);
}

function useDropdownPosition({ isOpen, positionOffset, dropdownRef, inputRef }) {
    const [actualPosition, setActualPosition] = useState(positionOffset || 'bottom');
    // Calculate position synchronously before paint to avoid flickering
    useLayoutEffect(() => {
        if (!isOpen) {
            return;
        }
        const calculatePosition = () => {
            var _a;
            // Get the actual input element from FluentUI TextField ref
            let inputElement = null;
            if (inputRef.current) {
                // FluentUI TextField ref can be the component instance or the input element
                // Check if it's a DOM element directly
                if (inputRef.current instanceof HTMLElement) {
                    inputElement = inputRef.current;
                }
                else if (inputRef.current.element) {
                    inputElement = inputRef.current.element;
                }
                else if (inputRef.current.querySelector) {
                    inputElement = inputRef.current.querySelector('input');
                }
            }
            // Fallback: try to find input from parent element (before dropdown renders)
            if (!inputElement && dropdownRef.current) {
                const inputWrapper = (_a = dropdownRef.current.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.hh-Input-Wrapper');
                inputElement = (inputWrapper === null || inputWrapper === void 0 ? void 0 : inputWrapper.querySelector('input')) || null;
            }
            // Fallback: find input from document
            if (!inputElement) {
                const inputWrapper = document.querySelector('.hh-Input-Wrapper');
                inputElement = (inputWrapper === null || inputWrapper === void 0 ? void 0 : inputWrapper.querySelector('input')) || null;
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
            }
            else if (positionOffset === 'bottom') {
                // Check if there's enough space below
                if (spaceBelow >= estimatedDropdownHeight || spaceBelow >= spaceAbove) {
                    setActualPosition('bottom');
                }
                else {
                    // Not enough space below, check if top has more space
                    if (spaceAbove > spaceBelow) {
                        setActualPosition('top');
                    }
                    else {
                        setActualPosition('bottom');
                    }
                }
            }
            else {
                // Auto mode: choose position with more space
                if (spaceAbove > spaceBelow && spaceAbove >= estimatedDropdownHeight) {
                    setActualPosition('top');
                }
                else {
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

const OptionItem = ({ option, isSelected, isHighlighted, multiple, showTooltip, renderOption, onSelect, optionRef }) => {
    const handleClick = useCallback((event) => {
        if (option.disabled)
            return;
        const target = event.target;
        // Don't handle click if clicking directly on checkbox input (it has its own handler)
        if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
            return;
        }
        // Don't handle if clicking on checkbox container elements
        const checkboxContainer = target.closest('.ms-Checkbox') ||
            target.closest('[role="checkbox"]') ||
            target.closest('.checkbox-wrapper');
        if (checkboxContainer) {
            return;
        }
        // If clicking on option-text or label itself, toggle selection
        event.stopPropagation();
        event.preventDefault();
        // For multiple mode, pass !isSelected to toggle
        // For single mode, pass true to select
        onSelect(event, option, multiple ? !isSelected : true);
    }, [option, multiple, isSelected, onSelect]);
    const handleCheckboxChange = useCallback((ev, checked) => {
        if (option.disabled)
            return;
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            onSelect(ev, option, checked);
        }
        else {
            // Create a synthetic event if none provided
            const syntheticEvent = {
                stopPropagation: () => { },
                preventDefault: () => { },
            };
            onSelect(syntheticEvent, option, checked);
        }
    }, [option, onSelect]);
    const handleWrapperClick = useCallback((e) => {
        e.stopPropagation();
    }, []);
    const commonProps = useMemo(() => ({
        "data-key": option.key,
        key: option.key,
        className: `hh-Option-Item ${option.disabled ? "disabled" : ""} ${isHighlighted ? "highlighted" : ""}`,
        tabIndex: 0,
        ref: optionRef,
        title: showTooltip ? option.text : undefined,
        onClick: handleClick
    }), [option.key, option.disabled, isHighlighted, showTooltip, option.text, optionRef, handleClick]);
    if (renderOption) {
        return (React.createElement("label", Object.assign({}, commonProps), renderOption({
            option,
            selected: isSelected,
            highlighted: isHighlighted,
            disabled: option.disabled,
            onSelect: (e) => {
                const event = e;
                handleClick(event);
            },
        })));
    }
    return (React.createElement("label", Object.assign({}, commonProps),
        multiple && (React.createElement("span", { className: "checkbox-wrapper", onClick: handleWrapperClick },
            React.createElement(Checkbox, { ariaLabelledBy: option.key, ariaDescribedBy: option.text, checked: isSelected, onChange: handleCheckboxChange, disabled: option.disabled }))),
        React.createElement("span", { className: "option-text" }, option.text)));
};
// Memoize component to prevent unnecessary re-renders
// Note: We don't compare onSelect and optionRef as they are functions and will always be different
React.memo(OptionItem, (prevProps, nextProps) => {
    // Only compare primitive values and option object properties
    return (prevProps.option.key === nextProps.option.key &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.multiple === nextProps.multiple &&
        prevProps.showTooltip === nextProps.showTooltip &&
        prevProps.option.disabled === nextProps.option.disabled &&
        prevProps.option.text === nextProps.option.text &&
        prevProps.renderOption === nextProps.renderOption);
});

function ReactSelectify(props) {
    const { options = [], groups = [], selectedKeys, onChange, disabled = false, placeholder, positionOffset = 'bottom', styles = {}, showTooltip = false, className = '', multiple = false, renderOption } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    // Refs
    const dropdownRef = useRef(null);
    const optionRefs = useRef({});
    const hasOpened = useRef(false);
    const hasSetInitialHighlight = useRef(false);
    const inputRef = useRef(null);
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
        const map = new Map();
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
        let inputElement = null;
        if (inputRef.current) {
            if (inputRef.current instanceof HTMLElement) {
                inputElement = inputRef.current;
            }
            else if (inputRef.current.element) {
                inputElement = inputRef.current.element;
            }
            else if (inputRef.current.querySelector) {
                inputElement = inputRef.current.querySelector('input');
            }
        }
        // Fallback: try to find input from document
        if (!inputElement) {
            const inputWrapper = document.querySelector('.hh-Input-Wrapper');
            inputElement = (inputWrapper === null || inputWrapper === void 0 ? void 0 : inputWrapper.querySelector('input')) || null;
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
        }
        else if (positionOffset === 'bottom') {
            if (spaceBelow >= estimatedDropdownHeight || spaceBelow >= spaceAbove) {
                return 'bottom';
            }
            else {
                return spaceAbove > spaceBelow ? 'top' : 'bottom';
            }
        }
        else {
            return spaceAbove > spaceBelow && spaceAbove >= estimatedDropdownHeight ? 'top' : 'bottom';
        }
    }, [isOpen, positionOffset, inputRef]);
    // Create handleSelect that will be used by both keyboard and click handlers
    const handleSelectRef = useRef(() => { });
    const { highlightIndex, handleKeyDown, resetHighlight, setHighlight } = useKeyboard({
        isOpen,
        filteredOptions,
        selected,
        multiple,
        onSelect: (event, option) => {
            var _a;
            // Call the actual handleSelect if it exists (for keyboard navigation)
            (_a = handleSelectRef.current) === null || _a === void 0 ? void 0 : _a.call(handleSelectRef, event, option, undefined);
        },
        optionRefs
    });
    // Now create handleSelect with access to resetHighlight
    const handleSelect = useCallback((event, option, checked) => {
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
                    var _a;
                    (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                }, 0);
            }
        }
        else {
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
        var _a;
        setIsOpen(false);
        setFilter("");
        resetHighlight();
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
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
        }
        else if (isOpen && !multiple && !hasSetInitialHighlight.current) {
            // Only set highlight once when dropdown first opens
            if (selected.length > 0 && filteredOptions.length > 0) {
                // Find the first selected option in filteredOptions
                const firstSelectedIndex = filteredOptions.findIndex(opt => selected.some(sel => sel.key === opt.key));
                if (firstSelectedIndex >= 0) {
                    // Use setTimeout to ensure this runs after the dropdown is rendered
                    setTimeout(() => {
                        setHighlight(firstSelectedIndex);
                        hasSetInitialHighlight.current = true;
                    }, 0);
                }
                else {
                    hasSetInitialHighlight.current = true;
                }
            }
            else {
                hasSetInitialHighlight.current = true;
            }
        }
    }, [isOpen, multiple, selected, filteredOptions, setHighlight, resetHighlight]);
    // When dropdown opens, scroll first selected option into view
    useEffect(() => {
        if (isOpen && !hasOpened.current && selected.length > 0) {
            const sortedSelected = [...selected].sort((a, b) => a.text.localeCompare(b.text));
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
    const handleInputChange = (e) => {
        setFilter(e.currentTarget.value);
        setIsOpen(true);
    };
    const handleInputKeyDown = (e) => {
        const shouldClose = handleKeyDown(e);
        if (shouldClose === false) {
            setIsOpen(false);
        }
    };
    const getDisplayValue = () => {
        if (selected.length === 0)
            return "";
        if (!multiple)
            return selected[0].text;
        return selected.map(x => x.text).join(", ");
    };
    const getInputValue = () => {
        if (isOpen) {
            return filter;
        }
        return "";
    };
    return (React.createElement("div", { className: `hh-Multi-Select ${className}`, ref: dropdownRef, style: Object.assign({}, styles['root']) },
        React.createElement("div", { className: `hh-Input-Wrapper ${disabled ? 'disabled' : ''}` },
            React.createElement(TextField, { componentRef: inputRef, placeholder: getDisplayValue() || placeholder, onClick: toggleDropdown, onKeyDown: handleInputKeyDown, onChange: handleInputChange, value: getInputValue(), className: "hh-Input-Display", disabled: disabled, style: Object.assign({}, styles['input']), autoComplete: "off", readOnly: !isOpen && multiple }),
            React.createElement("div", { className: "hh-ChevronDown-Icon" },
                React.createElement(Icon, { iconName: "ChevronDown", style: { fontSize: 16 } }))),
        isOpen && (React.createElement("div", { className: `hh-Dropdown ${actualPosition}` },
            React.createElement("div", { className: "hh-Options-List", style: Object.assign({}, styles['callOut']) }, filteredGroups !== undefined ? (filteredGroups.length === 0 ? (React.createElement("div", { className: "hh-No-Result" }, "No results found")) : filteredGroups.map((group) => (React.createElement("div", { key: group.label, className: "hh-Option-Group" },
                React.createElement("div", { style: Object.assign({}, styles['groupLabel']), className: "hh-Option-GroupLabel" }, group.label),
                group.options.map((option) => {
                    var _a;
                    const globalIndex = (_a = optionIndexMap.get(option.key)) !== null && _a !== void 0 ? _a : -1;
                    const isSelected = selectedKeysSet.has(option.key);
                    const isHighlighted = highlightIndex === globalIndex;
                    return (React.createElement(OptionItem, { key: option.key, option: option, isSelected: isSelected, isHighlighted: isHighlighted, multiple: multiple, showTooltip: showTooltip, renderOption: renderOption, onSelect: handleSelect, optionRef: (el) => {
                            optionRefs.current[option.key] = el;
                        } }));
                }))))) : filteredOptions.length === 0 ? (React.createElement("div", { className: "hh-No-Result" }, "No results found")) : filteredOptions.map((option, i) => {
                const isSelected = selectedKeysSet.has(option.key);
                const isHighlighted = highlightIndex === i;
                return (React.createElement(OptionItem, { key: option.key, option: option, isSelected: isSelected, isHighlighted: isHighlighted, multiple: multiple, showTooltip: showTooltip, renderOption: renderOption, onSelect: handleSelect, optionRef: (el) => {
                        optionRefs.current[option.key] = el;
                    } }));
            }))))));
}

export { ReactSelectify };
//# sourceMappingURL=index.js.map
