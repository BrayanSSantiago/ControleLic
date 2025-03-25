import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from "react-native"
import { useState } from "react"
import { Dropdown } from "react-native-element-dropdown"

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false)

  const [filtros, setFiltros] = useState({
    objeto: "",
    estado: "",
    tipo: "",
  })

  const estados = [
    { label: "Todos", value: "" },
    { label: "SP", value: "SP" },
    { label: "RJ", value: "RJ" },
    { label: "MG", value: "MG" },
  ]

  const tipos = [
    { label: "Todos", value: "" },
    { label: "Compra", value: "Compra" },
    { label: "Serviço", value: "Serviço" },
  ]

  const aplicarFiltros = () => {
    console.log("Filtros aplicados:", filtros)
    setModalVisible(false)
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

      <View className="h-px mb-6 bg-gray-300 shadow" />

      {/* Botão de Filtros */}
      <TouchableOpacity
        className="w-20 px-4 py-2 mb-2 bg-blue-500 rounded"
        onPress={() => setModalVisible(true)}
      >
        <Text className="font-semibold text-white">Filtros</Text>
      </TouchableOpacity>

      <View className="h-px mb-4 bg-gray-300 shadow" />

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
            <Text className="mb-1 text-sm font-medium text-gray-700">Objeto</Text>
            <TextInput
              placeholder="Digite um objeto"
              value={filtros.objeto}
              onChangeText={(text) => setFiltros({ ...filtros, objeto: text })}
              className="w-full px-4 py-2 mb-4 text-sm border border-gray-300 rounded"
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
        <View className="p-4 mb-4 bg-white rounded-lg shadow">
          <Text className="font-semibold text-gray-700">Licitacao #12345</Text>
          <Text className="text-sm text-gray-500">Objeto: Fornecimento de equipamentos...</Text>
        </View>
      </ScrollView>
    </View>
  )
}
