import { useEffect, useState } from "react"
import type { RootState } from '../store'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import Navbar from "../components/navbar"
import FiltroModal from "../components/FiltroModal"

export default function FavoritasScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false)
  const [licitacoes, setLicitacoes] = useState<any[]>([])
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)

  const user = useSelector((state: RootState) => state.auth.user)
  const user_id = user?.id

  const [filtros, setFiltros] = useState<{ [key: string]: string }>({
    objeto: "",
    estado: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
  })

  const [filtrosAtivos, setFiltrosAtivos] = useState({ ...filtros })
  const [filtrosDinamicos, setFiltrosDinamicos] = useState<{ [key: string]: string[] }>({
    orgao: [],
    modalidade_contratacao: [],
    unidade_compradora: [],
    amparo_legal: [],
    modo_disputa: [],
    situacao: [],
    fonte: [],
  })

  const fetchFiltrosDinamicos = async () => {
    try {
      const res = await fetch(`${apiUrl}filtros`)
      const json = await res.json()
      if (json.success) setFiltrosDinamicos(json.data)
    } catch (err) {
      console.error("Erro ao buscar filtros dinâmicos:", err)
    }
  }

  const fetchFavoritas = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}licitacoesFav`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, ...filtrosAtivos }),
      })

      const json = await res.json()
      if (json.success) {
        setLicitacoes(json.data || [])
        setPage(1)
      }
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    setFiltrosAtivos({ ...filtros })
    setModalVisible(false)
  }

  const limparFiltro = (campo: string) => {
    const atualizado = { ...filtrosAtivos, [campo]: "" }
    setFiltros(atualizado)
    setFiltrosAtivos(atualizado)
    setPage(1)
  }

  const limparTodos = () => {
    const limpo = Object.keys(filtrosAtivos).reduce((acc, key) => {
      acc[key] = ""
      return acc
    }, {} as { [key: string]: string })
    setFiltros(limpo)
    setFiltrosAtivos(limpo)
    setPage(1)
  }

  const removeFavorito = async (id: number) => {
    try {
      await fetch(`${apiUrl}/delFavoritos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, licitacao_id: id }),
      })
      fetchFavoritas()
    } catch (err) {
      console.error("Erro ao remover favorito:", err)
    }
  }

  useEffect(() => {
    if (user_id) fetchFavoritas()
  }, [user_id, filtrosAtivos])

  useEffect(() => {
    fetchFiltrosDinamicos()
  }, [])

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const paginatedLicitacoes = licitacoes.slice((page - 1) * limit, page * limit)
  const totalPages = Math.ceil(licitacoes.length / limit)

  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      <Navbar />
      <View className="h-px mb-4 bg-gray-300 shadow" />
      <Text className="mb-4 text-xl font-bold text-center text-blue-600">Licitações Favoritadas</Text>

      {/* Filtros Ativos + botão */}
      <View className="flex-row flex-wrap items-center gap-2 mb-4">
        <TouchableOpacity
          className="px-4 py-2 bg-blue-500 rounded"
          onPress={() => setModalVisible(true)}
        >
          <Text className="font-semibold text-white">Filtros</Text>
        </TouchableOpacity>

        {Object.entries(filtrosAtivos).map(([chave, valor]) =>
          valor ? (
            <View key={chave} className="flex-row items-center px-3 py-1 bg-gray-200 rounded-full">
              <Text className="mr-2 text-sm text-gray-700">{chave}: {valor}</Text>
              <TouchableOpacity onPress={() => limparFiltro(chave)}>
                <Text className="font-bold text-red-500">✕</Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}

        {Object.values(filtrosAtivos).some((v) => v) && (
          <TouchableOpacity className="px-3 py-1 bg-red-500 rounded" onPress={limparTodos}>
            <Text className="text-sm font-semibold text-white">Limpar todos</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal com filtros */}
      <FiltroModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filtros={filtros}
        setFiltros={setFiltros}
        filtrosDinamicos={filtrosDinamicos}
        aplicarFiltros={aplicarFiltros}
      />

      <ScrollView className="mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : paginatedLicitacoes.length === 0 ? (
          <Text className="text-center text-gray-500">Você não possui editais favoritados.</Text>
        ) : (
          paginatedLicitacoes.map((edital: any) => (
            <View key={edital.id} className="relative p-4 mb-4 bg-white rounded-lg shadow">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-gray-700">{edital.numero}</Text>
                  <Text className="text-gray-500 break-words">Objeto: {edital.objeto}</Text>
                </View>

                <TouchableOpacity onPress={() => removeFavorito(edital.id)}>
                  <Ionicons name="star" size={24} color="#facc15" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleExpand(edital.id)}>
                  <Ionicons
                    name={expanded[edital.id] ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {expanded[edital.id] && (
                <View className="mt-4 space-y-1 text-gray-600">
                  <Text>Data início: {edital.data_inicio_recebimento_propostas}</Text>
                  <Text>Data fim: {edital.data_fim_recebimento_propostas}</Text>
                  <Text>Órgão: {edital.orgao}</Text>
                  <Text>Local: {edital.local}</Text>
                  <Text>Tipo: {edital.tipo}</Text>
                  <Text>Valor: R$ {edital.valorLicitacao}</Text>
                  <View className="flex-row flex-wrap items-center">
                    <Text className="mr-1 text-gray-700">Link:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(edital.link)}>
                      <Text className="text-blue-500 underline">{edital.link}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Paginação */}
      <View className="items-center justify-center mt-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            className="px-4 py-2 bg-gray-300 rounded"
            onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <Text>Anterior</Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">Página {page} de {totalPages}</Text>
          <TouchableOpacity
            className="px-4 py-2 bg-gray-300 rounded"
            onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <Text>Próxima</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
