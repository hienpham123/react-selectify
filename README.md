# React Selectify

A powerful, customizable React select/combobox component built with FluentUI, supporting single and multiple selection, grouping, filtering, and keyboard navigation.

## Features

- ✅ Single and multiple selection modes
- ✅ Option grouping support
- ✅ Real-time filtering/search
- ✅ Keyboard navigation (Arrow keys, Enter, Space, Escape)
- ✅ Dynamic dropdown positioning (auto top/bottom)
- ✅ Customizable styling
- ✅ TypeScript support
- ✅ Accessible (ARIA labels)
- ✅ Performance optimized with React.memo

## Installation

```bash
npm install react-selectify
```

## Basic Usage

### Single Select

```tsx
import React, { useState } from 'react';
import { ReactSelectify, Option } from 'react-selectify';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const options: Option[] = [
    { key: 'option1', text: 'Option 1' },
    { key: 'option2', text: 'Option 2' },
    { key: 'option3', text: 'Option 3' },
  ];

  return (
    <ReactSelectify
      options={options}
      placeholder="Select an option..."
      selectedKeys={selectedKeys}
      onChange={(event, option) => {
        if (option) {
          setSelectedKeys([option.key]);
        }
      }}
    />
  );
}
```

### Multiple Select

```tsx
import React, { useState } from 'react';
import { ReactSelectify, Option } from 'react-selectify';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const options: Option[] = [
    { key: 'apple', text: 'Apple' },
    { key: 'banana', text: 'Banana' },
    { key: 'orange', text: 'Orange' },
  ];

  return (
    <ReactSelectify
      options={options}
      multiple
      placeholder="Select multiple options..."
      selectedKeys={selectedKeys}
      onChange={(event, option) => {
        if (option) {
          const newKeys = selectedKeys.includes(option.key)
            ? selectedKeys.filter(k => k !== option.key)
            : [...selectedKeys, option.key];
          setSelectedKeys(newKeys);
        }
      }}
    />
  );
}
```

### With Groups

```tsx
import React, { useState } from 'react';
import { ReactSelectify, OptionGroup } from 'react-selectify';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const groups: OptionGroup[] = [
    {
      label: 'Fruits',
      options: [
        { key: 'apple', text: 'Apple' },
        { key: 'banana', text: 'Banana' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { key: 'carrot', text: 'Carrot' },
        { key: 'broccoli', text: 'Broccoli' },
      ],
    },
  ];

  return (
    <ReactSelectify
      groups={groups}
      multiple
      placeholder="Select items..."
      selectedKeys={selectedKeys}
      onChange={(event, option) => {
        if (option) {
          const newKeys = selectedKeys.includes(option.key)
            ? selectedKeys.filter(k => k !== option.key)
            : [...selectedKeys, option.key];
          setSelectedKeys(newKeys);
        }
      }}
    />
  );
}
```

## Props

### ReactSelectifyProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Option[]` | `[]` | List of options when not using groups |
| `groups` | `OptionGroup[]` | `[]` | List of option groups for grouping options |
| `selectedKeys` | `string[]` | `undefined` | List of selected option keys (controlled) |
| `onChange` | `(event?, option?) => void` | - | Callback triggered when selection changes |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `placeholder` | `string` | - | Placeholder text displayed in the input |
| `positionOffset` | `'top' \| 'bottom'` | `'bottom'` | Position of the dropdown (auto-calculated if not enough space) |
| `styles` | `{ [key: string]: React.CSSProperties }` | `{}` | Inline styles for customizing appearance |
| `showTooltip` | `boolean` | `false` | Whether to show full option text as tooltip on hover |
| `className` | `string` | `''` | Additional CSS class for the root element |
| `multiple` | `boolean` | `false` | Whether multiple selections are allowed |
| `renderOption` | `(props: any) => React.ReactNode` | - | Custom render function for each option |

### Option

```typescript
interface Option {
  key: string;           // Unique identifier
  text: string;          // Display text
  disabled?: boolean;    // Whether the option is disabled
  data?: any;            // Additional data
  selected?: boolean;    // Whether the option is selected (internal use)
}
```

### OptionGroup

```typescript
interface OptionGroup {
  label: string;         // Group label
  options: Option[];     // Options in this group
}
```

## Advanced Usage

### Custom Styling

```tsx
<ReactSelectify
  options={options}
  styles={{
    root: { width: '300px' },
    input: { fontSize: '16px' },
    callOut: { maxWidth: '400px' },
    groupLabel: { color: '#0078d4' },
  }}
/>
```

### Custom Option Rendering

```tsx
<ReactSelectify
  options={options}
  renderOption={({ option, selected, highlighted }) => (
    <div style={{ 
      padding: '8px',
      backgroundColor: highlighted ? '#e1f5ff' : 'transparent',
      fontWeight: selected ? 'bold' : 'normal'
    }}>
      {option.text}
    </div>
  )}
/>
```

### Without Controlled State

You can use the component without providing `selectedKeys` prop. The component will manage its own internal state:

```tsx
<ReactSelectify
  options={options}
  multiple
  onChange={(event, option) => {
    console.log('Selected:', option);
  }}
/>
```

## Keyboard Navigation

- **Arrow Up/Down**: Navigate through options
- **Enter**: Select highlighted option
- **Space**: Select highlighted option (or type to search)
- **Escape**: Close dropdown
- **Type to filter**: Start typing to filter options

## Styling

The component uses CSS classes that you can override:

- `.hh-Multi-Select` - Root container
- `.hh-Input-Wrapper` - Input wrapper
- `.hh-Input-Display` - Input field
- `.hh-Dropdown` - Dropdown container
- `.hh-Options-List` - Options list container
- `.hh-Option-Item` - Individual option item
- `.hh-Option-Item.highlighted` - Highlighted option
- `.hh-Option-Item.disabled` - Disabled option
- `.hh-Option-Group` - Option group container
- `.hh-Option-GroupLabel` - Group label
- `.hh-No-Result` - No results message

## Requirements

- React 16.8+ (with hooks support)
- @fluentui/react ^8.0.0
- @fluentui/font-icons-mdl2 ^8.0.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/hienpham123/react-selectify
