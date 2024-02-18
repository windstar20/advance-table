import { useState, useCallback, useEffect, useRef } from "react";
import "./table.css";

const createHeaders = (headers) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef()
  }));
};

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/resizable-tables-with-react-and-css-grid
 */
const Table = ({ headers, minCellWidth, tableContent }) => {
  const [tableHeight, setTableHeight] = useState("auto");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCellIndex, setActiveCellIndex] = useState(null);
  const tableElement = useRef(null);
  const columns = createHeaders(headers);

  useEffect(() => {
      setTableHeight(tableElement.current.offsetHeight);
  }, []);

  const mouseDownColumn = (index) => {
      setActiveIndex(index);
  };

  const mouseDownCell = (columnIndex, cellIndex) => {
      setActiveCellIndex({ columnIndex, cellIndex });
  };

  const mouseMove = useCallback(
      (e) => {
          if (activeIndex !== null) {
              const gridColumns = columns.map((col, i) => {
                  if (i === activeIndex) {
                      const width = e.clientX - col.ref.current.offsetLeft;
                      if (width >= minCellWidth) {
                          return `${width}px`;
                      }
                  }
                  return `${col.ref.current.offsetWidth}px`;
              });
              tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
                  " "
              )}`;
          }

          if (activeCellIndex !== null) {
              const { columnIndex, cellIndex } = activeCellIndex;
              const cell = tableElement.current.rows[cellIndex + 1].cells[columnIndex];
              const width = e.clientX - cell.getBoundingClientRect().left;
              if (width >= minCellWidth) {
                  cell.style.width = `${width}px`;
              }
          }
      },
      [activeIndex, columns, activeCellIndex, minCellWidth]
  );

  const removeListeners = useCallback(() => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
      setActiveIndex(null);
      setActiveCellIndex(null);
      removeListeners();
  }, [setActiveIndex, setActiveCellIndex, removeListeners]);

  useEffect(() => {
      if (activeIndex !== null || activeCellIndex !== null) {
          window.addEventListener("mousemove", mouseMove);
          window.addEventListener("mouseup", mouseUp);
      }

      return () => {
          removeListeners();
      };
  }, [activeIndex, activeCellIndex, mouseMove, mouseUp, removeListeners]);

  const resetTableCells = () => {
      tableElement.current.style.gridTemplateColumns = "";
      Array.from(tableElement.current.rows).forEach((row) => {
          Array.from(row.cells).forEach((cell) => {
              cell.style.width = "";
          });
      });
  };

  return (
      <div className="container">
          <div className="table-wrapper">
              <table className="resizeable-table" ref={tableElement}>
                  <thead>
                      <tr>
                          {columns.map(({ ref, text }, i) => (
                              <th ref={ref} key={text}>
                                  <span>{text}</span>
                                  <div
                                      style={{ height: tableHeight }}
                                      onMouseDown={() => mouseDownColumn(i)}
                                      className={`resize-handle ${
                                          activeIndex === i ? "active" : "idle"
                                      }`}
                                  />
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {tableContent.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                  <td
                                      key={cellIndex}
                                      onMouseDown={() => mouseDownCell(cellIndex, rowIndex)}
                                  >
                                      {cell}
                                  </td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <button onClick={resetTableCells}>Reset</button>
      </div>
  );
};

export default Table;
