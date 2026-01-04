import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Nostalgist } from 'nostalgist';

const Emulator = forwardRef(({ romFile, onStart, onError }, ref) => {
  const canvasRef = useRef(null);
  const nostalgistRef = useRef(null);

  useImperativeHandle(ref, () => ({
    saveState: async () => {
      if (nostalgistRef.current) {
        try {
          const state = await nostalgistRef.current.saveState();
          return state;
        } catch (e) {
          console.error("Save state failed", e);
        }
      }
    },
    loadState: async (stateBlob) => {
      if (nostalgistRef.current && stateBlob) {
        try {
          await nostalgistRef.current.loadState(stateBlob);
        } catch (e) {
          console.error("Load state failed", e);
        }
      }
    },
    toggleFullscreen: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }));

  useEffect(() => {
    let active = true;

    const launchEmulator = async () => {
      if (!romFile || !canvasRef.current) return;

      try {
        if (nostalgistRef.current) {
          await nostalgistRef.current.exit();
        }

        const nostalgist = await Nostalgist.launch({
          element: canvasRef.current,
          rom: romFile,
          core: 'fceumm', // Standard reliable NES core
          resolveRom: false, // We provide the file object directly
          style: {
            // Nostalgist applies some defaults, we want it to fit our container
            width: '100%',
            height: '100%',
            position: 'absolute',
          }
        });

        if (active) {
          nostalgistRef.current = nostalgist;
          if (onStart) onStart();
          console.log("Emulator started");
        } else {
          nostalgist.exit();
        }

      } catch (err) {
        console.error("Failed to launch emulator", err);
        if (onError) onError(err);
      }
    };

    launchEmulator();

    return () => {
      active = false;
      if (nostalgistRef.current) {
        nostalgistRef.current.exit();
        nostalgistRef.current = null;
      }
    };
  }, [romFile]);

  return (
    <div className="emulator-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
});

export default Emulator;
