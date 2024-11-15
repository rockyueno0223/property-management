import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RootRedirect } from "@/pages/RootRedirect"
import { Signin } from "@/pages/Signin"
import { Dashboard } from "@/pages/Dashboard"
import { Signup } from "@/pages/Signup"
import { PropertyDetail } from "@/pages/PropertyDetail"
import { useAppContext } from "@/context/AppContext"
import { Header } from "@/components/Header"

function App() {
  const { user } = useAppContext();

  return (
    <BrowserRouter>
      {user && <Header />}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:propertyId" element={<PropertyDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
