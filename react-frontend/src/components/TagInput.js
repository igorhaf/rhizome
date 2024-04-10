import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function TagInput({ label, name, placeholder, suggestions }) {
    const [tags, setTags] = useState([]);

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = [...tags];
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };

    return (
        <div className="w-full mb-4">
            <label className="block mb-2 text-primary py-0.5" htmlFor={name}>
                {label}
            </label>
            <div className="border border-gray-300 w-full">
                <ReactTags
                    tags={tags}
                    suggestions={suggestions}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    inputFieldPosition="bottom"
                    autocomplete
                    placeholder={placeholder}
                    classNames={{
                        tags: 'tagsClass',
                        tagInput: 'tagInputClass w-full text-primary',
                        tagInputField: 'tagInputFieldClass w-full border-none p-2 bg',
                        selected: 'selectedClass flex flex-wrap gap-1 p-1',
                        tag: 'tagClass bg rounded px-2 py-1 flex justify-center items-center text-primary mr-1 mb-1 border',
                        remove: 'removeClass ml-2 cursor-pointer',
                        suggestions: 'suggestionsClass',
                        activeSuggestion: 'activeSuggestionClass'
                    }}
                />
            </div>
        </div>
    );
}

export default TagInput;
