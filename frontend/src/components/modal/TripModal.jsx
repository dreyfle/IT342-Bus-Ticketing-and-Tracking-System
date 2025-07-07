import { useEffect, useState } from "react"
import api from "../../axiosConfig"


const TRIP_FORM_TEMPLATE = {
  "departureTime": "",
  "busId": 0, // Make sure a Bus with this ID exists!
  "routeDetails": {
    "origin": "",
    "destination": "",
    "stops": [],
    "basePrice": 0
  }
}

const ROUTE_FORM_TEMPLATE = {
  "id": 0,
  "origin": "",
  "destination": "",
  "stops": [],
  "basePrice": 0
}

export default function TripModal({trip, loading, setLoading, fetchAllTrips}) {
  const [action, setAction] = useState(null)
  const [tripInput, setTripInput] = useState(null)
  const [routeInput, setRouteInput] = useState(null)
  const [buses, setBuses] = useState(null)
  const [selectedBusId, setSelectedBusId] = useState("Select a Bus")

  // useEffect(()=>{
  // }, [loading])

  useEffect(()=>{
    fetchAllBuses()

    // console.log("Bus submitted for Edit", bus)
    if (trip) {
      setAction("EDIT")
      setTripInput(trip)
      setRouteInput(trip?.routeDetails)
      setSelectedBusId(String(trip?.busDetails?.id || ""))
    } else {
      setAction("ADD")
      setTripInput(TRIP_FORM_TEMPLATE)
      setRouteInput(ROUTE_FORM_TEMPLATE)
      setSelectedBusId("Select a Bus")
    }
  }, [loading])

  const selectedBus = buses?.find((bus) => String(bus.id) === selectedBusId)

  const fetchAllBuses = async () => {
    try {
      const response = await api.get("/buses")
      setBuses(response?.data)
    } catch (err) {
      console.error("Error fetching buses: ", err)
    } finally {
    }
  }

  const handleTripInputChange = (e) => {
    const { name, value } = e.target;

    setTripInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleRouteInputChange = (e) => {
  const { name, value } = e.target;

  setRouteInput((prev) => ({
    ...prev,
    [name]: name === "stops"
      ? value.split(",").map(stop => stop.trim()).filter(Boolean) // turn comma-separated string into clean array
      : name === "basePrice"
        ? parseFloat(value) || 0
        : value
  }));
};

  const handleSubmit = async () => {
    // console.log("Form is submitted.", busInput)
    const { origin, destination, stops, basePrice } = routeInput
    const route_payload = { origin, destination, stops, basePrice }

    const { departureTime, busDetails } = tripInput
    const trip_payload = { departureTime, "busId": Number(busDetails?.id || selectedBusId), "routeDetails":route_payload }
    try {
      if (action === "ADD") {
        console.log("Submit is Add");
        console.log(trip_payload)
        const response = await api.post("/trips", trip_payload)
        alert(response?.data?.message)
      } else if (action === "EDIT") {
        console.log("Submit is Edit");
        const route_response = await api.put(`/routes/${routeInput?.id}`, route_payload)
        const trip_response = await api.put(`/trips/${tripInput?.id}`, trip_payload)
        alert(route_response?.data?.message + "\n" + trip_response?.data?.message)
      } else {
        console.error("Submit error")
      }
    } catch (err) {
      console.error("Error when submitting the form: ", err)
    } finally {
      fetchAllTrips()
      fetchAllBuses()
      handleClose()
    }
    
  }

  const handleClose = () => {
    document.getElementById("trip_modal").close()
    clearForm()
  }

  const clearForm = () => {
    setLoading(false)
    setTripInput(TRIP_FORM_TEMPLATE)
    setRouteInput(ROUTE_FORM_TEMPLATE)
    setSelectedBusId("Select a Bus")
    setAction(null)
  }


  return (
    <dialog id="trip_modal" className="modal">
      <div className="modal-box max-w-7/8 max-h-3/4">
        {/* MODAL TITLE */}
        <h3 className="font-bold text-lg text-center text-blue-900">{action === "EDIT" ? "Edit Selected " : "Schedule New "} Trip</h3>
        {/* MODAL CONTAINER */}
        <div className="modal-action">
          {/* FORM */}
          <form method="dialog" className="w-full" onSubmit={(e) => {
            e.preventDefault(); // prevent default form behavior
            handleSubmit();
          }}>
            <div className="flex gap-2 w-full">
              {/* LEFT CONTAINER for BUS INFORMATION DISPLAY */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-center text-blue-900 font-semibold">Bus Information</p>
                <fieldset className="fieldset p-4 w-full">
                  {/* BUS NAME */}
                  <label className="label">Bus Name</label>
                  <select value={selectedBusId} required className="select select-sm" onChange={(e)=>setSelectedBusId(e.target.value)}>
                    {
                      buses && (buses.length > 0 ? (
                        <>
                          <option disabled value="Select a Bus">Select a Bus</option>
                          { buses.map((bus)=>(
                              <option key={bus.id} value={bus.id}>{bus.name}</option>
                          ))}
                        </>
                      ) : (
                        <option disabled>No Buses Available</option>
                      )
                    )}
                  </select>
                  {/* SEAT COUNT */}
                  <label className="label">Seat Count</label>
                  <input type="text" name="seatCount" disabled className="input input-primary input-sm" value={(selectedBus?.rowCount * selectedBus?.columnCount) || ""}/>
                </fieldset>
              </div> 
              {/* MIDDLE CONTAINER for ROUTE INFORMATION */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-center text-blue-900 font-semibold">Route Information</p>
                <fieldset className="fieldset p-4 w-full">
                  {/* ORIGIN */}
                  <label className="label">Origin</label>
                  <input type="text" name="origin" required className="input input-primary input-sm" placeholder="Where the trip starts" onChange={handleRouteInputChange} value={routeInput?.origin || ""}/>
                  {/* STOPS */}
                  <label className="label">Stops</label>
                  <input type="text" name="stops" required className="input input-primary input-sm" placeholder="Stopovers before destination" onChange={handleRouteInputChange} value={routeInput?.stops || ""}/>
                  {/* DESTINATION */}
                  <label className="label">Destination</label>
                  <input type="text" name="destination" required className="input input-primary input-sm" placeholder="Where the trip ends" onChange={handleRouteInputChange} value={routeInput?.destination || ""}/>
                  {/* BASE PRICE */}
                  <label className="label">Base Price</label>
                  <input type="number" step="0.01" min="0" onInput={(value)=>{value = parseFloat(value).toFixed(2)}}
                    name="basePrice" required className="input input-primary input-sm" placeholder="Amount in Pesos" onChange={handleRouteInputChange} value={routeInput?.basePrice || ""}/>
                </fieldset>
              </div>
              {/* RIGHT CONTAINER for TRIP INFORMATION */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-center font-semibold text-blue-900">Trip Information</p>
                <fieldset className="fieldset p-4 w-full">
                  {/* DEPARTURE DATE/TIME */}
                  <label className="label">Departure</label>
                  <input type="datetime-local" name="departureTime" required className="input input-primary input-sm" placeholder="ex. ABC-123" onChange={handleTripInputChange} value={tripInput?.departureTime || ""}/>
                  {/* STATUS */}
                  {
                    action && action === "EDIT" && (
                      <>
                        <label className="label">Status</label>
                        <select name="status" required className="select select-sm" onChange={handleTripInputChange} value={tripInput?.status}>
                          <option disabled value="Select Trip Status">Select Trip Status</option>
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="BOARDING">Boarding</option>
                          <option value="DEPARTED">Departed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </>
                    )
                  }
                </fieldset>
              </div>

            </div>
            {/* MODAL BUTTONS */}
            <div className="flex justify-center gap-2 mt-3">
              <button type="submit" className="btn btn-primary rounded-lg">Submit</button>
              <button type="button" className="btn btn-outline btn-primary rounded-lg" onClick={handleClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}