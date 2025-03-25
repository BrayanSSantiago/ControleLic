import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useState } from "react"
import { Modal } from "react-native"

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View className="flex-1 px-4 pt-12 bg-gray-100">
      {/* Navbar */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Logo */}
        <Text className="text-xl font-bold text-blue-600">TechFund</Text>

        {/* Menu de navegação */}
        <View className="flex-row justify-center flex-1 ml-4 space-x-4">
          <Text className="text-base font-semibold text-gray-700">Licitações</Text>
          <Text className="text-base text-gray-500">Favoritas</Text>
          <Text className="text-base text-gray-500">Relatório</Text>
        </View>

        {/* Botão de filtro */}
        
      </View>
      <View className="h-px mb-6 bg-gray-300 shadow" />
      <view>
      <TouchableOpacity
        className="w-20 px-4 py-2 bg-blue-500 rounded-lg active:bg-blue-600"
        onPress={() => setModalVisible(true)}>
        <Text className="text-base font-semibold text-white">Filtros</Text>
      </TouchableOpacity>
      </view>
      <View className="h-px mt-6 bg-gray-300 shadow" />

      
      
      {/* Modal de filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black bg-opacity-40">
          <View className="w-full p-6 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-bold">Filtros</Text>
            {/* Inputs de filtro podem ir aqui */}

            <TouchableOpacity
              className="py-2 mt-4 bg-blue-500 rounded"
              onPress={() => setModalVisible(false)}
            >
              <Text className="font-medium text-center text-white">Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lista de Licitações */}
      <ScrollView className="mt-4">
        {/* Aqui você pode mapear suas licitações com base nos dados do backend */}
        <View className="p-4 mb-4 bg-white rounded-lg shadow">
          <Text className="font-semibold text-gray-700">Licitacao #12345</Text>
          <Text className="text-sm text-gray-500">Objeto: Fornecimento de equipamentos...</Text>
        </View>

        {/* ... outras licitações ... */}
      </ScrollView>
    </View>
  )
}