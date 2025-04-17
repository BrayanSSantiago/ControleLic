import { useEffect } from "react"
import { useRouter, useSegments } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

export const useAuthGuard = () => {
  const router = useRouter()
  const segments = useSegments()

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const rehydrated = useSelector((state: RootState) => state._persist?.rehydrated)

  useEffect(() => {
    if (!rehydrated) return

    const isLoggedIn = !!token && !!user
    const currentPath = segments.join("/")

    const permitido =
      currentPath === "" ||
      currentPath === "login" ||
      currentPath === "cadastro" ||
      (currentPath === "adm" && user?.cargo === "Administrador")

    if (!isLoggedIn && !permitido) {
      router.replace("/")
    }

    if (isLoggedIn && (currentPath === "" || currentPath === "login" || currentPath === "cadastro")) {
      router.replace("/dashboard")
    }
  }, [rehydrated, token, user, segments])
}
