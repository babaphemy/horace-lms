"use client"

import { useEffect } from "react"
import TagManager from "react-gtm-module"
const useTag = ({
  pageTitle,
  pagePath,
}: {
  pageTitle: string
  pagePath: string
}) => {
  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "pageview",
        pagePath,
        pageTitle,
      },
    })
  }, [pagePath, pageTitle])
}
export default useTag
