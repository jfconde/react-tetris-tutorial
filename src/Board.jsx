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
    blankBoard,
    tetrominoMatrixOutOfBounds,
    tetrominoMatrixCollides,
    getSeedFn
} from './util';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const renderBoard = board =>
    board.map((row, i) => (
        <Row key={i}>
            {row.map((block, j) => (
                <Block key={[i, j]} type={block} />
            ))}
        </Row>
    ));

const renderGameOver = () => <div className="overlay">Game Over</div>;
const seed = getSeedFn ();
// TODO: REVIEW THIS SHIT
const initialPiece = getNewTetromino(BOARD_WIDTH, seed);
const Board = ({ onGameOver, gameOver }) => {
    const [board, setBoard] = useState(blankBoard(BOARD_WIDTH, BOARD_HEIGHT));
    const [virtualBoard, setVirtualBoard] = useState(board);
    const [enabled, setEnabled] = useState(true);
    const [currentTetromino, setCurrentTetromino] = useState(
        initialPiece
    );
    const [movementTimeout, setMovementTimeout] = useState(null);
    //TODO: really?
    let currentBoardElement = null;

    const attemptMovement = useCallback(
        ({ tetromino, board, ...opts }) => {
            if (!enabled) {
                return;
            }
            let next = processMovement({ tetromino, board, ...opts });
            let nextBoard = board;

            switch (
                validateMovement({
                    tetromino: next,
                    down: opts.down,
                    fall: opts.fall,
                    board,
                    boardWidth: BOARD_WIDTH,
                    boardHeight: BOARD_HEIGHT
                })
            ) {
                case codes.RET_VALID:
                    setCurrentTetromino(next);
                    break;
                case codes.RET_MERGE:
                    nextBoard = mergeBoardAndTetromino(
                        board,
                        opts.fall ? next : tetromino,
                        BOARD_WIDTH
                    );
                    setBoard(nextBoard);
                    next = getNewTetromino(BOARD_WIDTH, seed);
                    setCurrentTetromino(next);
                    break;
                default:
                case codes.RET_NO_ACTION:
                    return;
            }

            // Check for game over condition
            if (
                Object.values(
                    tetrominoMatrixOutOfBounds(next, BOARD_WIDTH, BOARD_HEIGHT)
                ).some(Boolean) ||
                tetrominoMatrixCollides(nextBoard, next)
            ) {
                onGameOver && onGameOver();
                setEnabled(false);
            }

            if (opts.down || opts.fall) {
                if (movementTimeout) clearTimeout(movementTimeout);
                setMovementTimeout(
                    setTimeout(() => setMovementTimeout(null), 1000)
                );
            }
        },
        [enabled, movementTimeout, onGameOver]
    );

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
            <div>{!gameOver && renderBoard(virtualBoard)}</div>
            {!gameOver && renderGameOver()}
        </div>
    );
};

export default Board;
