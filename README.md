# React Selectify

A modern, fully-typed customizable dropdown/select component for React — supports single or multiple selection, grouped options, keyboard navigation, and custom rendering.

---

## Installation

The easiest way to use `react-selectify` is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), etc).

You can also use the standalone build by including `dist/ react-selectify.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-selectify --save
# or
yarn add react-selectify
```

## Demo & Examples

You can quickly test the library in a React project:

## 💡 Basic Usage

```
import React, { useState } from "react";
import ReactSelectify, { Option } from "react-selectify";
import "@fluentui/react/dist/css/fabric.css";
import "./ReactSelectify.css";

export default function App() {
  const [selected, setSelected] = useState<string[]>([]);

  const options: Option[] = [
    { key: "apple", text: "Apple" },
    { key: "banana", text: "Banana" },
    { key: "orange", text: "Orange", disabled: true },
    { key: "grape", text: "Grape" },
  ];

  return (
    <div style={{ width: 300, margin: "40px auto" }}>
      <ReactSelectify
        options={options}
        placeholder="Select a fruit..."
        selectedKeys={selected}
        onChange={(e, option) => {
          if (!option) return;
          setSelected((prev) =>
            prev.includes(option.key)
              ? prev.filter((k) => k !== option.key)
              : [...prev, option.key]
          );
        }}
        multiple
        showTooltip
      />
    </div>
  );
}
```

## 💡 Grouped Example

```
import React, { useState } from "react";
import ReactSelectify, { OptionGroup } from "react-selectify";

export default function GroupExample() {
  const [selected, setSelected] = useState<string[]>([]);

  const groups: OptionGroup[] = [
    {
      label: "Fruits",
      options: [
        { key: "apple", text: "Apple" },
        { key: "banana", text: "Banana" },
      ],
    },
    {
      label: "Vegetables",
      options: [
        { key: "carrot", text: "Carrot" },
        { key: "broccoli", text: "Broccoli" },
      ],
    },
  ];

  return (
    <ReactSelectify
      groups={groups}
      selectedKeys={selected}
      placeholder="Select items..."
      multiple
      onChange={(e, option) => {
        if (!option) return;
        setSelected((prev) =>
          prev.includes(option.key)
            ? prev.filter((k) => k !== option.key)
            : [...prev, option.key]
        );
      }}
    />
  );
}
```

## 💡 Custom Rendering Example

```
<ReactSelectify
  options={[
    { key: "js", text: "JavaScript" },
    { key: "py", text: "Python" },
    { key: "go", text: "Go" },
  ]}
  multiple
  renderOption={({ option, selected, onSelect }) => (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
        background: selected ? "#e5f1ff" : "transparent",
      }}
    >
      <img
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${option.key}/${option.key}-original.svg`}
        width={20}
        height={20}
        alt={option.text}
      />
      <span>{option.text}</span>
    </div>
  )}
  onChange={(e, option) => console.log(option)}
/>
```