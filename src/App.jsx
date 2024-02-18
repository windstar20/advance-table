import React, { useCallback, useMemo, useRef, useState } from 'react'
// import { Resizable } from 're-resizable';
import './App.css'
import Hello from './Hello';

function App() {

    const [text, setText] = useState('');
    const inputRef = useRef();

    const handleInputChange = (e) => {
        setText((text) => e.target.value);
    }

    const [text2, setText2] = useState('');
    console.log('부모 렌더링...')


    return (
        <div>
            <input type={'text'} onChange={handleInputChange} value={text} />
            <input type={'text'} onChange={(e) => setText2(e.target.value)} value={text2} />
            <Hello text={text} />
        </div>
    );
}

export default App
