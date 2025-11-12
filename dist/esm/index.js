import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { TextField, Icon, Checkbox } from '@fluentui/react';

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

var css_248z = ".th-Multi-Select {\r\n    position: relative !important;\r\n    font-family: sans-serif;\r\n    color: #1B242A;\r\n    width: auto;\r\n    box-sizing: border-box;\r\n    font-family: \"Segoe UI\", \"Segoe UI Web (West European)\", \"Segoe UI\", -apple-system, BlinkMacSystemFont, Roboto, \"Helvetica Neue\", sans-serif;\r\n}\r\n\r\n.th-Input-Display {\r\n    width: 100%;\r\n    border: none;\r\n    outline: none;\r\n    border-radius: 6px;\r\n    font-size: 14px;\r\n    background-color: transparent;\r\n    cursor: pointer;\r\n}\r\n\r\n.th-Input-Display:focus {\r\n    cursor: text;\r\n}\r\n\r\n.th-Dropdown {\r\n    position: absolute !important;\r\n    top: 100%;\r\n    left: 0;\r\n    background: #ffffff;\r\n    border-radius: 2px;\r\n    box-shadow: rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px;\r\n    outline: transparent;\r\n    z-index: 99;\r\n    transition: all 0.15s ease;\r\n}\r\n\r\n.th-Dropdown.top {\r\n    top: auto;\r\n    bottom: 100%;\r\n}\r\n\r\n.th-Options-List {\r\n    overflow-y: auto;\r\n}\r\n\r\n.th-Option-Item {\r\n    display: flex !important;\r\n    align-items: center;\r\n    margin-bottom: 0 !important;\r\n    padding: 6px 8px;\r\n    cursor: pointer;\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    white-space: nowrap;\r\n    text-overflow: ellipsis;\r\n    min-width: 0px;\r\n    max-width: 100%;\r\n    overflow-wrap: break-word;\r\n    -webkit-font-smoothing: antialiased;\r\n}\r\n\r\n.th-Option-GroupLabel {\r\n    padding: 6px 8px;\r\n    font-weight: 600;\r\n    color: #3C8A2E;\r\n}\r\n\r\n.th-Option-Item:hover {\r\n    background-color: #f5f5f5;\r\n}\r\n\r\n.th-Option-Item.highlighted {\r\n    border: 1px solid #000;\r\n    outline: none;\r\n}\r\n\r\n.th-No-Result {\r\n    padding: 10px;\r\n    color: #999;\r\n    text-align: center;\r\n    font-size: 14px;\r\n}\r\n\r\n.th-Input-Wrapper.disabled,\r\n.th-Option-Item.disabled {\r\n    opacity: 0.6;\r\n    pointer-events: none;\r\n    color: #aaa;\r\n}\r\n\r\n.th-ChevronDown-Icon {\r\n    position: absolute;\r\n    right: 2px;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n    pointer-events: none;\r\n    color: #888;\r\n    background: #f5f5f5;\r\n    padding: 5px 6px;\r\n    cursor: pointer !important;\r\n}\r\n\r\n.th-Input-Wrapper:focus-within .th-ChevronDown-Icon {\r\n    padding: 4px 6px;\r\n}";
styleInject(css_248z);

