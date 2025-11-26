import React, { useState } from 'react';
import ReactSelectify, { Option, OptionGroup } from '../components/ReactSelectify';
import './index.css';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedKeys2, setSelectedKeys2] = useState<string[]>(['option1', 'option3']);
  const [selectedKeys3, setSelectedKeys3] = useState<string[]>([]);

  // Simple options
  const simpleOptions: Option[] = [
    { key: 'option1', text: 'Option 1' },
    { key: 'option2', text: 'Option 2' },
    { key: 'option3', text: 'Option 3' },
    { key: 'option4', text: 'Option 4' },
    { key: 'option5', text: 'Option 5' },
  ];

  // Options with groups
  const groupedOptions: OptionGroup[] = [
    {
      label: 'Fruits',
      options: [
        { key: 'apple', text: 'Apple' },
        { key: 'banana', text: 'Banana' },
        { key: 'orange', text: 'Orange' },
        { key: 'grape', text: 'Grape' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { key: 'carrot', text: 'Carrot' },
        { key: 'broccoli', text: 'Broccoli' },
        { key: 'spinach', text: 'Spinach' },
        { key: 'tomato', text: 'Tomato' },
      ],
    },
    {
      label: 'Dairy',
      options: [
        { key: 'milk', text: 'Milk' },
        { key: 'cheese', text: 'Cheese' },
        { key: 'yogurt', text: 'Yogurt' },
      ],
    },
  ];

  // Many options for testing
  const manyOptions: Option[] = Array.from({ length: 50 }, (_, i) => ({
    key: `item-${i + 1}`,
    text: `Item ${i + 1}`,
    disabled: i % 10 === 0, // Disable every 10th item
  }));

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>React Selectify Demo</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Single Select (Simple Options)</h2>
        <ReactSelectify
          options={simpleOptions}
          placeholder="Select an option..."
          selectedKeys={selectedKeys}
          onChange={(event, option) => {
            if (option) {
              setSelectedKeys([option.key]);
              console.log('Selected:', option);
            }
          }}
        />
        <p>Selected: {selectedKeys.join(', ')}</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Multi Select (Simple Options)</h2>
        <ReactSelectify
          options={simpleOptions}
          multiple
          placeholder="Select multiple options..."
          selectedKeys={selectedKeys2}
          onChange={(event, option) => {
            if (option) {
              const newKeys = selectedKeys2.includes(option.key)
                ? selectedKeys2.filter(k => k !== option.key)
                : [...selectedKeys2, option.key];
              setSelectedKeys2(newKeys);
              console.log('Selected:', newKeys);
            }
          }}
        />
        <p>Selected: {selectedKeys2.join(', ')}</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Multi Select with Groups</h2>
        <ReactSelectify
          groups={groupedOptions}
          multiple
          placeholder="Select items from groups..."
          selectedKeys={selectedKeys3}
          onChange={(event, option) => {
            if (option) {
              const newKeys = selectedKeys3.includes(option.key)
                ? selectedKeys3.filter(k => k !== option.key)
                : [...selectedKeys3, option.key];
              setSelectedKeys3(newKeys);
              console.log('Selected:', newKeys);
            }
          }}
        />
        <p>Selected: {selectedKeys3.join(', ')}</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Many Options (50 items)</h2>
        <ReactSelectify
          options={manyOptions}
          multiple
          placeholder="Select from many options..."
          showTooltip
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Disabled State</h2>
        <ReactSelectify
          options={simpleOptions}
          placeholder="This is disabled..."
          disabled
        />
      </div>
    </div>
  );
}

export default App;

