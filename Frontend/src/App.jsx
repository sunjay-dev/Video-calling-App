import {Routes, Route} from 'react-router-dom'
import {Home, Room, JoinRedirect} from './pages'
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="/r/:roomId" element={<JoinRedirect/>} />
    </Routes>
    </>
  )
}

export default App
