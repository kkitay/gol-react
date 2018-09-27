import React, { Component } from 'react';
import './App.css';

const NUM_ROWS = 50;
const NUM_COLS = 50;

function Board(props) {
  return props.cells.map((row, rowIndex) => {
    let td = row.map((col, colIndex) => {
      return (<td key={colIndex} alive={col}></td>);
    });

    return (
      <tr key={rowIndex}>{td}</tr>
    );
  });
}

function newBoard() {
  let board = [];
  for(let i = 0; i < NUM_ROWS; i++) {
    let rows = [];
    for(let i = 0; i < NUM_COLS; i++) {
      rows.push(Math.round(Math.random()));
    }
    board.push(rows);
  }
  return board;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: newBoard(50, 50),
    };
  }

 componentDidMount() {
    setInterval(
      () => this.generation(),
      100
    );
  }

  countLiveNeighbors(neighbors) {
    return neighbors.reduce((total, value) => total += value, 0);
  }

  getNeighbors(rowIndex, cellIndex, board) {
    let maxRow = NUM_ROWS - 1;
    let maxCols = NUM_COLS - 1;
    let neighbors = [];
    // top row
    if(rowIndex > 0 && cellIndex > 0) neighbors.push(board[rowIndex-1][cellIndex-1]);
    if(rowIndex > 0) neighbors.push(board[rowIndex-1][cellIndex]);
    if(rowIndex > 0 && cellIndex < maxCols) neighbors.push(board[rowIndex-1][cellIndex+1]);

    // middle row
    if(cellIndex > 0) neighbors.push(board[rowIndex][cellIndex-1]);
    if(cellIndex < maxCols) neighbors.push(board[rowIndex][cellIndex+1]);

    // bottom row
    if(rowIndex < maxRow && cellIndex > 0) neighbors.push(board[rowIndex+1][cellIndex-1]);
    if(rowIndex < maxRow) neighbors.push(board[rowIndex+1][cellIndex]);
    if(rowIndex < maxRow && cellIndex < maxCols) neighbors.push(board[rowIndex+1][cellIndex+1]);

    return neighbors;
  }

  generation = () => {
    let newBoard = [];
    let board = this.state.cells.slice();
    board.forEach((row, rowIndex) => {
      let newRow = [];
      row.forEach((cell, cellIndex) => {
        let neighbors = this.getNeighbors(rowIndex, cellIndex, board);
        let countLive = this.countLiveNeighbors(neighbors);
        let newCell = null;
        if(cell === 1 && (countLive === 2 || countLive === 3)) {
          newCell = 1;
        } else if (cell === 0 && countLive === 3) {
          newCell = 1;
        } else {
          newCell = 0;
        }
        newRow.push(newCell);
      });
      newBoard.push(newRow);
    });
    this.setState({
      cells: newBoard,
    });
  }

  render() {
    return (
        <table>
          <tbody>
            <Board cells={this.state.cells}  />
          </tbody>
        </table>
    );
  }
}

export default App;
