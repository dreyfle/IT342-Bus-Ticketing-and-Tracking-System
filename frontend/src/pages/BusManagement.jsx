import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import BusModal from "../components/modal/BusModal";


export default function BusManagement() {
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)
  const [buses, setBuses] = useState(null)

  const tableHeaders = ["Plate #","Bus Name","Operator","Seat Rows","Seat Columns","Action"]

  // on mount, fetch all the buses in the DB
  useEffect(()=>{
    fetchAllBuses()
  }, [])

  const fetchAllBuses = async () => {
    try {
      setIsPageLoading(true)
      const response = await api.get("/buses")
      setBuses(response?.data)

    } catch (err) {
      console.error("Error fetching buses: ", err)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedBus(null)
    setIsButtonLoading(true)
    document.getElementById("bus_modal").showModal()
  }
  const handleEdit = (bus) => {
    setSelectedBus(bus)
    setIsButtonLoading(true)
    document.getElementById("bus_modal").showModal()
  }
  const handleDelete = async (id) => {
    console.log("Delete for Bus with ID:" + id)
    try {
      setIsButtonLoading(true)
      const response = await api.delete(`/buses/${id}`)
      console.log("Delete Response: ", response)  
      alert(response?.data?.message)
      fetchAllBuses()
    } catch (err) {
      console.error(`Error deleting bus with ID: ${id} ; Error: `, err)
    } finally {
      setIsButtonLoading(false)
    }
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
            <button className="btn btn-primary w-fit" onClick={handleAdd} disabled={isButtonLoading}>
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
          <div className="overflow-x-auto">
            {/* Main Content */}
            {
              isPageLoading ? (
                <div className="flex items-center justify-center p-10">
                  <span className="loading loading-spinner text-primary loading-xl" />
                </div>
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
                                  onClick={()=>handleEdit(bus)} disabled={isButtonLoading}
                                >Edit</button>
                                <button className="btn btn-error btn-outline "
                                  onClick={()=>handleDelete(bus.id)} disabled={isButtonLoading}
                                >Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
                ) : (
                  <div className="flex flex-col items-center p-10">
                    <svg fill="#7aa4ff" height="80px" width="80px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 488 488" xmlSpace="preserve" stroke="#7aa4ff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(0 -540.36)"> <g> <g> <path d="M117,837.56c-12.2,0-23.7,5-32.4,14c-8.6,9-13.4,20.7-13.4,33.1c0,25.5,20.5,46.2,45.8,46.2s45.8-20.7,45.8-46.2 c0-12.4-4.8-24.2-13.4-33.1C140.7,842.56,129.2,837.56,117,837.56z M117,910.86c-14.2,0-25.8-11.7-25.8-26.2 c0-14.7,11.8-27.1,25.8-27.1s25.8,12.4,25.8,27.1C142.8,899.06,131.2,910.86,117,910.86z"></path> <path d="M371,837.56c-24.8,0-45,21.1-45,47.1c0,25.9,19.8,46.2,45,46.2s45.8-20.7,45.8-46.2c0-12.4-4.8-24.2-13.4-33.1 C394.7,842.56,383.2,837.56,371,837.56z M371,910.86c-14,0-25-11.5-25-26.2c0-15,11.2-27.1,25-27.1c14,0,25.8,12.4,25.8,27.1 C396.8,899.06,385.2,910.86,371,910.86z"></path> <path d="M294.5,869.56H193.6c-5.5,0-10,4.5-10,10s4.5,10,10,10h100.9c5.5,0,10-4.5,10-10S300,869.56,294.5,869.56z"></path> <path d="M131.5,763.26v-63.2c0-5.5-4.5-10-10-10h-61c-5.5,0-10,4.5-10,10v63.2c0,5.5,4.5,10,10,10h61 C127,773.26,131.5,768.86,131.5,763.26z M111.5,753.26h-41v-43.2h41V753.26z"></path> <path d="M243.8,763.26v-63.2c0-5.5-4.5-10-10-10h-61c-5.5,0-10,4.5-10,10v63.2c0,5.5,4.5,10,10,10h61 C239.3,773.26,243.8,768.86,243.8,763.26z M223.8,753.26h-41v-43.2h41V753.26z"></path> <path d="M345.3,773.26c5.6,0,10-4.4,10-10v-63.2c0-5.5-4.5-10-10-10h-61c-5.5,0-10,4.5-10,10v63.2c0,5.5,4.5,10,10,10H345.3z M294.3,710.06h41v43.2h-41V710.06z"></path> <path d="M478,637.86L478,637.86l-468,0c-5.5,0-10,4.5-10,10v231.7c0,5.5,4.5,10,10,10h40.7c5.5,0,10-4.5,10-10s-4.5-10-10-10H20 v-43.2h9.5c5.5,0,10-4.5,10-10s-4.5-10-10-10H20v-148.5h448v22.1h-71.4c-3.1,0-6,1.4-7.9,3.8c-1.9,2.4-2.6,5.6-1.9,8.5l20.3,84.3 c1.1,4.5,5.1,7.7,9.7,7.7h51v22.1h-10.3c-5.5,0-10,4.5-10,10s4.5,10,10,10H468v43.2h-30.7c-5.5,0-10,4.5-10,10s4.5,10,10,10H478 c5.5,0,10-4.5,10-10v-231.7C488,642.36,483.5,637.86,478,637.86z M468,764.26h-43.2l-15.5-64.3H468V764.26z"></path> </g> </g> </g> </g></svg>
                    <h1 className="text-lg text-blue-400">No buses available</h1>
                  </div>
                )
              )
            }
          </div>
        </div>
      </div>
      <BusModal bus={selectedBus} loading={isButtonLoading} setLoading={setIsButtonLoading} fetchAllBuses={fetchAllBuses}/>
    </div>
  )
}