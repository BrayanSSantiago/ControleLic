import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal } from "react-native"
import { useSelector } from "react-redux"
import { useRouter } from "expo-router"
import type { RootState } from "../store"
import Navbar from "../components/navbar"

export default function Admin() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editando, setEditando] = useState<boolean>(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null)

  const [formUsuario, setFormUsuario] = useState({
    username: "",
    email: "",
    senha: "",
    repetirSenha: "",
    cargo: "",
  })

  useEffect(() => {
    if (!user) return // espera carregar
    if (user?.cargo !== "Administrador") {
     
      return
    }
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    const res = await fetch(`${apiUrl}GETuser`)
    const json = await res.json()
    if (json.success) setUsuarios(json.data)
  }

  const abrirModalCriacao = () => {
    setEditando(false)
    setFormUsuario({ username: "", email: "", senha: "", repetirSenha: "", cargo: "" })
    setModalVisible(true)
  }

  const abrirModalEdicao = (usuario: any) => {
    setEditando(true)
    setUsuarioSelecionado(usuario.id)
    setFormUsuario({
      username: usuario.username,
      email: usuario.email,
      senha: "",
      repetirSenha: "",
      cargo: usuario.cargo || "",
    })
    setModalVisible(true)
  }

  const criarUsuario = async () => {
    try {
      const res = await fetch(`${apiUrl}CreateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formUsuario.username,
          email: formUsuario.email,
          senha: formUsuario.senha,
          repetirSenha: formUsuario.repetirSenha,
          cargo: formUsuario.cargo,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        console.error("Erro ao criar usuário:", data.message)
        return
      }

      fecharModal()
      fetchUsuarios()
    } catch (error) {
      console.error("Erro na requisição de criação de usuário:", error)
    }
  }

  const editarUsuario = async () => {
    await fetch(`${apiUrl}updateUsuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: usuarioSelecionado, ...formUsuario }),
    })
    fecharModal()
    fetchUsuarios()
  }

  const deletarUsuario = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl}DeleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const json = await res.json()

      if (json.success) {
        fetchUsuarios()
      } else {
        console.error("Erro ao deletar:", json.message)
      }
    } catch (error) {
      console.error("Erro na requisição de deleção:", error)
    }
  }

  const fecharModal = () => {
    setModalVisible(false)
    setFormUsuario({ username: "", email: "", senha: "", repetirSenha: "", cargo: "" })
    setUsuarioSelecionado(null)
  }

  return (
    <View className="flex-1 px-4 pt-8 bg-white">
      <View className="h-px mb-4 bg-gray-300 shadow" />

      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xl font-bold text-blue-700">Administração de Usuários</Text>
        <TouchableOpacity onPress={abrirModalCriacao} className="px-4 py-2 bg-green-500 rounded">
          <Text className="font-semibold text-white">+ Criar Usuário</Text>
        </TouchableOpacity>
      </View>

      <View className="w-full h-px mb-2 bg-gray-300" />

      <View className="flex-row items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-t">
        <Text className="w-1/4 font-semibold text-left text-gray-700">ID</Text>
        <Text className="w-1/4 font-semibold text-left text-gray-700">Usuário</Text>
        <Text className="w-1/4 font-semibold text-left text-gray-700">Email</Text>
        <Text className="w-1/4 font-semibold text-left text-gray-700">Cargo</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="w-1/4 text-left text-gray-800">{item.id}</Text>
            <Text className="w-1/4 text-left text-gray-800">{item.username}</Text>
            <Text className="w-1/4 text-left text-gray-600">{item.email}</Text>
            <View className="flex-row justify-between w-1/4">
              <Text className="text-gray-600">{item.cargo || "-"}</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="px-3 py-1 bg-yellow-400 rounded"
                  onPress={() => abrirModalEdicao(item)}
                >
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
          </View>
        )}
      />

      {/* Modal */}
   {/* Modal */}
    <Modal visible={modalVisible} transparent animationType="slide">
      <View className="justify-center flex-1 px-6 bg-black bg-opacity-40">
        <View className="p-6 bg-white rounded-lg">
          <Text className="mb-4 text-lg font-bold text-gray-700">
            {editando ? "Editar Usuário" : "Novo Usuário"}
          </Text>

          <TextInput
            placeholder="Usuário"
            value={formUsuario.username}
            onChangeText={(text) => setFormUsuario({ ...formUsuario, username: text })}
            className="px-3 py-2 mb-3 border border-gray-300 rounded"
          />

          <TextInput
            placeholder="Email"
            value={formUsuario.email}
            onChangeText={(text) => setFormUsuario({ ...formUsuario, email: text })}
            className="px-3 py-2 mb-3 border border-gray-300 rounded"
          />

          <TextInput
            placeholder="Senha"
            secureTextEntry
            value={formUsuario.senha}
            onChangeText={(text) => setFormUsuario({ ...formUsuario, senha: text })}
            className="px-3 py-2 mb-3 border border-gray-300 rounded"
          />

          <TextInput
            placeholder="Confirmar Senha"
            secureTextEntry
            value={formUsuario.repetirSenha}
            onChangeText={(text) => setFormUsuario({ ...formUsuario, repetirSenha: text })}
            className="px-3 py-2 mb-4 border border-gray-300 rounded"
          />

          {/* Cargo movido para o final */}
          <Text className="mb-2 text-gray-700">Cargo</Text>
          <View className="flex-row mb-4">
            <View className="pr-4">
            <TouchableOpacity
              onPress={() => setFormUsuario({ ...formUsuario, cargo: "Usuário" })}
              className={`flex-row items-center px-3 py-2 rounded border ${
                formUsuario.cargo === "usuário" ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              <View
                className={`w-4 h-4 mr-2 rounded-full border ${
                  formUsuario.cargo === "Usuário" ? "bg-blue-600 border-blue-600" : "border-gray-500"
                }`}
              />
              <Text className="text-gray-700">Usuário</Text>
            </TouchableOpacity>
            </View>       
            <TouchableOpacity
              onPress={() => setFormUsuario({ ...formUsuario, cargo: "Administrador" })}
              className={`flex-row items-center px-3 py-2 rounded border ${
                formUsuario.cargo === "admin" ? "bg-blue-100 border-blue-500" : "border-gray-300"
              }`}
            >
              <View
                className={`w-4 h-4 mr-2 rounded-full border ${
                  formUsuario.cargo === "Administrador" ? "bg-blue-600 border-blue-600" : "border-gray-500"
                }`}
              />
              <Text className="text-gray-700">Admin</Text>
            </TouchableOpacity>
          </View>

          {/* Botões de ação */}
          <View className="flex-row justify-end space-x-2">
            <TouchableOpacity onPress={fecharModal} className="px-4 py-2 bg-gray-300 rounded">
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={editando ? editarUsuario : criarUsuario}
              className="px-4 py-2 bg-blue-600 rounded"
            >
              <Text className="text-white">{editando ? "Salvar Edição" : "Salvar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    </View>
  )
}
