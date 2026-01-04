import { useEffect, useRef } from 'react';

/**
 * Hook to handle gamepad input polling.
 * Note: Nostalgist/RetroArch captures gamepad input automatically when the canvas is focused.
 * This hook is primarily for UI navigation or if we need custom mapping overlays.
 */
const useGamepad = (onButtonPress) => {
    const requestRef = useRef();

    const scanGamepads = () => {
        const gamepads = navigator.getGamepads();

        for (const gamepad of gamepads) {
            if (gamepad) {
                // Simple polling example - currently mostly passive as Nostalgist handles the core linkage
                // We can extend this to trigger UI events (like "Exit" or "Save") via the controller

                // Example: Check for "Start" button (usually index 9)
                if (gamepad.buttons[9]?.pressed) {
                    // Debounce logic would be needed here
                }
            }
        }

        requestRef.current = requestAnimationFrame(scanGamepads);
    };

    useEffect(() => {
        window.addEventListener("gamepadconnected", (e) => {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
        });

        requestRef.current = requestAnimationFrame(scanGamepads);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
};

export default useGamepad;
