import { useEffect, useState } from "react"
import api from "../../axiosConfig"


export default function TicketModal({trip, loading, setLoading, fetchAllTrips}) {
  const [action, setAction] = useState(null) 
  const [tripInput, setTripInput] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

  // SEATS FROM TRIP
  const [bookedSeats, setBookedSeats] = useState([])
  const [reservedSeats, setReservedSeats] = useState([])
  const [unavailableSeats, setUnavailableSeats] = useState([])


  useEffect(()=>{

    // console.log("Bus submitted for Edit", bus)
    if (trip) {
      setAction("VIEW")
      fetchSeats()
      // setTripInput(trip)
      // setRouteInput(trip?.routeDetails)
      // setSelectedBusId(String(trip?.busDetails?.id || ""))
    } else {
      setAction("BOOK")
      setTripInput(trip)
    }
  }, [loading])

  const fetchSeats = async () => {
    try {
      const response = await api.get(`seats/by-trip/${trip.id}`)
      const seats = response?.data?.data
      console.log(seats)
      seats.forEach((seat)=>{
        const seatid = String(seat.rowPosition + String.fromCharCode(64 + seat.columnPosition))
        console.log(seatid)
        switch (seat.status) {
          case "BOOKED": setBookedSeats(prev => [...prev, seatid]); break;
          case "RESERVED": setReservedSeats(prev => [...prev, seatid]); break;
          case "UNAVAILABLE": setUnavailableSeats(prev => [...prev, seatid]); break;
        }
      })
    } catch (err) {

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

    setAction(null)
  }

  function generateSeatLabels(rows, columns) {
    return rows.flatMap(row =>
      columns.map(col => `${row}${col}`)
    );
  }

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box max-w-7/8 max-h-7/8">
        {/* MODAL TITLE */}
        <h3 className="font-bold text-lg text-center text-blue-900">Ticket</h3>
        {/* MODAL CONTAINER */}
        <div className="modal-action">
          {/* FORM */}
          <form method="dialog" className="w-full" onSubmit={(e) => {
            e.preventDefault(); // prevent default form behavior
            handleSubmit();
          }}>
            <div className="flex gap-2 w-full">
              {/* BUS LAYOUT */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-blue-900 text-center font-semibold mb-2">Bus Layout</p>
                <div className="flex flex-col flex-1 items-center justify-center">
                {
                  trip?.busDetails?.rowLabelsAsList.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2 mb-1">
                      {trip?.busDetails?.columnLabelsAsList.map((col, index) => {
                        const seatId = `${row}${col}`
                        let color = "gray-500"
                        if (bookedSeats.includes(seatId)) {
                          color = "green-500"
                        } else if (reservedSeats.includes(seatId)) {
                          color = "yellow-500"
                        } else if (unavailableSeats.includes(seatId)) {
                          color = "red-500"
                        }
                        return (
                          <div key={seatId} className={`btn w-8 h-8 rounded-sm border-1 font-bold text-sm text-black
                            border-${color}`}
                            onClick={()=>{
                              if (action !== "VIEW") {
                                console.log({row:Number(row), col:col, col_num: index+1})
                                setSelectedSeat({row:Number(row), col:col, col_num: index+1})
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
                <p className="text-sm text-blue-900 text-center font-semibold mt-2">Legend</p>
                <div className="flex flex-1 gap-2 items-center justify-center">
                  <div className={`btn w-4 h-4 rounded-sm border-1 font-bold text-sm text-black border-gray-500`} />
                  <p className="text-sm">Open</p>
                  <div className={`btn w-4 h-4 rounded-sm border-1 font-bold text-sm text-black border-green-500`} />
                  <p className="text-sm">Booked</p>
                  <div className={`btn w-4 h-4 rounded-sm border-1 font-bold text-sm text-black border-yellow-500`} />
                  <p className="text-sm">Reserved</p>
                  <div className={`btn w-4 h-4 rounded-sm border-1 font-bold text-sm text-black border-red-500`} />
                  <p className="text-sm">Unavailable</p>

                </div>
              </div>
              {/*  */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
              </div>
            </div>

            {/* MODAL BUTTONS */}
            <div className="flex justify-center gap-2 mt-3">
              <button type="button" className="btn btn-outline btn-primary rounded-lg" onClick={handleClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>

  )
}

