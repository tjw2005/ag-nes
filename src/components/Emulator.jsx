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



    // Generic resume function
    const resumeAudio = async () => {
      // Try Emscripten standard path
      if (window.Module?.SDL2?.audioContext?.state === 'suspended') {
        try { await window.Module.SDL2.audioContext.resume(); } catch (e) { }
      }
    };

    const handleFullscreenChange = async () => {
      setTimeout(async () => {
        if (document.fullscreenElement && canvasRef.current) {
          canvasRef.current.focus();
          await resumeAudio();
        } else {
          if (canvasRef.current) canvasRef.current.focus();
        }
      }, 100);
    };

    // Add global listeners to catch any user interaction in fullscreen
    const handleInteraction = () => resumeAudio();

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      active = false;
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (nostalgistRef.current) {
        nostalgistRef.current.exit();
        nostalgistRef.current = null;
      }
    };
  }, [romFile]);

  return (
    <div className="emulator-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        tabIndex="0"
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />
    </div>
  );
});

export default Emulator;
