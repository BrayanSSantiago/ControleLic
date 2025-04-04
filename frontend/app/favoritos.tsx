// pages/FavoritasScreen.tsx
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

export default function FavoritasScreen() {
  const [loading, setLoading] = useState(false)
  const [licitacoes, setLicitacoes] = useState<any[]>([])
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const user = useSelector((state: RootState) => state.auth.user)
  const user_id = user?.id

  const fetchFavoritas = async () => {
    try {
      setLoading(true)
      const res = await fetch("https://techfund.net.br/api/licitacoesFav", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      })
      const json = await res.json()
  
      if (json.success) {
        // Aqui você extrai os dados da chave `Licitacao` em cada favorito
        const licitacoesFavoritas = json.data
          .map((favorito: any) => favorito.Licitacao)
          .filter(Boolean) // remove nulos caso alguma associação falhe
  
        setLicitacoes(licitacoesFavoritas)
        setTotalPages(1)
      } else {
        console.warn("Resposta sem sucesso:", json)
      }
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user_id) fetchFavoritas()
  }, [user_id])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      <Navbar />
      <View className="h-px mb-4 bg-gray-300 shadow" />
      <Text className="mb-4 text-xl font-bold text-center text-blue-600">Editais Favoritados</Text>

      <ScrollView className="mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : licitacoes.length === 0 ? (
          <Text className="text-center text-gray-500">Você não possui editais favoritados.</Text>
        ) : (
          licitacoes.map((edital: any) => (
            <View key={edital.id} className="relative p-4 mb-4 bg-white rounded-lg shadow">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-gray-700">{edital.numero}</Text>
                  <Text className="text-gray-500 break-words">Objeto: {edital.objeto}</Text>
                </View>
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
    </View>
  )
}
