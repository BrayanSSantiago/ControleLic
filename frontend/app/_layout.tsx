import { Stack, useRouter, useSegments } from "expo-router"
import "../global.css"
import { Provider, useSelector } from "react-redux"
import { store, persistor } from "../store"
import { ActivityIndicator } from "react-native"
import { PersistGate } from "redux-persist/integration/react"
import { useAuthGuard } from "../utils/useAuthGuard"

function AppLayout() {
  useAuthGuard() // 🔒 Protege a navegação

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppLayout />
      </PersistGate>
    </Provider>
  )
}