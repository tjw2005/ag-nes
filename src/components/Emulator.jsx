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

    // Handle audio context suspension issues (common in browsers)
    const resumeAudio = () => {
      const audioContext = window.AudioContext || window.webkitAudioContext;
      if (audioContext) {
        // Did Nostalgist/Emscripten create one? We can often find it if we look for the running one
        // or we can try to find the one attached to the emulation module if exposed.
        // However, a generic approach is to try resuming the context if we can find a reference,
        // OR rely on user interaction. 

        // Since we can't easily access the internal context from the outside without a reference,
        // we will rely on a trick: trigger a resume on the next interaction.
        // But for fullscreen specific loss, we can try to re-focus the canvas.
      }
    };

    // Better approach: Listen for fullscreen change and force focus/resume
    const handleFullscreenChange = async () => {
      if (document.fullscreenElement && canvasRef.current) {
        canvasRef.current.focus();
        // Attempt to resume audio context if accessible via standard Emscripten globals
        if (window.Module && window.Module.SDL2 && window.Module.SDL2.audioContext) {
          if (window.Module.SDL2.audioContext.state === 'suspended') {
            await window.Module.SDL2.audioContext.resume();
          }
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      active = false;
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
