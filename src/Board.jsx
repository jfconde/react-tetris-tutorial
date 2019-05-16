import React, {useState, useEffect} from 'react';
import Row from './Row';
import Block from './Block';
import {getRandomTetromino} from "./util";

const BOARD_WIDTH = 10;

const initialBoard = new Array(20).fill(new Array(10).fill(null));
const getNewTetromino = () => ({
    x     : (BOARD_WIDTH / 2) - 2,
    y     : -1,
    matrix: getRandomTetromino()
});

const Board = () => {
    const [board, setBoard] = useState(initialBoard);
    const [virtualBoard, setVirtualBoard] = useState(board);
    const [currentTetromino, setCurrentTetromino] = useState(getNewTetromino());

    useEffect(() => setVirtualBoard(board.map((row, y) =>
        row.map((block, x) => block || (currentTetromino.matrix[y - currentTetromino.y] && currentTetromino.matrix[y - currentTetromino.y][x - currentTetromino.x]) || null)
    )), [board, currentTetromino]);

    return (
        <div className="tetris-board">
            {
                virtualBoard.map(
                    (row, i) => (
                        <Row key={i}>
                            {
                                row.map(
                                    (block, j) => (
                                        <Block key={[i, j]} type={block}/>
                                    ))
                            }
                        </Row>
                    ))
            }
        </div>
    );
};

export default Board;