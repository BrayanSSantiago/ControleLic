import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../slices/authSlice"
import type { RootState } from "../store"
import { Menu, Divider } from "react-native-paper"

export default function Navbar() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const [menuVisible, setMenuVisible] = useState(false)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const handleLogout = () => {
    dispatch(logout())
    closeMenu()
    router.push("/")
  }

  const handlePerfil = () => {
    closeMenu()
    router.push("/perfil")
  }

  return (
<View className="flex-row items-center justify-between w-full px-4 mb-4">
  {/* Logo à esquerda */}
  <View>
    <TouchableOpacity onPress={() => router.push("/")}>
      <Text className="text-2xl font-bold text-blue-600">TechFund</Text>
    </TouchableOpacity>
  </View>

  {/* Navegação ao centro */}
  <View className="flex-row items-center justify-center flex-1 space-x-4">
    <TouchableOpacity
      onPress={() => router.push("/dashboard")}
      className="px-3 py-1 bg-blue-100 rounded"
    >
      <Text className="text-base font-semibold text-blue-700">Licitações</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.push("/favoritos")}
      className="px-3 py-1 bg-blue-100 rounded"
    >
      <Text className="text-base font-semibold text-blue-700">Favoritas</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.push("/adm")}
      className="px-3 py-1 bg-blue-100 rounded"
    >
      <Text className="text-base font-semibold text-blue-700">Admin</Text>
    </TouchableOpacity>
  </View>

  {/* Avatar completamente à direita */}
  <View className="ml-4">
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <Image
            source={{
              uri: user?.avatar ?? "https://i.pravatar.cc/150?img=3",
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 1.5,
              borderColor: "#1f2937", // gray-800
            }}
          />
        </TouchableOpacity>
      }
      anchorPosition="bottom"
      contentStyle={{
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        paddingVertical: 4,
        elevation: 4,
        marginTop: 8,
        minWidth: 160,
      }}
    >
      <Text className="px-4 py-2 text-sm font-semibold text-gray-700">
        {user?.username || "Usuário"}
      </Text>
      <Divider />
      <Menu.Item onPress={handlePerfil} title="Meu Perfil" />
      <Menu.Item
        onPress={handleLogout}
        title="Sair"
        titleStyle={{ color: "red", fontWeight: "bold" }}
      />
    </Menu>
  </View>
</View>


  )
}