function ReactSelectify({ options = [], groups = [], selectedKeys = [], onChange, disabled = false, placeholder, positionOffset = 'bottom', styles = {}, showTooltip = false, className = '', multiple = false, renderOption }) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    // Ref for the entire dropdown container
    const dropdownRef = useRef(null);
    // Ref to store references to option label elements for scrolling
    const optionRefs = useRef({});
    // Ref to track whether the dropdown has been opened at least once
    const hasOpened = useRef(false);
    // Ref for the input element
    const inputRef = useRef(null);
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
        if (groups && groups.length > 0)
            return flatOptions;
        return flatOptions.filter(opt => opt.text.toLowerCase().includes(filter.toLowerCase()));
    }, [groups, flatOptions, filter]);
    /**
     * Filters grouped options when groups are provided
     * - Returns undefined if no groups exist
     * - Returns all groups if the filter input is empty
     * - Otherwise, filters each group and keeps only groups with matching options
     */
    const filteredGroups = useMemo(() => {
        if (!groups || groups.length === 0)
            return undefined;
        if (!filter)
            return groups;
        return groups
            .map(group => (Object.assign(Object.assign({}, group), { options: group.options.filter(opt => opt.text.toLowerCase().includes(filter.toLowerCase())) })))
            .filter(group => group.options.length > 0);
    }, [groups, filter]);
    /**
     * Handles checkbox selection changes
     * @param event - The form event from the checkbox
     * @param checked - The new checked state
     * @param option - The option being toggled
     */
    const handleCheckboxChange = useCallback((event, checked, option) => {
        var _a;
        if ((event === null || event === void 0 ? void 0 : event.type) === "click" && event.target.tagName !== "INPUT") {
            setHighlightIndex(-1);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        if (!option || option.disabled)
            return;
        setSelected((prev) => {
            if (!multiple) {
                // Single-select mode: replace selected with current option
                const updated = [option];
                onChange === null || onChange === void 0 ? void 0 : onChange(event, Object.assign(Object.assign({}, option), { selected: true }));
                return updated;
            }
            else {
                // Multi-select mode (existing behavior)
                const exists = prev.find((x) => x.key === option.key);
                const updated = exists
                    ? prev.filter((x) => x.key !== option.key)
                    : [...prev, option];
                onChange === null || onChange === void 0 ? void 0 : onChange(event, Object.assign(Object.assign({}, option), { selected: checked !== null && checked !== void 0 ? checked : !exists }));
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
    const handleKeyDown = useCallback((e) => {
        if (!isOpen)
            return; // Do nothing if dropdown is closed
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => {
                if (filteredOptions.length === 0)
                    return -1;
                let nextIndex = prev;
                const direction = e.key === "ArrowDown" ? 1 : -1;
                let attempts = 0;
                // Loop through options until a non-disabled one is found or all checked
                do {
                    nextIndex =
                        (nextIndex + direction + filteredOptions.length) %
                            filteredOptions.length;
                    attempts++;
                } while (filteredOptions[nextIndex].disabled &&
                    attempts < filteredOptions.length);
                return nextIndex;
            });
        }
        else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // Select the highlighted option if valid
            if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
                const option = filteredOptions[highlightIndex];
                if (!option.disabled) {
                    if (multiple) {
                        // Multi-select: toggle the option
                        handleCheckboxChange(e, !selected.some((s) => s.key === option.key), option);
                    }
                    else {
                        // Single-select: select option and close dropdown
                        setSelected([option]);
                        onChange === null || onChange === void 0 ? void 0 : onChange(e, Object.assign(Object.assign({}, option), { selected: true }));
                        setIsOpen(false);
                    }
                }
            }
        }
        else if (e.key === "Escape") {
            // Close dropdown when Escape is pressed
            setIsOpen(false);
        }
    }, [filteredOptions, highlightIndex, isOpen, multiple, selected, handleCheckboxChange, onChange]);
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
                return opt !== null && opt !== void 0 ? opt : { key: val, text: val };
            });
            return Array.from(new Set([...kept, ...added]));
        });
    }, [selectedKeys, options]);
    /**
     * Close the dropdown when clicking outside of it
     * Allows clicks inside modal/dialog to not close dropdown
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            var _a;
            if (!dropdownRef.current)
                return;
            if (dropdownRef.current.contains(e.target))
                return;
            const dialogElement = document.querySelector(".ms-Dialog-main, .bc-dialog, .ms-Layer");
            if (dialogElement && dialogElement.contains(e.target)) {
                const comboTrigger = dropdownRef.current.querySelector("input");
                if (comboTrigger && comboTrigger.contains(e.target))
                    return;
            }
            setIsOpen(false);
            setFilter("");
            setHighlightIndex(-1);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
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
    /**
     * Scroll the highlighted option into view when navigating with keyboard
     * Only triggers when the dropdown is open and highlightIndex is valid
     * This ensures the user always sees the currently highlighted option
     */
    useEffect(() => {
        if (!isOpen || highlightIndex < 0 || highlightIndex >= filteredOptions.length)
            return;
        const option = filteredOptions[highlightIndex];
        const el = optionRefs.current[option.key];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [highlightIndex, isOpen, filteredOptions]);
    const commonProps = (option, isHighlighted, isSelected) => ({
        "data-key": option.key,
        key: option.key,
        className: `th-Option-Item ${option.disabled ? "disabled" : ""} ${isHighlighted ? "highlighted" : ""}`,
        tabIndex: 0,
        ref: (el) => {
            optionRefs.current[option.key] = el;
        },
        title: showTooltip ? option.text : undefined,
        onClick: (event) => {
            if (option.disabled)
                return;
            if (multiple) {
                handleCheckboxChange(event, !isSelected, option);
            }
            else {
                setSelected([option]);
                onChange === null || onChange === void 0 ? void 0 : onChange(event, Object.assign(Object.assign({}, option), { selected: true }));
                setIsOpen(false);
            }
        }
    });
    return (React.createElement("div", { className: `th-Multi-Select ${className}`, ref: dropdownRef, style: Object.assign({}, styles['root']) },
        React.createElement("div", { className: `th-Input-Wrapper ${disabled ? 'disabled' : ''}` },
            React.createElement(TextField, { componentRef: inputRef, placeholder: selected.length
                    ? !multiple
                        ? selected[0].text
                        : selected.map(x => x.text).join(", ")
                    : placeholder, onClick: toggleDropdown, onKeyDown: handleKeyDown, onChange: (e) => {
                    setFilter(e.currentTarget.value);
                    setIsOpen(true);
                }, value: filter, className: "th-Input-Display", disabled: disabled, style: Object.assign({}, styles['input']), autoComplete: "off" }),
            React.createElement("div", { className: "th-ChevronDown-Icon" },
                React.createElement(Icon, { iconName: "ChevronDown", style: { fontSize: 16 } }))),
        isOpen && (React.createElement("div", { className: `th-Dropdown ${positionOffset}` },
            React.createElement("div", { className: "th-Options-List", style: Object.assign({}, styles['callOut']) }, filteredGroups ? filteredGroups.map((group) => (React.createElement("div", { key: group.label, className: "th-Option-Group" },
                React.createElement("div", { style: Object.assign({}, styles['groupLabel']), className: "th-Option-GroupLabel" }, group.label),
                group.options.map((option, i) => {
                    const globalIndex = flatOptions.findIndex(o => o.key === option.key);
                    const isSelected = selected.some(s => s.key === option.key);
                    const isHighlighted = highlightIndex === globalIndex;
                    const defaultProps = commonProps(option, isHighlighted, isSelected);
                    if (renderOption) {
                        return (React.createElement("label", Object.assign({}, defaultProps), renderOption({
                            option,
                            selected: isSelected,
                            highlighted: isHighlighted,
                            disabled: option.disabled,
                            onSelect: (e) => { var _a; return (_a = defaultProps.onClick) === null || _a === void 0 ? void 0 : _a.call(defaultProps, e); },
                        })));
                    }
                    return (React.createElement("label", Object.assign({}, defaultProps),
                        multiple && (React.createElement(Checkbox, { ariaLabelledBy: option.key, ariaDescribedBy: option.text, checked: isSelected, onChange: (ev, checked) => handleCheckboxChange(ev, checked, option), disabled: option.disabled })),
                        option.text));
                })))) : filteredOptions.map((option, i) => {
                const globalIndex = i;
                const isSelected = selected.some(s => s.key === option.key);
                const isHighlighted = highlightIndex === globalIndex;
                const defaultProps = commonProps(option, isHighlighted, isSelected);
                if (renderOption) {
                    return (React.createElement("label", Object.assign({}, defaultProps), renderOption({
                        option,
                        selected: isSelected,
                        highlighted: isHighlighted,
                        disabled: option.disabled,
                        onSelect: (e) => { var _a; return (_a = defaultProps.onClick) === null || _a === void 0 ? void 0 : _a.call(defaultProps, e); },
                    })));
                }
                return (React.createElement("label", Object.assign({}, defaultProps),
                    multiple && (React.createElement(Checkbox, { ariaLabelledBy: option.key, ariaDescribedBy: option.text, checked: isSelected, onChange: (ev, checked) => handleCheckboxChange(ev, checked, option), disabled: option.disabled })),
                    option.text));
            }))))));
}

export { ReactSelectify };
//# sourceMappingURL=index.js.map
