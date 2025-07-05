import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";


export default function HomeRedirectRoute() {
  const {role} = useUser()
  const navigate = useNavigate()

  useEffect(()=>{
    if (role === "PASSENGER") navigate("/passenger-home");
    else if (role === "TICKET_STAFF") navigate("/staff-home");
    else if (role === "TRANSIT_ADMIN") navigate("/admin-home");
    else navigate("/*");
  }, [role])

  return <>Loading ...</>
}