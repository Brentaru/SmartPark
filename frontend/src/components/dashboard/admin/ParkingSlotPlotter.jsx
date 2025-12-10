import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/admin/ParkingAreaDesigner.css';

const ParkingSlotPlotter = ({ onSlotsGenerated, areaCapacity = 20 }) => {
  const [grid, setGrid] = useState(Array(20).fill(null));
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellTypes, setCellTypes] = useState({}); // Track cell types: 'slot', 'road', 'empty'
  const [slotCount, setSlotCount] = useState(0);
  const [roadCount, setRoadCount] = useState(0);
  const [letters, setLetters] = useState(['A', 'B', 'C']);
  const [dragType, setDragType] = useState(null);

  // Initialize grid
  useEffect(() => {
    resetGrid();
  }, [areaCapacity]);

  const resetGrid = () => {
    const newGrid = Array(areaCapacity || 20).fill(null);
    setGrid(newGrid);
    setCellTypes({});
    setSlotCount(0);
    setRoadCount(0);
  };

  const getCellLabel = (index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const letter = letters[row] || 'A';
    return `${letter}-${String(col + 1).padStart(2, '0')}`;
  };

  const applyCellType = (index, type) => {
    const newCellTypes = { ...cellTypes };

    if (type) {
      newCellTypes[index] = type;
    } else {
      delete newCellTypes[index];
    }

    setCellTypes(newCellTypes);

    const newSlots = Object.values(newCellTypes).filter(t => t === 'slot').length;
    const newRoads = Object.values(newCellTypes).filter(t => t === 'road').length;
    setSlotCount(newSlots);
    setRoadCount(newRoads);
  };

  const handleCellClick = (index) => {
    // Toggle through slot -> road -> empty to give click-only flow without saving
    const current = cellTypes[index];
    if (!current) return applyCellType(index, 'slot');
    if (current === 'slot') return applyCellType(index, 'road');
    if (current === 'road') return applyCellType(index, null);
    return applyCellType(index, null);
  };

  const handleDragStart = (type) => {
    setDragType(type);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    if (!dragType) return;
    if (dragType === 'erase') return applyCellType(index, null);
    applyCellType(index, dragType);
  };

  const generateSlots = () => {
    if (slotCount === 0) {
      alert('Please add at least one parking slot to the grid');
      return;
    }

    const slots = [];
    Object.entries(cellTypes).forEach(([index, type]) => {
      if (type === 'slot') {
        const row = Math.floor(parseInt(index) / 4);
        const col = parseInt(index) % 4;
        const letter = letters[row] || String.fromCharCode(65 + row);
        const slotNumber = `${letter}-${String(col + 1).padStart(2, '0')}`;

        slots.push({
          location: slotNumber,
          slotType: 'Standard',
          status: 'Available',
          gridIndex: index
        });
      }
    });

    // Send slots to parent component but keep user on designer until they navigate back
    if (onSlotsGenerated) {
      onSlotsGenerated(slots);
    }
  };

  const handleLetterChange = (rowIndex, newLetter) => {
    const newLetters = [...letters];
    newLetters[rowIndex] = newLetter.toUpperCase();
    setLetters(newLetters);
  };

  return (
    <div className="parking-slot-plotter">
      <div className="plotter-header">
        <h3>Parking Layout Designer</h3>
        <p className="plotter-info">Click cells to place parking slots or roads. Auto-numbered based on position.</p>
      </div>

      <div className="plotter-controls">
        <div className="control-section">
          <label>Row Labels (Letters)</label>
          <div className="letter-inputs">
            {letters.map((letter, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={letter}
                onChange={(e) => handleLetterChange(idx, e.target.value)}
                placeholder="A"
                title={`Row ${idx + 1} letter`}
              />
            ))}
          </div>
        </div>

        <div className="control-section palette">
          <label>Drag Elements</label>
          <div className="palette-items">
            <button
              type="button"
              className="palette-btn palette-slot"
              draggable
              onDragStart={() => handleDragStart('slot')}
            >
              <span>Slot</span>
            </button>
            <button
              type="button"
              className="palette-btn palette-road"
              draggable
              onDragStart={() => handleDragStart('road')}
            >
              <span>Road</span>
            </button>
            <button
              type="button"
              className="palette-btn palette-erase"
              draggable
              onDragStart={() => handleDragStart('erase')}
            >
              <span>Erase</span>
            </button>
          </div>
        </div>

        <div className="control-section legend-section">
          <label>Legend</label>
          <div className="legend">
            <div className="legend-item">
              <div className="cell cell-slot"></div>
              <span>Slot ({slotCount})</span>
            </div>
            <div className="legend-item">
              <div className="cell cell-road"></div>
              <span>Road ({roadCount})</span>
            </div>
            <div className="legend-item">
              <div className="cell cell-empty"></div>
              <span>Empty</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-section">
        <div className="plotter-grid">
          {grid.map((_, index) => {
            const cellType = cellTypes[index];
            const row = Math.floor(index / 4);
            const col = index % 4;
            const rowLabel = letters[row] || String.fromCharCode(65 + row);

            return (
              <div key={index} className="grid-cell-wrapper">
                {col === 0 && (
                  <div className="row-label">{rowLabel}</div>
                )}
                <button
                  className={`grid-cell ${cellType ? `cell-${cellType}` : 'cell-empty'}`}
                  onClick={() => handleCellClick(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                  title={`Click or drag to set - ${rowLabel}-${String(col + 1).padStart(2, '0')}`}
                >
                  {cellType === 'slot' && (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="11" width="14" height="10" rx="2"/>
                        <circle cx="12" cy="16" r="2"/>
                        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      <span className="slot-label">{String(col + 1).padStart(2, '0')}</span>
                    </>
                  )}
                  {cellType === 'road' && <span className="road-mark">🛣️</span>}
                </button>
              </div>
            );
          })}
        </div>
        <div className="col-labels">
          <span>Col: 01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
        </div>
      </div>

      <div className="plotter-actions">
        <button className="btn-secondary" onClick={resetGrid}>
          Clear Grid
        </button>
        <button className="btn-primary" onClick={generateSlots}>
          Save Layout ({slotCount})
        </button>
      </div>

      <div className="plotter-preview">
        <h4>Preview - Auto-Generated Slot Numbers:</h4>
        <div className="slot-preview">
          {Object.entries(cellTypes)
            .filter(([_, type]) => type === 'slot')
            .map(([index, _]) => {
              const row = Math.floor(parseInt(index) / 4);
              const col = parseInt(index) % 4;
              const letter = letters[row] || String.fromCharCode(65 + row);
              return (
                <span key={index} className="preview-slot">
                  {letter}-{String(col + 1).padStart(2, '0')}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ParkingSlotPlotter;
