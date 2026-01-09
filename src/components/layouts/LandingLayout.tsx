import { Navbar } from "../ui/Navbar";
import { Outlet } from "@tanstack/react-router";

export default function LandingLayout(){
    return(
        <>
        <Navbar />
        <Outlet />
        </>
    )
}