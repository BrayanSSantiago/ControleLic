import { useEffect } from "react"
import { useRouter, useSegments } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

export const useAuthGuard = () => {
  const router = useRouter()
  const segments = useSegments()
  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    const isLoggedIn = !!token && !!user

    const currentPath = segments.join("/")

    if (!isLoggedIn && currentPath !== "login") {
      router.replace("/")
    }

    if (isLoggedIn && currentPath === "login") {
      router.replace("/dashboard")
    }
  }, [token, user, segments])
}
