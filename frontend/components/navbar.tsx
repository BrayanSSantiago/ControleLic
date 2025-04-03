import { View, Text, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../slices/authSlice"
import { useState } from "react"
import type { RootState } from "../store"

export default function Navbar() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <View className="flex-row items-center justify-between w-full mb-4">
      {/* Esquerda - Logo */}
      <View className="w-1/3">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="text-2xl font-bold text-blue-600">TechFund</Text>
        </TouchableOpacity>
      </View>

      {/* Centro - Navegação */}
      <View className="flex-row justify-center w-1/3 space-x-4">
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
      </View>

      {/* Direita - Usuário */}
      <View className="relative items-end w-1/3 pr-2">
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} className="items-center">
          <Image
            source={{
              uri: user?.avatar || "https://i.pravatar.cc/150?img=3",
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="mt-1 text-sm font-medium text-gray-700">{user?.username || "Usuário"}</Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View className="absolute right-0 z-10 w-32 mt-2 bg-white border border-gray-300 rounded shadow">
            <TouchableOpacity onPress={handleLogout} className="p-2 hover:bg-gray-100">
              <Text className="text-center text-red-500">Sair</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}
