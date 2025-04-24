import { Dimensions, Platform } from "react-native"
import { useEffect, useState } from "react"

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    Dimensions.get("window").width < 768 || Platform.OS !== "web"
  )

  useEffect(() => {
    const update = () => {
      const width = Dimensions.get("window").width
      setIsMobile(width < 768 || Platform.OS !== "web")
    }

    const subscription = Dimensions.addEventListener("change", update)

    return () => {
      subscription?.remove()
    }
  }, [])

  return isMobile
}
