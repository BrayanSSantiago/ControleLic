import { Stack } from "expo-router"
import "../global.css"
import { Provider } from "react-redux"
import { store, persistor } from "../store"
import { ActivityIndicator } from "react-native"
import { PersistGate } from "redux-persist/integration/react"
import { useAuthGuard } from "../utils/useAuthGuard"
import { Provider as PaperProvider } from "react-native-paper" // ← import do Paper

function AppLayout() {
  useAuthGuard() // 🔒 Proteção de rotas

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <PaperProvider>
          <AppLayout />
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
}
