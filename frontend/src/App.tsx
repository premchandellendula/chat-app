import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/landing/Landing"
import Signup from "./pages/auth/Signup"
import Signin from "./pages/auth/Signin"
import ThemeProvider from "./pages/other/ThemeProvider"
import Chats from "./pages/chat/Chats"
import UserProvider from "./pages/other/UserProvider"

function App() {

  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/chats" element={<Chats />} />
            </Routes>
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </div>    
  )
}

export default App
