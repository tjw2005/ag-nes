import { useState, useRef } from 'react'
import Emulator from './components/Emulator'
import RomLoader from './components/RomLoader'
import ControlsInfo from './components/ControlsInfo'
import useGamepad from './hooks/useGamepad'

function App() {
  const [romFile, setRomFile] = useState(null)
  const emulatorRef = useRef(null)

  // Initialize gamepad polling
  useGamepad()

  const handleRomSelected = (file) => {
    console.log("ROM selected:", file.name)
    setRomFile(file)
  }

  const handleSaveState = async () => {
    if (emulatorRef.current) {
      const state = await emulatorRef.current.saveState()
      if (state) {
        // In a real app we might convert blob to base64 and store in localStorage
        // For now, Nostalgist handles internal state management or we can download it
        console.log("State saved (Blob size):", state.size)

        // Simple "fake" storage for session duration
        const url = URL.createObjectURL(state)
        const a = document.createElement('a')
        a.href = url
        a.download = `${romFile.name}.state`
        a.click()
      }
    }
  }

  const handleFullscreen = () => {
    if (emulatorRef.current) {
      emulatorRef.current.toggleFullscreen()
    }
  }

  const handleReset = () => {
    // Simply reloading the ROM triggers a reset in our Emulator component effect
    if (romFile) {
      setRomFile(new File([romFile], romFile.name, { type: romFile.type }))
    }
  }

  return (
    <>
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3>AG-NES</h3>
          {romFile && <span style={{ opacity: 0.5 }}>Playing: {romFile.name}</span>}
        </div>

        {romFile && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="secondary" onClick={handleReset}>Reset</button>
            <button className="secondary" onClick={handleSaveState}>Save State</button>
            <button className="primary" onClick={handleFullscreen}>Fullscreen</button>
          </div>
        )}
      </div>

      <div className="screen-container">
        {!romFile ? (
          <div className="animate-fade-in">
            <RomLoader onRomSelected={handleRomSelected} />
          </div>
        ) : (
          <Emulator
            ref={emulatorRef}
            romFile={romFile}
          />
        )}
      </div>

      <ControlsInfo />
    </>
  )
}

export default App
