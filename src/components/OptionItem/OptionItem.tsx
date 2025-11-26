import React, { FormEvent, useCallback, useMemo } from 'react';
import { Checkbox } from '@fluentui/react';
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

const OptionItem: React.FC<OptionItemProps> = ({
    option,
    isSelected,
    isHighlighted,
    multiple,
    showTooltip,
    renderOption,
    onSelect,
    optionRef
}) => {
    const handleClick = useCallback((event: React.FormEvent<HTMLElement | HTMLInputElement>) => {
        if (option.disabled) return;
        
        const target = event.target as HTMLElement;
        
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

    const handleCheckboxChange = useCallback((
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        checked?: boolean
    ) => {
        if (option.disabled) return;
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            onSelect(ev, option, checked);
        } else {
            // Create a synthetic event if none provided
            const syntheticEvent = {
                stopPropagation: () => {},
                preventDefault: () => {},
            } as React.FormEvent<HTMLElement | HTMLInputElement>;
            onSelect(syntheticEvent, option, checked);
        }
    }, [option, onSelect]);

    const handleWrapperClick = useCallback((e: React.MouseEvent) => {
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
        return (
            <label {...commonProps}>
                {renderOption({
                    option,
                    selected: isSelected,
                    highlighted: isHighlighted,
                    disabled: option.disabled,
                    onSelect: (e: React.FormEvent<HTMLElement | HTMLInputElement> | FormEvent<HTMLElement | HTMLInputElement>) => {
                        const event = e as React.FormEvent<HTMLElement | HTMLInputElement>;
                        handleClick(event);
                    },
                })}
            </label>
        );
    }

    return (
        <label {...commonProps}>
            {multiple && (
                <span 
                    className="checkbox-wrapper"
                    onClick={handleWrapperClick}
                >
                    <Checkbox
                        ariaLabelledBy={option.key}
                        ariaDescribedBy={option.text}
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        disabled={option.disabled}
                    />
                </span>
            )}
            <span className="option-text">{option.text}</span>
        </label>
    );
};

// Memoize component to prevent unnecessary re-renders
// Note: We don't compare onSelect and optionRef as they are functions and will always be different
export const MemoizedOptionItem = React.memo(OptionItem, (prevProps, nextProps) => {
    // Only compare primitive values and option object properties
    return (
        prevProps.option.key === nextProps.option.key &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.multiple === nextProps.multiple &&
        prevProps.showTooltip === nextProps.showTooltip &&
        prevProps.option.disabled === nextProps.option.disabled &&
        prevProps.option.text === nextProps.option.text &&
        prevProps.renderOption === nextProps.renderOption
    );
});

export { OptionItem };

