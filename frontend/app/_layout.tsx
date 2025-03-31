import { Stack } from "expo-router";
import '../global.css';
import { Provider } from "react-redux";
import { store,persistor  } from "../store";
import { ActivityIndicator } from "react-native"

import { PersistGate } from "redux-persist/integration/react"

export default function RootLayout() {
  return(
     <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
       <Stack screenOptions={{ headerShown: false }} />
       </PersistGate>
     </Provider>
  )
 }
 
 
 