import React from "react";
import { View, Text } from "react-native";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

interface GraficoFavoritosProps {
  dados: { estado: string; quantidade: number }[];
}

const GraficoFavoritos: React.FC<GraficoFavoritosProps> = ({ dados }) => {
  if (!dados || dados.length === 0) return null;

  return (
    <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 8, marginBottom: 16 }}>
      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Editais por Estado
      </Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 25 }}
      >
        <VictoryAxis
          tickFormat={(x) => x}
          style={{ tickLabels: { fontSize: 10, angle: -30 } }}
        />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={dados}
          x="estado"
          y="quantidade"
          style={{
            data: { fill: "#3b82f6" },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default GraficoFavoritos;
