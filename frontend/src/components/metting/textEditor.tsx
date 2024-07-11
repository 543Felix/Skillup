import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const TextEditor = () => {
  const [value, setValue] = useState('');

//   const handleSave = () => {
//     onSave(value);
//   };

  return (
    <div className="text-editor bg-white w-[900px] h-[600px]">
      <ReactQuill value={value} onChange={setValue} className='h-full w-full' />
      <button  className="mt-2 px-4 py-2 bg-blue-500 text-white">
        Save
      </button>
    </div>
  );
};

export default TextEditor;
