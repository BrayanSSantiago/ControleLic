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
      <ScrollView>
      <View className="items-center justify-center flex-1 px-4 bg-black bg-opacity-40">
        <View className="bg-white w-full  max-h-[90%] rounded-lg p-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-4 text-lg font-bold text-gray-800">Filtros</Text>

            {/* Objeto */}
            <View className="p-2 mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700 ">Objeto</Text>
              <TextInput
                placeholder="Digite um objeto"
                value={filtros.objeto}
                onChangeText={(text) => setFiltros({ ...filtros, objeto: text })}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded"
              />
            </View>

            <View className="flex-row flex-wrap justify-between gap-4">
            {[...Array(3)].map((_, colIndex) => (
              <View key={colIndex} className="w-full sm:w-[30%] p-2">
                {[
                  ["Estado", filtros.estado, (v: string) => setFiltros({ ...filtros, estado: v }), estados],
                  ["Tipo", filtros.tipo, (v: string) => setFiltros({ ...filtros, tipo: v }), tipos],
                  ["Órgão", filtros.orgao, (v: string) => setFiltros({ ...filtros, orgao: v }), filtrosDinamicos.orgao],
                  ["Modalidade de Contratação", filtros.modalidade_contratacao, (v: string) => setFiltros({ ...filtros, modalidade_contratacao: v }), filtrosDinamicos.modalidade_contratacao],
                  ["Unidade Compradora", filtros.unidade_compradora, (v: string) => setFiltros({ ...filtros, unidade_compradora: v }), filtrosDinamicos.unidade_compradora],
                  ["Amparo Legal", filtros.amparo_legal, (v: string) => setFiltros({ ...filtros, amparo_legal: v }), filtrosDinamicos.amparo_legal],
                  ["Modo de Disputa", filtros.modo_disputa, (v: string) => setFiltros({ ...filtros, modo_disputa: v }), filtrosDinamicos.modo_disputa],
                  ["Situação", filtros.situacao, (v: string) => setFiltros({ ...filtros, situacao: v }), filtrosDinamicos.situacao],
                  ["Fonte", filtros.fonte, (v: string) => setFiltros({ ...filtros, fonte: v }), filtrosDinamicos.fonte],
                ]
                  .filter((_, i) => i % 3 === colIndex) // Distribui uniformemente nas 3 colunas
                  .map(([label, value, onChange, dados]: any, idx) => (
                    <Filtro
                      key={`${colIndex}-${idx}`}
                      label={label}
                      valor={value}
                      onChange={onChange}
                      dados={dados}
                    />
                  ))}
              </View>
            ))}
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
      </ScrollView>
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
