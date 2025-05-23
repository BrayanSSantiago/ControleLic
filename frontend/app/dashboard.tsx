import { useEffect, useState } from "react"
import type { RootState } from '../store'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  FlatList
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import FiltroModal from "../components/FiltroModal"
import BottomNav from "../components/BottomNav"
import { useIsMobile } from "@/utils/useIsmobile"

export default function DashboardScreen() {
  const isMobile = useIsMobile()
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [licitacoes, setLicitacoes] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
  const [favoritos, setFavoritos] = useState<number[]>([])

  const user = useSelector((state: RootState) => state.auth.user)
  const user_id = user?.id

  const [filtros, setFiltros] = useState<{ [key: string]: string }>({
    objeto: "",
    estado: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
  })

  const [filtrosDinamicos, setFiltrosDinamicos] = useState<{ [key: string]: string[] }>({
    orgao: [],
    modalidade_contratacao: [],
    unidade_compradora: [],
    amparo_legal: [],
    modo_disputa: [],
    situacao: [],
    fonte: [],
  })

  const [filtrosAtivos, setFiltrosAtivos] = useState<{ [key: string]: string }>({
    objeto: "",
    estado: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
  })

  const fetchFiltrosDinamicos = async () => {
    try {
      const res = await fetch(`${apiUrl}filtros`)
      const json = await res.json()
      if (json.success) {
        setFiltrosDinamicos(json.data)
      }
    } catch (error) {
      console.error("Erro ao buscar filtros dinâmicos", error)
    }
  }

  const fetchLicitacoes = async (targetPage = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true)

      const params = new URLSearchParams({
        ...filtrosAtivos,
        page: targetPage.toString(),
        limit: "10",
      })

      const response = await fetch(`${apiUrl}licitacoes?${params}`)
      const data = await response.json()

      if (append) {
        setLicitacoes((prev) => [...prev, ...data.data])
      } else {
        setLicitacoes(data.data || [])
      }

      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Erro ao buscar licitações:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const toggleFavorito = async (id: number) => {
    try {
      const isFavorito = favoritos.includes(id)
      const endpoint = isFavorito ? "delFavoritos" : "addFavoritos"
      const method = isFavorito ? "DELETE" : "POST"

      await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, licitacao_id: id }),
      })

      setFavoritos(prev =>
        isFavorito ? prev.filter(fav => fav !== id) : [...prev, id]
      )
    } catch (err) {
      console.error("Erro ao favoritar:", err)
    }
  }

  const aplicarFiltros = () => {
    setPage(1)
    setLicitacoes([])
    setFiltrosAtivos({ ...filtros })
    setModalVisible(false)
  }

  const limparFiltro = (campo: string) => {
    const atualizado = { ...filtrosAtivos, [campo]: "" }
    setFiltrosAtivos(atualizado)
    setPage(1)
    setLicitacoes([])
  }

  const limparTodos = () => {
    const limpo: { [key: string]: string } = {}
    Object.keys(filtrosAtivos).forEach((k) => (limpo[k] = ""))
    setFiltrosAtivos(limpo)
    setPage(1)
    setLicitacoes([])
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    fetchFiltrosDinamicos()
  }, [])
  
  useEffect(() => {
  if (page > 1) {
    fetchLicitacoes(page, true)
  }
}, [page])

  useEffect(() => {
    const novos = { ...filtros }
    Object.keys(filtrosDinamicos).forEach((campo) => {
      if (!(campo in novos)) {
        novos[campo] = ""
      }
    })
    setFiltros(novos)
  }, [filtrosDinamicos])

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`${apiUrl}fetchFavoritos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        })

        const json = await res.json()
        if (json.success) {
          setFavoritos(json.data || [])
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err)
      }
    }

    if (user_id) fetchFavoritos()
  }, [user_id])

  useEffect(() => {
    fetchLicitacoes(1, false)
  }, [filtrosAtivos])

  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      <View className="h-px mb-4 bg-gray-300 shadow" />
      <Text className="mb-4 text-xl font-bold text-center text-blue-600">Licitações</Text>

      {/* Filtros Ativos */}
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
              <Text className="mr-2 text-sm text-gray-700">
                {chave}: {valor}
              </Text>
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

      {/* Modal de Filtros */}
      <FiltroModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filtros={filtros}
        setFiltros={setFiltros}
        filtrosDinamicos={filtrosDinamicos}
        aplicarFiltros={aplicarFiltros}
      />

      {/* Lista de Licitações */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : licitacoes.length === 0 ? (
        <Text className="text-center text-gray-500">Nenhuma licitação encontrada</Text>
      ) : (
        <FlatList
          data={licitacoes}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
          renderItem={({ item }) => (
            <View className="relative p-4 mb-4 bg-white rounded-lg shadow">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-gray-700">{item.numero}</Text>
                  <Text className="text-gray-500 break-words">Objeto: {item.objeto}</Text>
                </View>
                <View className="flex-row items-start space-x-2">
                  <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                    <Ionicons
                      name={favoritos.includes(item.id) ? "star" : "star-outline"}
                      size={24}
                      color={favoritos.includes(item.id) ? "#facc15" : "#999"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <Ionicons
                      name={expanded[item.id] ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {expanded[item.id] && (
                <View className="mt-4 space-y-1 text-gray-600">
                  <Text>Data início: {item.data_inicio_recebimento_propostas}</Text>
                  <Text>Data fim: {item.data_fim_recebimento_propostas}</Text>
                  <Text>Órgão: {item.orgao}</Text>
                  <Text>Local: {item.local}</Text>
                  <Text>Tipo: {item.tipo}</Text>
                  <Text>Valor: R$ {item.valorLicitacao}</Text>
                  <View className="flex-row flex-wrap items-center">
                    <Text className="mr-1 text-gray-700">Link:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                      <Text className="text-blue-500 underline">{item.link}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          onEndReached={() => {
            if (!loadingMore && page < totalPages) {
              setPage(prev => prev + 1) // Só atualiza o state
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}
