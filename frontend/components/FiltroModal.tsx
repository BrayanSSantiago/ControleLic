import React from "react"
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { estados } from "../utils/estados"

interface Props {
  visible: boolean
  onClose: () => void
  filtros: any
  setFiltros: React.Dispatch<React.SetStateAction<any>>
  aplicarFiltros: () => void
  filtrosDinamicos: Record<string, string[]>
}

export default function FiltroModal({ visible, onClose, filtros, setFiltros, aplicarFiltros, filtrosDinamicos }: Props) {
  const tipos = [
    { label: "Todos", value: "" },
    { label: "Aviso de Contratação Direta", value: "Aviso de Contratação Direta" },
    { label: "Edital", value: "Edital" },
  ]

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 px-6 bg-black bg-opacity-40">
      <ScrollView className="w-full p-6 bg-white rounded-lg">
        <Text className="mb-4 text-lg font-bold text-gray-800">Filtros</Text>

        {/* Objeto ocupa toda largura */}
        <Text className="mb-1 text-sm font-medium text-gray-700 ">Objeto</Text>
        <TextInput
            placeholder="Digite um objeto"
            value={filtros.objeto}
            onChangeText={(text) => setFiltros({ ...filtros, objeto: text })}
            className="w-full px-4 py-2 mb-4 text-sm border border-gray-300 rounded"
        />

        <View className="flex flex-col flex-wrap justify-between w-full gap-y-4">
        {/* Estado */}
        <View className="flex-1 min-w-[30%] max-w-[33%] px-1">
            <Text className="mb-1 text-sm font-medium text-gray-700">Estado</Text>
            <Dropdown
            data={estados}
            labelField="label"
            valueField="value"
            value={filtros.estado}
            onChange={(item) => setFiltros({ ...filtros, estado: item.value })}
            style={dropdownStyle}
            placeholder="Selecione"
            />
        </View>

        {/* Tipo */}
        <View className="flex-1 min-w-[30%] max-w-[33%] px-1">
            <Text className="mb-1 text-sm font-medium text-gray-700">Tipo</Text>
            <Dropdown
            data={tipos}
            labelField="label"
            valueField="value"
            value={filtros.tipo}
            onChange={(item) => setFiltros({ ...filtros, tipo: item.value })}
            style={dropdownStyle}
            placeholder="Selecione"
            />
        </View>

        {/* Campos Dinâmicos */}
        {Object.entries(filtrosDinamicos).map(([campo, valores]) => (
            <View key={campo} className="flex-1 min-w-[30%] max-w-[33%] px-1">
            <Text className="mb-1 text-sm font-medium text-gray-700 capitalize">{campo.replace(/_/g, " ")}</Text>
            <Dropdown
                data={[{ label: "Todos", value: "" }, ...valores.map((v) => ({ label: v, value: v }))]}
                labelField="label"
                valueField="value"
                value={filtros[campo]}
                onChange={(item) => setFiltros({ ...filtros, [campo]: item.value })}
                style={dropdownStyle}
                placeholder="Selecione"
            />
            </View>
        ))}
        </View>

        {/* Botões */}
         <View className="flex-row justify-end mt-4 space-x-4">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-gray-300 rounded">
            <Text className="text-gray-800">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={aplicarFiltros} className="px-4 py-2 bg-blue-500 rounded">
            <Text className="text-white">Aplicar</Text>
            </TouchableOpacity>
         </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const dropdownStyle = {
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 6,
  paddingHorizontal: 10,
  marginBottom: 16,
}
