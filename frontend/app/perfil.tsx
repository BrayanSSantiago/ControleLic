import React, { useState } from "react"
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import Navbar from "../components/navbar"

export default function Perfil() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [senha, setSenha] = useState("")
  const [repetirSenha, setRepetirSenha] = useState("")

  const handleSalvar = () => {
    // aqui você pode fazer sua lógica de atualização
    console.log({ username, email, senha, repetirSenha })
  }

  return (
    
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Navbar />
      <View className="h-px mb-4 bg-gray-300 shadow" />

      {/* Avatar centralizado */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: user?.avatar || "https://i.pravatar.cc/150?img=3" }}
          className="mb-4 rounded-full w-28 h-28"
        />
        <Text className="text-xl font-bold text-gray-800">{user?.username || "Usuário"}</Text>
      </View>

      {/* Formulário */}
      <View className="space-y-4">
        <View>
          <Text className="mb-1 text-sm font-medium text-gray-600">Nome de Usuário</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Digite seu nome"
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-600">E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            className="px-4 py-2 border border-gray-300 rounded"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-600">Nova Senha</Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua nova senha"
            secureTextEntry
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-gray-600">Repetir Senha</Text>
          <TextInput
            value={repetirSenha}
            onChangeText={setRepetirSenha}
            placeholder="Repita sua nova senha"
            secureTextEntry
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </View>

        <TouchableOpacity
          onPress={handleSalvar}
          className="py-3 mt-6 bg-blue-600 rounded"
        >
          <Text className="font-semibold text-center text-white">Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
