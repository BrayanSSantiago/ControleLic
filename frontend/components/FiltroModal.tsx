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
    <Modal visible={visible} transparent  onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 px-4 bg-black bg-opacity-40">
        <View className="bg-white w-full  max-h-[90%] rounded-lg p-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-4 text-lg font-bold text-gray-800">Filtros</Text>

            {/* Objeto */}
            <View className="p-4 mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700 ">Objeto</Text>
              <TextInput
                placeholder="Digite um objeto"
                value={filtros.objeto}
                onChangeText={(text) => setFiltros({ ...filtros, objeto: text })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded"
              />
            </View>

            {/* Filtros divididos em 3 colunas */}
            <View className="flex-row flex-wrap gap-4 ">
              {/* Coluna 1 */}
              <View className="w-[30%] p-4">
                <Filtro label="Estado" valor={filtros.estado} onChange={v => setFiltros({ ...filtros, estado: v })} dados={estados} />
                <Filtro label="Tipo" valor={filtros.tipo} onChange={v => setFiltros({ ...filtros, tipo: v })} dados={tipos} />
                <Filtro label="Órgão" valor={filtros.orgao} onChange={v => setFiltros({ ...filtros, orgao: v })} dados={filtrosDinamicos.orgao} />
              </View>

              {/* Coluna 2 */}
              <View className="w-[30%] p-4">
                <Filtro label="Modalidade de Contratação" valor={filtros.modalidade_contratacao} onChange={v => setFiltros({ ...filtros, modalidade_contratacao: v })} dados={filtrosDinamicos.modalidade_contratacao} />
                <Filtro label="Unidade Compradora" valor={filtros.unidade_compradora} onChange={v => setFiltros({ ...filtros, unidade_compradora: v })} dados={filtrosDinamicos.unidade_compradora} />
                <Filtro label="Amparo Legal" valor={filtros.amparo_legal} onChange={v => setFiltros({ ...filtros, amparo_legal: v })} dados={filtrosDinamicos.amparo_legal} />
              </View>

              {/* Coluna 3 */}
              <View className="w-[30%] p-4">
                <Filtro label="Modo de Disputa" valor={filtros.modo_disputa} onChange={v => setFiltros({ ...filtros, modo_disputa: v })} dados={filtrosDinamicos.modo_disputa} />
                <Filtro label="Situação" valor={filtros.situacao} onChange={v => setFiltros({ ...filtros, situacao: v })} dados={filtrosDinamicos.situacao} />
                <Filtro label="Fonte" valor={filtros.fonte} onChange={v => setFiltros({ ...filtros, fonte: v })} dados={filtrosDinamicos.fonte} />
              </View>
            </View>

            {/* Botões */}
            <View className="flex-row justify-end p-4 mt-6 space-x-4">
              <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-gray-300 rounded">
                <Text className="text-gray-800">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={aplicarFiltros} className="px-4 py-2 bg-blue-500 rounded">
                <Text className="text-white">Aplicar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

interface FiltroProps {
  label: string
  valor: string
  onChange: (value: string) => void
  dados: { label: string, value: string }[] | string[]
}

function Filtro({ label, valor, onChange, dados }: FiltroProps) {
  const data =
    typeof dados[0] === "string"
      ? [{ label: "Todos", value: "" }, ...dados.map((v) => ({ label: v, value: v }))]
      : [{ label: "Todos", value: "" }, ...(dados as { label: string; value: string }[])]

  return (
    <View className="px-1 mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={valor}
        onChange={(item) => onChange(item.value)}
        style={dropdownStyle}
        placeholder="Selecione"
      />
    </View>
  )
}

const dropdownStyle = {
  height: 50,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 16,
}
