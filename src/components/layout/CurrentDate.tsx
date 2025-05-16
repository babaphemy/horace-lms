import { useEffect, useState } from "react"
import styles from "./CurrentDate.module.css"

function CurrentDate() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const options = {
      day: "2-digit" as const,
      month: "long" as const,
      year: "numeric" as const,
    }
    const formatter = new Intl.DateTimeFormat("en-US", options)
    const date = new Date()
    setCurrentDate(formatter.format(date))
  }, [])

  return (
    <>
      <div className={styles.currentDate}>
        <i className="ri-calendar-2-line"></i>
        {currentDate}
      </div>
    </>
  )
}

export default CurrentDate
