import React, { useCallback, useMemo, useRef, useState } from 'react'
// import { Resizable } from 're-resizable';
import './App.css'
import Hello from './Hello';

function App() {
  const [tableData, setTableData] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]);

const [selectedCells, setSelectedCells] = useState([]); // 선택된 셀의 좌표를 저장

const handleCellClick = (rowIndex, colIndex) => {
    const newSelectedCells = [...selectedCells];
    const cellIndex = selectedCells.findIndex(cell => cell.row === rowIndex && cell.col === colIndex);
    if (cellIndex === -1) {
        newSelectedCells.push({ row: rowIndex, col: colIndex });
    } else {
        newSelectedCells.splice(cellIndex, 1);
    }
    setSelectedCells(newSelectedCells);
};

const handleCellDrag = (startRowIndex, startColIndex, endRowIndex, endColIndex) => {
    const cells = [];
    // 드래그로 선택한 셀들을 cells 배열에 추가
    for (let i = Math.min(startRowIndex, endRowIndex); i <= Math.max(startRowIndex, endRowIndex); i++) {
        for (let j = Math.min(startColIndex, endColIndex); j <= Math.max(startColIndex, endColIndex); j++) {
            cells.push({ row: i, col: j });
        }
    }
    setSelectedCells(cells);
};

const handleMergeCells = () => {
    if (selectedCells.length < 2) return; // 두 개 이상의 셀이 선택되어야 병합 가능
    const newData = [...tableData];
    const minRow = Math.min(...selectedCells.map(cell => cell.row));
    const maxRow = Math.max(...selectedCells.map(cell => cell.row));
    const minCol = Math.min(...selectedCells.map(cell => cell.col));
    const maxCol = Math.max(...selectedCells.map(cell => cell.col));
    const mergedValue = tableData[minRow][minCol]; // 병합할 셀들의 값을 첫 번째 셀의 값으로 설정

    // 병합된 셀의 값을 설정하고, 나머지 셀의 값을 초기화
    for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
            if (i !== minRow || j !== minCol) { // 첫 번째 셀은 값이 이미 저장되어 있으므로 건너뜀
                newData[i][j] = '';
            }
        }
    }
    newData[minRow][minCol] = mergedValue;
    setTableData(newData);
    setSelectedCells([]);
};

const [text, setText] = useState('te');
const inputRef = useRef();

// const handleInputChange = useCallback((e) => {
//   setText((text) => e.target.value);
// }, [])

console.log('렌더링...')
return (
    <div>
          <input type={'text'} onChange={(e) => setText(e.target.value)} value={text}/>
          <Hello text={text} />
        <table>
            <thead>
                <tr>
                    {tableData[0].map((cell, colIndex) => (
                        <th key={colIndex}>{colIndex + 1}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td
                                key={colIndex}
                                onMouseDown={() => handleCellClick(rowIndex, colIndex)}
                                onMouseEnter={(e) => {
                                    if (e.buttons === 1) { // 마우스 왼쪽 버튼이 눌려 있을 때에만 드래그로 선택
                                        handleCellDrag(selectedCells[0]?.row, selectedCells[0]?.col, rowIndex, colIndex)
                                    }
                                }}
                                className={selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) ? 'selected' : ''}
                                style={{ border: selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex) ? '2px solid black' : '1px solid black' }}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        <button onClick={handleMergeCells}>Merge Cells</button>
    </div>
);
};



export default App
