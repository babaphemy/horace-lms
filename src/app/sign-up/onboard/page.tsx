"use client"
import Header from "@/components/Header"
import useTag from "@/hooks/useTag"
import { Container } from "@mui/material"
import React from "react"
import { Button } from "@mui/material"
export default function Onboard() {
  useTag({ pageTitle: "signup", pagePath: "/sign-up" })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Perform form submission logic here
    // e.g., send data to the server
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
