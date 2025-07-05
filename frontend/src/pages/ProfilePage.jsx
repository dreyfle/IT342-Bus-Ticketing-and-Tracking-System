import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { useUser } from "../context/UserContext"
import api from "../axiosConfig";


export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false) 
  const {user, login, setUser} = useUser();
  const [newUserDetails, setNewUserDetails] = useState(null);
  const [disabled, setDisabled] = useState(true);

  // creating of temporary User details for comparison
  useEffect(()=>{
    setNewUserDetails(user)
  }, [user])

  // Compare user and newUserDetails
  useEffect(() => {
    if (!user || !newUserDetails) return;

    const isSame =
      user.firstName === newUserDetails.firstName &&
      user.lastName === newUserDetails.lastName;

    setDisabled(isSame); // Enable button only if values are different
  }, [newUserDetails, user]);

  // Handle the changes on the inputs
  const handleChange = (field, value) => {
    setNewUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle the update of profile
  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true)
      const response = await api.put(`/user/self/${user?.user_id}`, {
        "firstName": newUserDetails.firstName,
        "lastName": newUserDetails.lastName
      })
      login(response?.data?.data?.token)
      alert(response?.data?.message)
      setUser(newUserDetails)
    } catch (err) {
      console.error('Error with updating:', err);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavBar />
      {
        newUserDetails && (
          <div className="flex items-center justify-center">

            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend text-center text-2xl text-primary">Profile</legend>

              <label className="label">First Name</label>
              <input type="text" className="input input-primary" placeholder="My awesome page" value={newUserDetails.firstName} 
                onChange={(e)=>handleChange("firstName", e.target.value)}
              />

              <label className="label">Last Name</label>
              <input type="text" className="input input-primary" placeholder="my-awesome-page" value={newUserDetails.lastName}
                onChange={(e)=>handleChange("lastName", e.target.value)}
              />

              <label className="label">Email</label>
              <input type="text" className="input input-primary" placeholder="Name" value={newUserDetails.email} disabled/>

              <button className="btn btn-primary rounded-2xl mt-5" disabled={disabled}
                onClick={handleProfileUpdate}
              >Update</button>
            </fieldset>
          </div>
        )
      }
    </div>
  )
}