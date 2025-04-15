import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal } from "react-native"
import { useSelector } from "react-redux"
import { useRouter } from "expo-router"
import type { RootState } from "../store"
import Navbar from "@/components/navbar"

export default function Admin() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [novoUsuario, setNovoUsuario] = useState({ username: "", email: "", senha: "" })

  useEffect(() => {
    if (user?.username !== "admin") {
      router.replace("/dashboard")
      return
    }

    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    const res = await fetch(`${apiUrl}usuarios`)
    const json = await res.json()
    if (json.success) setUsuarios(json.data)
  }

  const criarUsuario = async () => {
    await fetch(`${apiUrl}usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario),
    })
    setModalVisible(false)
    setNovoUsuario({ username: "", email: "", senha: "" })
    fetchUsuarios()
  }

  const deletarUsuario = async (id: number) => {
    await fetch(`${apiUrl}usuarios/${id}`, { method: "DELETE" })
    fetchUsuarios()
  }

  return (
    <View className="flex-1 px-4 pt-8 bg-white">
      <Navbar />
      <View className="h-px mb-4 bg-gray-300 shadow" />

      {/* Título e Botão */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xl font-bold text-blue-700">Administração de Usuários</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="px-4 py-2 bg-green-500 rounded"
        >
          <Text className="font-semibold text-white">+ Criar Usuário</Text>
        </TouchableOpacity>
      </View>

      <View className="w-full h-px mb-2 bg-gray-300" />

      {/* Cabeçalho da Tabela */}
      <View className="flex-row items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-t">
        <Text className="w-1/3 font-semibold text-left text-gray-700">Usuário</Text>
        <Text className="w-1/3 font-semibold text-left text-gray-700">Email</Text>
        <Text className="w-1/3 font-semibold text-right text-gray-700">Ações</Text>
      </View>

      {/* Lista de Usuários */}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="w-1/3 text-left text-gray-800">{item.username}</Text>
            <Text className="w-1/3 text-left text-gray-600">{item.email}</Text>
            <View className="flex-row justify-end w-1/3 space-x-2">
              <TouchableOpacity className="px-3 py-1 bg-yellow-400 rounded">
                <Text className="text-white">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-3 py-1 bg-red-500 rounded"
                onPress={() => deletarUsuario(item.id)}
              >
                <Text className="text-white">Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />


      {/* Modal de Criação */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="justify-center flex-1 px-6 bg-black bg-opacity-40">
          <View className="p-6 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-bold text-gray-700">Novo Usuário</Text>

            <TextInput
              placeholder="Usuário"
              value={novoUsuario.username}
              onChangeText={(text) => setNovoUsuario({ ...novoUsuario, username: text })}
              className="px-3 py-2 mb-3 border border-gray-300 rounded"
            />
            <TextInput
              placeholder="Email"
              value={novoUsuario.email}
              onChangeText={(text) => setNovoUsuario({ ...novoUsuario, email: text })}
              className="px-3 py-2 mb-3 border border-gray-300 rounded"
            />
            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={novoUsuario.senha}
              onChangeText={(text) => setNovoUsuario({ ...novoUsuario, senha: text })}
              className="px-3 py-2 mb-3 border border-gray-300 rounded"
            />

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={criarUsuario}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                <Text className="text-white">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
