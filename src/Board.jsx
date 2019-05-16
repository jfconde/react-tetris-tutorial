import React, { useState } from 'react';
import Row from './Row';
import Block from './Block';

const initialBoard = new Array(20).fill(new Array(10).fill(null));
const secondBoard = new Array(20).fill(new Array(10).fill('i'));

const Board = () => {
    const [board, setBoard] = useState(initialBoard);

    return (
        [<div className="tetris-board">
            {
                board.map(
                    (row, i) => (
                        <Row key={i}>
                            {
                                row.map(
                                    (block, j) => (
                                        <Block key={[i,j]} type={block} />
                                    ))
                            }
                        </Row>
                    ))
            }
        </div>,
        <input type="button" value="Change Board" onClick={() => setBoard(board === initialBoard ? secondBoard : initialBoard)} />]
    );
};

export default Board;