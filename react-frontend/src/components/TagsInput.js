import React, { useState } from 'react';
import './TagsInput.css'
function TagInput({label}) {
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && input) {
            if (!tags.includes(input)) {  // evitar tags duplicadas
                setTags([...tags, input]);
                setInput('');
            }
        } else if (event.key === 'Backspace' && !input) {
            removeTag(tags.length - 1);
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((tag, i) => i !== index));
    };

    return (
        <div>
            <label className="block mb-1 text-primary">
                {label}
            </label>
            <div className="tags-input-container border">
                {tags.map((tag, index) => (
                    <div key={index} className="tag-item bg text-primary border">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}>x</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={input}
                    className="input-tag focus:outline-none focus:box-shadow-blue-500 bg shadow text-primary appearance-none w-full py-1 px-1 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Adicione uma tag e pressione Enter"
                />
            </div>
        </div>
    );
}

export default TagInput;
