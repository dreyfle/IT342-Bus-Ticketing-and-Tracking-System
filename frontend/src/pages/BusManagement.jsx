import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";


export default function BusManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [buses, setBuses] = useState(null)
  const navigate = useNavigate()

  const tableHeaders = ["Plate #","Bus Name","Operator","Seat Rows","Seat Columns","Action"]

  // on mount, fetch all the buses in the DB
  useEffect(()=>{
    setIsLoading(true)
    fetchAllBuses()
    setTimeout(() => {
      console.log('This runs after 3 seconds');
      setIsLoading(false)
    }, 3000); // 3000 ms = 3 seconds
  }, [])

  const fetchAllBuses = async () => {
    try {
      // setIsLoading(true)
      const response = await api.get("/buses")
      console.log("Response data: ", response)
      setBuses(response?.data)

    } catch (err) {
      console.error("Error fetching buses: ", err)
    } finally {
      // setIsLoading(false)
    }
    
  }

  const handleEdit = (id) => {
    console.log("Edit for Bus with ID:" + id)
  }
  const handleDelete = (id) => {
    console.log("Delete for Bus with ID:" + id)

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavBar />
      <div className="max-w-7xl mx-auto w-fit px-4">

        <div className="bg-white rounded-2xl shadow-lg border border-blue-200">
          <div className="flex flex-col items-center px-6 py-6 border-b border-blue-200">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
              Bus Management
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"/>
            </h2>
            <button className="btn btn-primary w-fit" onClick={()=>navigate()} disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
              Add a Bus</button>
          </div>
          {/* Main Content */}
          {
            isLoading ? (
              <span className="loading loading-spinner loading-xl" />
            ) : (
              buses && buses.length > 0 ? (
                // DISPLAYING ALL BUSES
                <table className="table-auto">
                  <thead>
                    <tr className="border-b border-blue-200 bg-blue-50">
                      {
                        tableHeaders.map((header, index)=>(
                          <th key={index} className="p-4 text-left text-sm font-semibold text-blue-900 border-r border-blue-200">
                            {header}
                          </th>
                        ))
                      }
                      
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // DISPLAYING ALL BUSES
                      buses.map((bus) => (
                        <tr key={bus.id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{bus.plateNumber}</td>
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{bus.name}</td>
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{bus.operator}</td>
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{bus.rowCount}</td>
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{bus.columnCount}</td>
                          <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100 w-auto">
                            <div className="flex gap-2">
                              <button className="btn btn-primary btn-outline"
                                onClick={()=>handleEdit(bus.id)} disabled={isLoading}
                              >Edit</button>
                              <button className="btn btn-error btn-outline "
                                onClick={()=>handleDelete(bus.id)} disabled={isLoading}
                              >Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
              </table>
              ) : (
                <h1>No buses available</h1>
              )
            )
          }
          
          <div className="overflow-x-auto">
            
          </div>
        </div>
      </div>
    </div>
  )
}