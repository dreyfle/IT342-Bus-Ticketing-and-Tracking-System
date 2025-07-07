import { useEffect, useState } from "react"
import api from "../../axiosConfig";


export default function BusModal({bus, loading, setLoading, fetchAllBuses}) {
  const [action, setAction] = useState(null)
  const [busInput, setBusInput] = useState(null)
  const [rowLabel, setRowLabel] = useState([]);
  const [colLabel, setColLabel] = useState([]);

  useEffect(()=>{
    // console.log("Bus submitted for Edit", bus)
    if (bus) {
      setAction("EDIT")
      setBusInput(bus)
    } else {
      setAction("ADD")
      setBusInput({
        "plateNumber": "",
        "name": "",
        "operator": "",
        "rowCount": 1,
        "columnCount": 1
      })
    }
  }, [loading])

  // Update rowLabel and colLabel when rowCount or columnCount changes
  useEffect(() => {
    if (busInput) {
      const rows = Array.from({ length: busInput?.rowCount }, (_, i) => String(i + 1));
      const cols = Array.from({ length: busInput?.columnCount }, (_, i) =>
        String.fromCharCode(65 + i) // 65 = "A"
      );
      
      setRowLabel(rows);
      setColLabel(cols);
    }
  }, [busInput?.rowCount, busInput?.columnCount, busInput]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBusInput((prev) => ({
      ...prev,
      [name]: name === 'rowCount' || name === 'columnCount' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    console.log("Form is submitted.", busInput)
    const { plateNumber, name, operator, rowCount, columnCount } = busInput
    const payload = {
      plateNumber,
      name,
      operator,
      rowCount,
      columnCount,
    }
    try {
      if (action === "ADD") {
        console.log("Submit is Add");
        const response = await api.post("/buses", payload)
        alert(response?.data?.message)
      } else if (action === "EDIT") {
        console.log("Submit is Edit");
        const response = await api.put(`/buses/${busInput?.id}`, payload)
        alert(response?.data?.message)
      } else {
        console.error("Submit error")
      }
    } catch (err) {
      console.error("Error when submitting the form: ", err)
    } finally {
      fetchAllBuses()
      handleClose()
    }
    
  }

  const handleClose = () => {
    document.getElementById("bus_modal").close()
    clearForm()
  }

  const clearForm = () => {
    setLoading(false)
    setBusInput({
      "plateNumber": "",
      "name": "",
      "operator": "",
      "rowCount": 1,
      "columnCount": 1
    })
    setAction(null)
    setRowLabel([])
    setColLabel([])
  }

  return (
    <dialog id="bus_modal" className="modal">
      <div className="modal-box max-w-3/4 max-h-3/4">
        {/* MODAL TITLE */}
        <h3 className="font-bold text-lg text-center text-blue-900">{action === "EDIT" ? "Edit Selected " : "Add a "} Bus</h3>
        {/* MODAL CONTAINER */}
        <div className="modal-action">
          {/* FORM */}
          <form method="dialog" className="w-full" onSubmit={(e) => {
            e.preventDefault(); // prevent default form behavior
            handleSubmit();
          }}>
            <div className="flex gap-2 w-full">
              {/* LEFT CONTAINER for BUS SEAT DISPLAY */}
              <div className="flex flex-col flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                <p className="text-sm text-blue-900 font-semibold mb-2">Bus Layout</p>
                <div className="flex flex-col flex-1 items-center justify-center">
                  {/* Seat Grid */}
                  {
                    rowLabel.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-2 mb-1">
                        {colLabel.map((col) => {
                          const seatId = `${row}${col}`
                          return (
                            <button key={seatId} disabled className="w-8 h-8 rounded-sm border-1 border-primary font-bold text-sm">
                              {seatId}
                            </button>
                          )
                        })}
                      </div>
                    )
                  )}
                </div>
              </div> 
              {/* RIGHT CONTAINER for BUS fields entry */}
              <div className="flex-1 items-center justify-center bg-blue-50 p-2 rounded-box">
                {/* PLATE No. */}
                <p className="text-sm text-center font-semibold text-blue-900">Bus Data</p>
                <fieldset className="fieldset p-4 w-full">
                  <label className="label">Plate No.</label>
                  <input type="text" name="plateNumber" required className="input input-primary input-sm" placeholder="ex. ABC-123" onChange={handleInputChange} value={busInput?.plateNumber || ""}/>
                  {/* BUS NAME */}
                  <label className="label">Bus Name</label>
                  <input type="text" name="name" required className="input input-primary input-sm" placeholder="ex. Ceres Liner 01" onChange={handleInputChange} value={busInput?.name || ""}/>
                  {/* OPERATOR NAME */}
                  <label className="label">Bus Operator Name</label>
                  <input type="text" name="operator" required className="input input-primary input-sm" placeholder="ex. Juan Dela Cruz" onChange={handleInputChange} value={busInput?.operator || ""}/>
                  <div className="flex items-end gap-2 w-full">
                    {/* ROW NUMBER */}
                    <div className="flex-1">
                      <label className="label">No. of Seat Rows</label>
                      <input type="number" name="rowCount" min={1} required className="input input-primary input-sm" onChange={handleInputChange} value={busInput?.rowCount || ""}/>
                    </div>
                    {/* ROW NUMBER */}
                    <div className="flex-1">
                      <label className="label">No. of Seat Columns</label>
                      <input type="number" name="columnCount" min={1} max={6} required className="input input-primary input-sm" onChange={handleInputChange} value={busInput?.columnCount || ""}/>
                    </div>
                  </div>
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