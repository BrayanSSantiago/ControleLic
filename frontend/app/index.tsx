import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: username, senha: password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert("Erro: " + (data.message || "Falha ao fazer login"));
        return;
      }
  
      alert("Login realizado com sucesso!");
  
      // Armazena o token para autenticação
      localStorage.setItem("token", data.token);
  
      // Redireciona para o dashboard
      router.push("/dashboard");
  
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <View className="items-center justify-center flex-1 px-4 bg-gray-100">
      {/* Logo e Nome TechFund */}
      <View className="items-center mb-6">
      <Image
      source={require("../assets/images/logo.png")}
      style={{ width: 200, height: 200, marginBottom: 16 }} // w-24 h-24 em Tailwind equivale a 96px
      resizeMode="contain"
      />
      </View>

      {/* Card de Login */}
      <View className="w-full max-w-lg p-8 bg-white shadow-xl rounded-xl">
        <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
          Controle de Licitações
        </Text>

        {/* Input Usuário */}
        <TextInput
          placeholder="Usuário"
          className="w-full px-4 py-3 mb-4 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={username}
          onChangeText={setUsername}
        />

        {/* Input Senha */}
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="w-full px-4 py-3 mb-6 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={password}
          onChangeText={setPassword}
        />

        {/* Botão de Login */}
        <TouchableOpacity
          className="w-full px-6 py-3 transition-all duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
          onPress={handleLogin}
        >
          <Text className="text-lg font-semibold text-center text-white">
            Entrar
          </Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Não possui uma conta? </Text>
        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text className="font-medium text-blue-500 underline">Crie uma</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}