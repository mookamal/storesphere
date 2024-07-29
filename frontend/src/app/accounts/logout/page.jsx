"use client";

import AuthContainer from "../../../components/accounts/AuthContainer";
import { Button } from "flowbite-react";

const API_LOGOUT_URL = "/auth/logout";

export default function Logout() {
    async function handleLogout(e) {
        e.preventDefault();
        const response = await fetch(API_LOGOUT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: "",
        });
        const data = await response.json();
        if (response.ok) {
            console.log("logout successful");
        } 
    }
  return (
    <AuthContainer>
        <div className="p-10">
            <h1 className="text-red-500 text-center">Are you sure want to logout?</h1>
            <Button color="failure" className="my-5 mx-auto" onClick={handleLogout}>Logout</Button>
        </div>
    </AuthContainer>
  )
}
