import React, { useState, useEffect, useCallback } from 'react';
import Row from './Row';
import Block from './Block';
import {
    getNewTetromino,
    getVirtualBoard,
    processMovement,
    validateMovement,
    mergeBoardAndTetromino,
    codes,
    blankBoard
} from './util';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const Board = () => {
    const [board, setBoard] = useState(blankBoard(BOARD_WIDTH, BOARD_HEIGHT));
    const [virtualBoard, setVirtualBoard] = useState(board);
    const [currentTetromino, setCurrentTetromino] = useState(
        getNewTetromino(BOARD_WIDTH)
    );
    const [movementTimeout, setMovementTimeout] = useState(null);
    let currentBoardElement = null;

    const attemptMovement = useCallback(({ tetromino, board, ...opts }) => {
        let next = processMovement({ tetromino, board, ...opts });

        switch (
            validateMovement({
                tetromino: next,
                down: opts.down,
                board,
                boardWidth: BOARD_WIDTH,
                boardHeight: BOARD_HEIGHT
            })
        ) {
            case codes.RET_VALID:
                setCurrentTetromino(next);
                break;
            case codes.RET_MERGE:
                setBoard(mergeBoardAndTetromino(board, tetromino, BOARD_WIDTH));
                setCurrentTetromino(getNewTetromino(BOARD_WIDTH));
                break;
            default:
            case codes.RET_NO_ACTION:
                return;
        }

        if (opts.down || opts.fall) {
            if (movementTimeout) clearTimeout(movementTimeout);
            setMovementTimeout(setTimeout(() => setMovementTimeout(null), 500));
        }
    }, [movementTimeout]);

    const onKeyDownHandler = event => {
        let movement = null;
        switch (event.key) {
            case 's':
            case 'ArrowDown':
                movement = { down: true };
                break;
            case 'a':
            case 'ArrowLeft':
                movement = { left: true };
                break;
            case 'd':
            case 'ArrowRight':
                movement = { right: true };
                break;
            case 'j':
                movement = { rotate: 3 };
                break;
            case 'k':
                movement = { rotate: 1 };
                break;
            case ' ':
                movement = { fall: true };
                break;
            default:
                return;
        }
        attemptMovement({ ...movement, board, tetromino: currentTetromino });
    };

    useEffect(() => {
        currentBoardElement && currentBoardElement.focus();
    }, [currentBoardElement]);
    useEffect(() => setVirtualBoard(getVirtualBoard(board, currentTetromino)), [
        board,
        currentTetromino
    ]);
    useEffect(() => {
        if (!movementTimeout) {
            attemptMovement({
                tetromino: currentTetromino,
                board,
                down: true
            });
        }
    }, [attemptMovement, board, currentTetromino, movementTimeout]);

    return (
        <div
            className="tetris-board"
            tabIndex="0"
            ref={el => (currentBoardElement = el)}
            onKeyDown={onKeyDownHandler}
        >
            {virtualBoard.map((row, i) => (
                <Row key={i}>
                    {row.map((block, j) => (
                        <Block key={[i, j]} type={block} />
                    ))}
                </Row>
            ))}
        </div>
    );
};

export default Board;
