import { Stack, Slot, usePathname} from "expo-router"
import "../global.css"
import { Provider } from "react-redux"
import { store, persistor } from "../store"
import { ActivityIndicator,View } from "react-native"
import { PersistGate } from "redux-persist/integration/react"
import { useAuthGuard } from "../utils/useAuthGuard"
import { Provider as PaperProvider } from "react-native-paper" // ← import do Paper
import Navbar from "@/components/navbar"
import BottomNavbar from "@/components/BottomNav"
import { useIsMobile } from "@/utils/useIsmobile"

function AppLayout() {
  useAuthGuard() // 🔒 Proteção de rotas

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const mostrarLayout = pathname !== "/" && pathname !== "/login" && pathname !== "/cadastro"
  return (
    
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <PaperProvider>
        <View style={{ flex: 1 }}>
      {/* Renderiza Navbar apenas em telas grandes */}
        {mostrarLayout && <Navbar /> }
          <AppLayout />
           {/* Renderiza BottomNavbar apenas em telas pequenas */}
      {mostrarLayout && isMobile && <BottomNavbar />}
    </View>
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}
