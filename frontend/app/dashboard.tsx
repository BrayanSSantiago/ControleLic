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
import FiltroModal from "../components/FiltroModal"
import Navbar from "../components/navbar"


export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [licitacoes, setLicitacoes] = useState<any[]>([])
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  // Busca filtros únicos
  const fetchFiltrosDinamicos = async () => {
    try {
      const res = await fetch("https://techfund.net.br/api/filtros")
      const json = await res.json()
      if (json.success) {
        setFiltrosDinamicos(json.data)
      }
    } catch (error) {
      console.error("Erro ao buscar filtros dinâmicos", error)
    }
  }

  // Alterna favorito
  const toggleFavorito = async (id: number) => {
    try {
      const isFavorito = favoritos.includes(id)

      if (isFavorito) {
        await fetch(`https://techfund.net.br/api/delFavoritos`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, licitacao_id: id }),
        })
        setFavoritos(favoritos.filter(fav => fav !== id))
      } else {
        await fetch("http:https://techfund.net.br/api/addFavoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, licitacao_id: id }),
        })
        setFavoritos([...favoritos, id])
      }
    } catch (err) {
      console.error("Erro ao favoritar:", err)
    }
  }

  // Pega licitações
  const fetchLicitacoes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...filtrosAtivos,
        page: page.toString(),
        limit: "10",
      })

      const response = await fetch(`https://techfund.net.br/api/licitacoes?${params}`)
      const data = await response.json()
      setLicitacoes(data.data || [])
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Erro ao buscar licitações:", error)
    } finally {
      setLoading(false)
    }
  }

  // Aplica os filtros
  const aplicarFiltros = () => {
    setPage(1)
    setFiltrosAtivos({ ...filtros })
    setModalVisible(false)
  }

  useEffect(() => {
    fetchLicitacoes()
  }, [page, filtrosAtivos])

  useEffect(() => {
    fetchFiltrosDinamicos()
  }, [])

  // Garante que os filtros dinâmicos fiquem sincronizados
  useEffect(() => {
    const novos = { ...filtros }
    Object.keys(filtrosDinamicos).forEach((campo) => {
      if (!(campo in novos)) {
        novos[campo] = ""
      }
    })
    setFiltros(novos)
  }, [filtrosDinamicos])

  // Buscar favoritos do usuário
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await fetch("https://techfund.net.br/api/fetchFavoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        })
  
        const json = await res.json()
  
        if (json.success) {
          setFavoritos(json.data || [])
        } else {
          console.warn("Resposta de favoritos sem success:", json)
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err)
      }
    }
  
    if (user_id) fetchFavoritos()
  }, [user_id])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const limparFiltro = (campo: string) => {
    const atualizado = { ...filtrosAtivos, [campo]: "" }
    setFiltros(atualizado)
    setFiltrosAtivos(atualizado)
    setPage(1)
  }

  const limparTodos = () => {
    const limpo: { [key: string]: string } = {}
    Object.keys(filtrosAtivos).forEach((k) => (limpo[k] = ""))
    setFiltros(limpo)
    setFiltrosAtivos(limpo)
    setPage(1)
  }
  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      {/* Navbar */}
      
      <Navbar />


      <View className="h-px mb-4 bg-gray-300 shadow" />

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
            <View
              key={chave}
              className="flex-row items-center px-3 py-1 bg-gray-200 rounded-full"
            >
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

      {/* Modal com filtros */}
      <FiltroModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filtros={filtros}
        setFiltros={setFiltros}
        filtrosDinamicos={filtrosDinamicos}
        aplicarFiltros={aplicarFiltros}
      />

      {/* Lista */}
      <ScrollView className="mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : licitacoes.length === 0 ? (
          <Text className="text-center text-gray-500">Nenhuma licitação encontrada</Text>
        ) : (
          licitacoes.map((edital: any) => (
            <View key={edital.id} className="relative p-4 mb-4 bg-white rounded-lg shadow" >

               {/* Topo do Card com Número, Estrela e Seta */}
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-gray-700">{edital.numero}</Text>
                  <Text className="text-gray-500 break-words">Objeto: {edital.objeto}</Text>
                </View>

                <View className="flex-row items-start space-x-2">
                  {/* Ícone de favorito */}
                  <TouchableOpacity onPress={() => toggleFavorito(edital.id)}>
                    <Ionicons
                      name={favoritos.includes(edital.id) ? "star" : "star-outline"}
                      size={24}
                      color={favoritos.includes(edital.id) ? "#facc15" : "#999"}
                    />
                  </TouchableOpacity>

                  {/* Ícone de expandir */}
                  <TouchableOpacity onPress={() => toggleExpand(edital.id)}>
                    <Ionicons
                      name={expanded[edital.id] ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
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
          <Text className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </Text>
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
