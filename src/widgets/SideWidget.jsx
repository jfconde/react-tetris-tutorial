import React from 'react';
import PropTypes from 'prop-types';

const SideWidget = ({ className = '', label = '', children = null }) => (
    <div className={`side-widget ${className}`}>
        {label && <label className="side-widget__label">{label}</label>}
        {children}
    </div>
);

SideWidget.propTypes = {
    className: PropTypes.string
};

export default SideWidget;
