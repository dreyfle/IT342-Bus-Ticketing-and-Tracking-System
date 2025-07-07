import { useEffect, useState } from "react"
import api from "../../axiosConfig"

const COLOR = {
  SELECTED : ["blue-500", "blue-100"],
  UNAVAILABLE : ["gray-500","gray-100"],
  BOOKED : ["red-500","red-100"],
  RESERVED : ["yellow-500","yellow-100"],
  OPEN : ["green-500","green-100"],
}


export default function TicketModal({trip, users, loading, setLoading, fetchAllTrips}) {

  const TICKET_FORM_TEMPLATE = {
    "rowPosition": 0,
    "columnPosition": 0,
    "tripId": null,   // An existing Trip ID
    "fare": 0,
    "dropOff": "",
    "userId": "",    // An existing User ID (passenger)
    "paymentType": "CASH"
  }

  const [action, setAction] = useState(null) 
  const [ticketInput, setTicketInput] = useState(TICKET_FORM_TEMPLATE)
  const [selectedSeat, setSelectedSeat] = useState(null)

  // SEATS FROM TRIP
  const [bookedSeats, setBookedSeats] = useState([])
  const [reservedSeats, setReservedSeats] = useState([])
  const [unavailableSeats, setUnavailableSeats] = useState([])

  

  useEffect(()=>{
    // console.log("Bus submitted for Edit", bus)
    if (trip) {
      setAction("BOOK")
      fetchSeats()
    }
  }, [loading])

  const fetchSeats = async () => {
    try {
      const response = await api.get(`/seats/by-trip/${trip.id}`)
      const seats = response?.data?.data
      seats.forEach((seat)=>{
        const seatid = String(seat.rowPosition + String.fromCharCode(64 + seat.columnPosition))
        switch (seat.status) {
          case "BOOKED": setBookedSeats(prev => [...prev, seatid]); break;
          case "RESERVED": setReservedSeats(prev => [...prev, seatid]); break;
          case "UNAVAILABLE": setUnavailableSeats(prev => [...prev, seatid]); break;
        }
      })
    } catch (err) {

    }
  }

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;

    setTicketInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      rowPosition: selectedSeat?.row_num,
      columnPosition: selectedSeat?.col_num,
      tripId: trip?.id,
      fare: ticketInput?.fare,
      dropOff: ticketInput?.dropOff,
      userId: ticketInput?.userId,
      paymentType: "CASH"
    }
    try {
      if (action === "BOOK") {
        const response = await api.post("/tickets/cash", payload)
        alert(response?.data?.message)
      }
    } catch (err) {
      console.error("Error when booking: ", err)
    } finally {
      fetchAllTrips()
      handleClose()
    }

  }

  const handleClose = () => {
    document.getElementById("ticket_modal").close()
    clearForm()
  }

  const clearForm = () => {
    setLoading(false)
    setSelectedSeat(null)
    setBookedSeats([]);
    setReservedSeats([]);
    setUnavailableSeats([]);
    setTicketInput(TICKET_FORM_TEMPLATE)
    setAction(null)
  }

  function generateSeatLabels(rows, columns) {
    return rows.flatMap(row =>
      columns.map(col => `${row}${col}`)
    );
  }

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box max-w-7/8 max-h-7/8 overflow-hidden">
        {/* MODAL TITLE */}
        <h3 className="font-bold text-lg text-center text-blue-900">Buy Ticket</h3>
        {/* MODAL CONTAINER */}
        <div className="modal-action">
          {/* FORM */}
          <form className="w-full" onSubmit={(e) => {
            e.preventDefault(); // prevent default form behavior
            handleSubmit();
          }}>
            <div className="flex gap-2 w-full">
              {/* BUS LAYOUT */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-blue-900 text-center font-semibold mb-2">Select Customer's Seat</p>
                <div className="flex flex-col flex-1 items-center justify-center">
                {
                  trip?.busDetails?.rowLabelsAsList.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2 mb-1">
                      {trip?.busDetails?.columnLabelsAsList.map((col, index) => {
                        const seatId = `${row}${col}`
                        let color = COLOR.OPEN
                        if (bookedSeats.includes(seatId)) {
                          color = COLOR.BOOKED
                        } else if (reservedSeats.includes(seatId)) {
                          color = COLOR.RESERVED
                        } else if (unavailableSeats.includes(seatId)) {
                          color = COLOR.UNAVAILABLE
                        }
                        if (seatId === selectedSeat?.seatID)
                          color = COLOR.SELECTED
                        return (
                          <div key={seatId} className={`btn w-8 h-8 rounded-sm border-1 font-bold text-sm disabled:text-black
                            bg-${color[1]} border-${color[0]} ` } 
                            disabled={bookedSeats.includes(seatId) || reservedSeats.includes(seatId) || unavailableSeats.includes(seatId)}
                            onClick={()=>{
                              if (action !== "VIEW") {
                                setSelectedSeat({row_num:Number(row), col_letter:col, col_num: index+1, seatID:seatId})
                              }
                            }}
                          >
                            {seatId}
                          </div>
                        )
                      })}
                    </div>
                  )
                )}
                </div>
                <p className="text-sm text-blue-900 text-center font-semibold my-2">Seat Legend</p>
                <div className="grid grid-cols-3">
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-sm border-1 font-bold text-sm text-black bg-${COLOR.OPEN[1]} border-${COLOR.OPEN[0]}`} />
                    <p className="text-sm">Open</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-sm border-1 font-bold text-sm text-black bg-${COLOR.BOOKED[1]} border-${COLOR.BOOKED[0]}`} />
                    <p className="text-sm">Booked</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-sm border-1 font-bold text-sm text-black bg-${COLOR.SELECTED[1]} border-${COLOR.SELECTED[0]}`} />
                    <p className="text-sm">Selected</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-sm border-1 font-bold text-sm text-black bg-${COLOR.UNAVAILABLE[1]} border-${COLOR.UNAVAILABLE[0]}`} />
                    <p className="text-sm">Unavailable</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-4 rounded-sm border-1 font-bold text-sm text-black bg-${COLOR.RESERVED[1]} border-${COLOR.RESERVED[0]}`} />
                    <p className="text-sm">Reserved</p>
                  </div>

                </div>
              </div>
              {/* RIGHT SIDE CONTAINER */}
              <div className="flex flex-1 gap-2 flex-col items-center justify-center p-2 rounded-box text-sm overflow-auto">

                <div className=" w-full items-center justify-center bg-blue-50 p-2 rounded-box text-sm max-h-60 overflow-auto">
                  <fieldset className="fieldset p-2">
                    <legend className="fieldset-legend text-sm text-blue-900 text-center">Bus Information</legend>
                    {/* BUS NAME */}
                    <label className="label">Bus Name</label>
                    <input type="text" name="name" disabled className="input input-primary input-sm disabled:text-black" placeholder="Where the trip starts" value={trip?.busDetails?.name || ""}/>
                    {/* SEAT COUNT */}
                    <label className="label">Seat Count</label>
                    <input type="text" name="name" disabled className="input input-primary input-sm disabled:text-black" placeholder="Where the trip starts" value={trip?.busDetails?.rowCount * trip?.busDetails?.columnCount || ""}/>
                  </fieldset>
                  <fieldset className="fieldset p-2">
                    <legend className="fieldset-legend text-sm text-blue-900 text-center">Route Information</legend>
                    {/* ORIGIN */}
                    <label className="label text-xs">Origin</label>
                    <input type="text" name="origin" disabled className="input input-primary input-sm disabled:text-black" placeholder="Where the trip starts" value={trip?.routeDetails?.origin || ""}/>
                    {/* STOPS */}
                    <label className="label text-xs">Stops</label>
                    <input type="text" name="stops" disabled className="input input-primary input-sm disabled:text-black" placeholder="Stopovers before destination" value={trip?.routeDetails?.stops || ""}/>
                    {/* DESTINATION */}
                    <label className="label text-xs">Destination</label>
                    <input type="text" name="destination" disabled className="input input-primary input-sm disabled:text-black" placeholder="Where the trip ends" value={trip?.routeDetails?.destination || ""}/>
                    {/* BASE FARE */}
                    <label className="label text-xs">Base Fare</label>
                    <div className="relative inline-block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-100">₱</span>
                      <input type="number" step="0.01" min="0" name="basePrice" disabled className="input input-primary input-sm disabled:text-black pl-6" placeholder="Amount in Pesos" value={trip?.routeDetails?.basePrice || ""}/>
                    </div>
                  </fieldset>
                  <fieldset className="fieldset p-2">
                    <legend className="fieldset-legend text-sm text-blue-900 text-center">Trip Information</legend>
                    {/* DEPARTURE TIME */}
                    <label className="label text-xs">Departure</label>
                    <input type="datetime-local" name="departureTime" disabled className="input input-primary input-sm disabled:text-black" placeholder="ex. ABC-123" value={trip?.departureTime || ""}/>
                    {/* STATUS */}
                    <label className="label text-xs">Stops</label>
                    <input type="text" name="status" disabled className="input input-primary input-sm disabled:text-black" value={trip?.status || ""}/>
                    
                  </fieldset>
                </div>
                <div className="flex-1 w-full items-center justify-center bg-blue-50 p-2 rounded-box text-sm">
                  <fieldset className="fieldset p-2">
                    <legend className="fieldset-legend text-sm text-blue-900 text-center">Ticket Information</legend>
                    {/* TICKET for USER */}
                    <label className="label">Purchase ticket for</label>
                    <select name="userId" value={ticketInput?.userId} required className="select select-sm" onChange={handleTicketInputChange}>
                      <option value="" disabled>Select a user</option>
                      {
                        users?.map((user)=>(
                          <option key={user.id} value={user.id}>{user.firstName} {user.lastName} - {user.email}</option>
                        ))
                      }
                    </select>
                    {/* DROP OFF */}
                    <label className="label">Drop Off</label>
                    <input type="text" name="dropOff" required className="input input-primary input-sm " placeholder="Where you want to drop off" onChange={handleTicketInputChange} value={ticketInput?.dropOff} />
                    {/* ACTUAL FARE */}
                    <label className="label">Actual Fare</label>
                    <div className="relative inline-block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-100">₱</span>
                      <input type="number" required step="0.01" min={trip?.routeDetails?.basePrice} onInput={(value)=>{value = parseFloat(value).toFixed(2)}}
                      name="fare" className="input input-primary input-sm pl-6" placeholder="Amount in Pesos" onChange={handleTicketInputChange}/>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            {/* MODAL BUTTONS */}
            <div className="flex justify-center gap-2 mt-3">
              <button type="submit" className="btn btn-primary rounded-lg" disabled={!selectedSeat}>Book</button>
              <button type="button" className="btn btn-outline btn-primary rounded-lg" onClick={handleClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>

  )
}

