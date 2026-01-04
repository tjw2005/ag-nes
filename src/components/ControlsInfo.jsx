import React from 'react';

const ControlsInfo = () => {
    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '15px',
            fontSize: '0.85em',
            maxWidth: '250px',
            zIndex: 90
        }}>
            <h3 style={{ marginBottom: '10px' }}>Controls</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <strong>Action</strong>
                <strong>Key</strong>

                <span>D-Pad</span>
                <span>Arrows</span>

                <span>A Button</span>
                <span>X</span>

                <span>B Button</span>
                <span>Z</span>

                <span>Start</span>
                <span>Enter</span>

                <span>Select</span>
                <span>Shift</span>
            </div>

            <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#a0a0a0' }}>
                <em>Gamepad supported automatically</em>
            </div>
        </div>
    );
};

export default ControlsInfo;
