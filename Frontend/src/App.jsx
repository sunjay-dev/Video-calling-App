import {Routes, Route} from 'react-router-dom'
import {Home, Room} from './pages'
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
    </>
  )
}

export default App
