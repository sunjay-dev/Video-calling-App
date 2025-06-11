import {Routes, Route} from 'react-router-dom'
import {Home, Room, JoinRedirect, NotFound} from './pages'
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/r/:roomId" element={<JoinRedirect/>} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
