import React from 'react';
import Row from './Row';
import Block from './Block';

const board = new Array(20).fill(new Array(10).fill(null));

// Example to see all pieces correctly rendered:
board[board.length-1] = ['j','l','i','o','t','s','s2', null, null, null];

const Board = () => {
    return (
        <div className="tetris-board">
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
        </div>
    );
};

export default Board;