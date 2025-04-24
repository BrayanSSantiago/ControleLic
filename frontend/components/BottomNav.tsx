import React from "react"
import { View, TouchableOpacity, Text, Platform, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

const BottomNav = () => {
  const router = useRouter()
  const screenWidth = Dimensions.get("window").width
  const isMobile = screenWidth < 768 || Platform.OS !== "web"

  if (!isMobile) return null

  return (
    <View
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ccc",
        zIndex: 999,
      }}
    >
      <TouchableOpacity onPress={() => router.push("/dashboard")} style={{ alignItems: "center" }}>
        <Ionicons name="document-text-outline" size={24} color="#1e3a8a" />
        <Text style={{ fontSize: 12, color: "#1e3a8a" }}>Licitações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/favoritos")} style={{ alignItems: "center" }}>
        <Ionicons name="heart-outline" size={24} color="#1e3a8a" />
        <Text style={{ fontSize: 12, color: "#1e3a8a" }}>Favoritas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/perfil")} style={{ alignItems: "center" }}>
        <Ionicons name="person-circle-outline" size={24} color="#1e3a8a" />
        <Text style={{ fontSize: 12, color: "#1e3a8a" }}>Perfil</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BottomNav
