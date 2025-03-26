import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Linking,
} from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { Ionicons } from "@expo/vector-icons"

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [licitacoes, setLicitacoes] = useState<any[]>([])
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filtros, setFiltros] = useState({
    objeto: "",
    estado: "",
    tipo: "",
    dataInicio:"",
    dataFim:"",

  })

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    objeto: "",
    estado: "",
    tipo: "",
    dataInicio:"",
    dataFim:"",
    
  })




  const estados = [
    { label: "Todos", value: "" },
    { label: "SP", value: "SP" },
    { label: "RJ", value: "RJ" },
    { label: "MG", value: "MG" },
  ]

  const tipos = [
    { label: "Todos", value: "" },
    { label: "Aviso de Contratação Direta", value: "Aviso de Contratação Direta" },
    { label: "Edital", value: "Edital" },
    
  ]

  const fetchLicitacoes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
      ...filtrosAtivos,
      page: page.toString(),
      limit: "10", // ou qualquer outro número de itens por página
    })
      const response = await fetch(`http://localhost:3000/licitacoes?${params}`)
      const data = await response.json()
      setLicitacoes(data.data || [])
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Erro ao buscar licitações:", error)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    console.log("Aplicando filtros:", filtros)
    setPage(1) // <- voltar para a primeira página ao aplicar filtros
    setFiltrosAtivos({ ...filtros }) // agora sim salvando os filtros realmente usados
    setModalVisible(false)
  }

  useEffect(() => {
    fetchLicitacoes()
  }, [page, filtrosAtivos])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      {/* Navbar */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-blue-600">TechFund</Text>

        <View className="flex-row justify-center flex-1 ml-4 space-x-4">
          <Text className="text-base font-semibold text-gray-700">Licitações</Text>
          <Text className="text-base text-gray-500">Favoritas</Text>
          <Text className="text-base text-gray-500">Relatório</Text>
        </View>
      </View>

      <View className="h-px mb-4 bg-gray-300 shadow" />

      {/* Linha de botão + filtros ativos */}
      <View className="flex-row flex-wrap items-center gap-2 mb-4">
        {/* Botão de Filtros */}
        <TouchableOpacity className="px-4 py-2 bg-blue-500 rounded" onPress={() => setModalVisible(true)}>
            <Text className="font-semibold text-white">Filtros</Text>
        </TouchableOpacity>

        {/* Filtros ativos */}
        {Object.entries(filtrosAtivos).map(([chave, valor]) => {
            if (!valor) return null

            const label = {
                objeto: "Objeto",
                estado: "Estado",
                tipo: "Tipo",
                dataInicio:"dataInicio",
                dataFim:"dataFim",
            }[chave]

            return (
                <View key={chave} className="flex-row items-center px-3 py-1 bg-gray-200 rounded-full">
                    <Text className="mr-2 text-sm text-gray-700">
                        {label}: {valor}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                        const novos = { ...filtrosAtivos, [chave]: "" }
                        setFiltros(novos)
                        setFiltrosAtivos(novos)
                        setPage(1)
                        fetchLicitacoes()
                     }}
                    >
                     <Text className="font-bold text-red-500">✕</Text>
                    </TouchableOpacity>
                </View>
            )
        })}

        {/* Limpar todos */}
        {Object.values(filtrosAtivos).some(v => v) && (
        <TouchableOpacity
            className="px-3 py-1 bg-red-500 rounded"
            onPress={() => {
            const vazio = { objeto: "", estado: "", tipo: "", dataInicio:"",dataFim:"", }
            setFiltros(vazio)
            setFiltrosAtivos(vazio)
            setPage(1)
            fetchLicitacoes()
            }}
        >
            <Text className="text-sm font-semibold text-white">Limpar todos</Text>
        </TouchableOpacity>
        )}
        </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black bg-opacity-40">
          <View className="w-full p-6 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-bold text-gray-800">Filtros</Text>

            {/* Objeto */}
            <Text className="mb-1 text-sm font-medium text-gray-700 ">Objeto</Text>
            <TextInput
              placeholder="Digite um objeto"
              value={filtros.objeto}
              onChangeText={(text) => setFiltros({ ...filtros, objeto: text })}
              className="w-full px-4 py-2 mb-4 text-sm border border-gray-300 rounded "
            />

            {/* Estado */}
            <Text className="mb-1 text-sm font-medium text-gray-700">Estado</Text>
            <Dropdown
              data={estados}
              labelField="label"
              valueField="value"
              placeholder="Selecione"
              value={filtros.estado}
              onChange={(item) => setFiltros({ ...filtros, estado: item.value })}
              style={{
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 10,
                marginBottom: 16,
                width: 200,
              }}
              placeholderStyle={{ fontSize: 14, color: '#999' }}
              selectedTextStyle={{ fontSize: 14, color: '#000' }}
              containerStyle={{
                elevation: 4, // sombra no Android
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              dropdownPosition="auto" // ou 'top' / 'bottom'
              showsVerticalScrollIndicator={false}
            />

            {/* Tipo */}
            <Text className="mb-1 text-sm font-medium text-gray-700">Tipo</Text>
            <Dropdown
              data={tipos}
              labelField="label"
              valueField="value"
              placeholder="Selecione"
              value={filtros.tipo}
              onChange={(item) => setFiltros({ ...filtros, tipo: item.value })}
              style={{
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 10,
                marginBottom: 16,
                width: 200,
              }}
              placeholderStyle={{ fontSize: 14, color: '#999' }}
              selectedTextStyle={{ fontSize: 14, color: '#000' }}
              containerStyle={{
                elevation: 4, // sombra no Android
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              dropdownPosition="auto" // ou 'top' / 'bottom'
              showsVerticalScrollIndicator={false}
            />
            {/* DATAS */}
            <Text className="mb-1 text-sm font-medium text-gray-700">Data de Início</Text>
            <TextInput
            placeholder="YYYY-MM-DD"
            value={filtros.dataInicio}
            onChangeText={(text) => setFiltros({ ...filtros, dataInicio: text })}
            className="w-full px-4 py-2 mb-4 text-sm border border-gray-300 rounded"
            />

            {/* Data Fim */}
            <Text className="mb-1 text-sm font-medium text-gray-700">Data de Fim</Text>
            <TextInput
            placeholder="YYYY-MM-DD"
            value={filtros.dataFim}
            onChangeText={(text) => setFiltros({ ...filtros, dataFim: text })}
            className="w-full px-4 py-2 mb-4 text-sm border border-gray-300 rounded"
            />
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-800">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={aplicarFiltros}
              >
                <Text className="text-white">Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Lista de Licitações */}
      <ScrollView className="mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : licitacoes.length === 0 ? (
          <Text className="text-center text-gray-500">Nenhuma licitação encontrada</Text>
        ) : (
          licitacoes.map((edital: any) => (
            <View
              key={edital.id}
              className="relative p-4 mb-4 bg-white rounded-lg shadow "
            >
              <View className="flex-row justify-between ">
                <View>
                  <Text className="font-semibold text-gray-700">
                    {edital.numero}
                  </Text>
                  <Text className="text-sm text-gray-500 ">
                    Objeto: {edital.objeto}
                  </Text>
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
                <View className="mt-4 space-y-1 text-gray-600 ">
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

