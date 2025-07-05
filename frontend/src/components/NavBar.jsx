import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"


export default function NavBar() {
  const {user,roleDisplay,logout} = useUser()
  const navigate = useNavigate()
  
  return (
    <header className="bg-white shadow-sm w-full mb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            {/* BTTS LOGO */}
            <div className="flex items-center h-full mr-2 text-xl font-bold text-primary cursor-pointer"
              onClick={()=>{navigate("/home")}}
              >BTTS</div>
            {/* ROLE INDICATOR */}
            <div className="flex items-center gap-2">
              <h1>|</h1><h1>{roleDisplay}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost border-transparent rounded-2xl" >
                <div className="flex items-center gap-2 font-light">
                  { user && (<h1>{user.firstName +" "+ user.lastName}</h1>) }
                </div>
                👤</div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><a onClick={()=>{navigate("/profile")}}>Profile</a></li>
                <li><a onClick={logout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}