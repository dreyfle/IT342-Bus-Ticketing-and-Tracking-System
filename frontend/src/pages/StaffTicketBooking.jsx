import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { useNavigate } from "react-router-dom"
import { formatDateTime } from "../utils/dateUtils"
import TicketModal from "../components/modal/TicketModal"
import api from "../axiosConfig"

const getTodayAsYYYYMMDD = () => {
  return new Date().toISOString().split("T")[0];
};

const PAYLOAD_FOR_BOOKING = {
  "rowPosition": 1,
  "columnPosition": 2,
  "tripId": 3,
  "fare": 470.00,
  "dropOff": "Cebu North Bus Terminal",
  "userId": 2,
  "paymentType": "ONLINE",
  "onlineReceipt": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Required for ONLINE
}

export default function StaffTicketBooking() {
  const [users, setUsers] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(getTodayAsYYYYMMDD())
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [trips, setTrips] = useState(null)
  const [ticketIDs, setTicketIDs] = useState([])
  const navigate = useNavigate();

  const tableHeaders = ["Trip ID","Origin","Destination","Departure","Base Fare","Seats Available","Status","Action"]

  // on mount, fetch all users
  useEffect(()=>{
    fetchAllUsers()
  }, [])

  // on select date, fetch all the trips in the DB
  useEffect(()=>{
    fetchAllTrips()
  }, [selectedDate])
  
  const fetchAllUsers = async () => {
    try {
      setIsPageLoading(true)
      const response = await api.get("/user")
      setUsers(response?.data?.data)
    } catch (err) {
      console.error("Error fetching users: ", err)
    } 
  }

  const fetchAllTrips = async () => {
    try {
      setIsPageLoading(true)
      const response = await api.get(`/trips/by-date?date=${selectedDate}`)
      setTrips(response?.data?.data)
      // fetchMyTickets()

    } catch (err) {
      console.error("Error fetching trips: ", err)
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleBook = (trip) => {
    setSelectedTrip(trip)
    setIsButtonLoading(true)
    document.getElementById("ticket_modal").showModal()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200">
          <div className="flex flex-col items-center px-6 py-6 border-b border-blue-200">
            <button className="btn btn-ghost btn-sm btn-primary mr-auto text-primary hover:text-white transition rounded-lg"
              onClick={()=>navigate(-1)}
            >⬅ BACK</button>
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
              Walk-in Booking
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"/>
            </h2>
            <div className="flex items-center gap-3">
              <input type="date" className="input input-primary" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}/>
              
            </div>
          </div>
          <div className="overflow-x-auto">
            {/* Main Content */}
            {
              isPageLoading ? (
                <div className="flex items-center justify-center p-10">
                  <span className="loading loading-spinner text-primary loading-xl" />
                </div>
              ) : (
                trips && trips.length > 0 ? (
                  // DISPLAYING ALL TRIPS
                  <table className="table-auto w-full">
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
                        // DISPLAYING ALL TRIPS
                        trips.map((trip) => (
                          <tr key={trip?.id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip?.id}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip?.routeDetails?.origin}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip?.routeDetails?.destination}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{formatDateTime(trip?.departureTime)}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">₱ {trip?.routeDetails?.basePrice}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip?.availableSeats} / {trip?.busDetails?.rowCount * trip?.busDetails?.columnCount}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">{trip?.status}</td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100 w-auto">
                              <div className="flex gap-2">
                                {
                                  ticketIDs.includes(trip?.id) && (
                                    <button className="btn btn-success btn-outline w-fit rounded-lg" disabled={isButtonLoading}
                                      onClick={()=>handleBook(trip)}>
                                      View Ticket
                                    </button>
                                  )
                                }
                                {
                                  (trip?.status === "SCHEDULED" || trip?.status === "BOARDING") && (
                                    <button className="btn btn-primary w-fit rounded-lg" disabled={isButtonLoading}
                                      onClick={()=>handleBook(trip)} >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-white "
                                      >
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                                      </svg>
                                      Book
                                    </button>
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
                ) : (
                  <div className="flex flex-col items-center p-10">
                    <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z" stroke="#155dfc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10 4L10 20" stroke="#155dfc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5"></path> </g></svg>
                    <h1 className="text-lg text-blue-400">No trips available</h1>
                  </div>
                )
              )
            }
          </div>
        </div>
      </div>
      <TicketModal trip={selectedTrip} users={users} loading={isButtonLoading} setLoading={setIsButtonLoading} fetchAllTrips={fetchAllTrips}/>
    </div>
  )
}