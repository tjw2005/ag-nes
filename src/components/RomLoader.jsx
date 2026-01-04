import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const RomLoader = ({ onRomSelected }) => {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            onRomSelected(acceptedFiles[0]);
        }
    }, [onRomSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/x-nes-rom': ['.nes'],
            'application/octet-stream': ['.nes']
        },
        maxFiles: 1
    });

    return (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: 'auto' }}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the NES ROM here...</p>
                ) : (
                    <div>
                        <h3>Drag & Drop NES ROM</h3>
                        <p>or click to select a file</p>
                        <p style={{ fontSize: '0.8em', marginTop: '20px', opacity: 0.7 }}>
                            Supports .nes files. No ROMs are included.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RomLoader;
