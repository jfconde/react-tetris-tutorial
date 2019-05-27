import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SideWidget from './SideWidget';
import SlideCharacter from './SlideCharacter';

const getLineDigits = (count = 0, numDigits = 4) => {
    let numberArray = count.toString().split('');
    if (count < 10 ** (numDigits - 1)) {
        let i = numDigits - 2,
            n = 1;

        while (count < 10 ** i && i > 0) {
            n++;
            i--;
        }

        numberArray = [...new Array(n).fill(0), ...count.toString().split('')];
    }

    return numberArray.map(n =>
        n !== 0 ? (
            <SlideCharacter className="number" letter={n} />
        ) : (
            <SlideCharacter className="number leading-zero" letter={0} />
        )
    );
};

const LineCounter = ({ lines = 0 }) => {
    const [n, setN] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setN(n + 33), 700);
        return () => clearTimeout(t);
    }, [n]);

    return (
        <SideWidget className="line-counter" label="Lines">
            <div className="line-counter__lines">{getLineDigits(n || 0)}</div>
        </SideWidget>
    );
};

export default LineCounter;
