import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RootRedirect } from "@/pages/RootRedirect"
import { Signin } from "@/pages/Signin"
import { Dashboard } from "@/pages/Dashboard"
import { Signup } from "@/pages/Signup"
import { PropertyDetail } from "@/pages/PropertyDetail"
import { useAppContext } from "@/context/AppContext"
import { Header } from "@/components/Header"
import { PrivateRoute } from "@/pages/PrivateRoute"
import { CreateProperty } from "@/pages/CreateProperty"
import { UpdateProperty } from "@/pages/UpdateProperty"
import { UserProfile } from "@/pages/UserProfile"

function App() {
  const { user } = useAppContext();

  return (
    <BrowserRouter>
      {user && <Header />}
      <Routes>
        {/* Dashboard page when authenticated */}
        {/* Login page when not authenticated */}
        <Route path="/" element={<RootRedirect />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Only when authenticated */}
        <Route element={<PrivateRoute />} >
          {/* All users */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Only residents */}
          <Route path="/dashboard/:propertyId" element={<PropertyDetail />} />

          {/* Only owners */}
          <Route path="/dashboard/create-property" element={<CreateProperty />} />
          <Route path="/dashboard/:propertyId/edit" element={<UpdateProperty />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
