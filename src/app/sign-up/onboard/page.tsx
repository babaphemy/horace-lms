"use client"
import Header from "@/components/Header"
import useTag from "@/hooks/useTag"
import { Container } from "@mui/material"
import React, { useState } from "react"
import { Button } from "@mui/material"
export default function Onboard() {
  useTag({ pageTitle: "signup", pagePath: "/sign-up" })
  const [schoolName, setSchoolName] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Perform form submission logic here
    // e.g., send data to the server
    console.log("Form submitted:", schoolName, address, contactNumber)
  }

  return (
    <div>
      <Header />
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </div>
  )
}
