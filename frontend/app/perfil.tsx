import React, { useState } from "react"
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import * as ImagePicker from "expo-image-picker"
import type { RootState } from "../store"
import { loginSuccess } from "../slices/authSlice"
import Navbar from "@/components/navbar"

export default function Perfil() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [senha, setSenha] = useState("")
  const [repetirSenha, setRepetirSenha] = useState("")
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null)

  const escolherImagem = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })

    if (!res.canceled && res.assets.length > 0) {
      setAvatarBase64(res.assets[0].base64 || null)
    }
  }

  const handleSalvar = async () => {
    try {
      await fetch(`${apiUrl}updateUsuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          usuario: username,
          email,
          senha,
          repetirSenha,
          avatar: avatarBase64
            ? `data:image/jpeg;base64,${avatarBase64}`
            : user?.avatar,
        }),
      })

      // Atualiza os dados na sessão Redux
      dispatch(
        loginSuccess({
          token: token || "",
          user: {
            id: Number(user?.id),
            username,
            email,
            avatar: avatarBase64
              ? `data:image/jpeg;base64,${avatarBase64}`
              : user?.avatar || " ",
            cargo: user?.cargo || "",
          },
        })
      )
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
    }
  }

  return (
    
    <ScrollView contentContainerStyle={{ padding: 24 }}>


      <View className="h-px mb-4 bg-gray-300 shadow" />      <View className="items-center mb-6">
        <TouchableOpacity onPress={escolherImagem}>
          <Image
            source={{
              uri: avatarBase64
                ? `data:image/jpeg;base64,${avatarBase64}`
                : user?.avatar || "https://i.pravatar.cc/150?img=3",
            }}
            style={{
              width: 90,
              height: 80,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: "#1f2937", // cinza escuro
            }}
            className="mb-2 rounded-full w-28 h-28"
          />
          <Text className="text-sm text-center text-blue-600 underline">Alterar Foto</Text>
        </TouchableOpacity>
        <Text className="mt-2 text-xl font-bold text-gray-800">{username || "Usuário"}</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="mb-1 text-sm text-gray-600">Nome de Usuário</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Digite seu nome"
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-600">E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-600">Nova Senha</Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua nova senha"
            secureTextEntry
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-600">Repetir Senha</Text>
          <TextInput
            value={repetirSenha}
            onChangeText={setRepetirSenha}
            placeholder="Repita sua nova senha"
            secureTextEntry
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <TouchableOpacity onPress={handleSalvar} className="py-3 mt-6 bg-blue-600 rounded">
          <Text className="font-semibold text-center text-white">Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
