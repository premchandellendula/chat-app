import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/landing/Landing"
import Signup from "./pages/auth/Signup"
import Signin from "./pages/auth/Signin"
import ThemeProvider from "./pages/other/ThemeProvider"

function App() {

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>    
  )
}

export default App
