import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
  
    try {
      const response = await fetch("https://techfund.net.br/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario:username, email:email, senha:password, repetirSenha:confirmPassword }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert("Erro: " + data.message);
        return;
      }
  
      alert("Cadastro realizado com sucesso!");
      router.push("/"); // Redireciona para login após cadastro
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <View className="items-center justify-center flex-1 px-4 bg-gray-100">
      {/* Logo e Nome TechFund */}
      <View className="items-center mb-6">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 180, height: 180, marginBottom: 16 }}
          resizeMode="contain"
        />
      </View>

      {/* Card de Cadastro */}
      <View className="w-full max-w-lg p-8 bg-white shadow-xl rounded-xl">
        <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
          Criar Conta
        </Text>

        {/* Input Usuário */}
        <TextInput
          placeholder="Usuário"
          className="w-full px-4 py-3 mb-4 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={username}
          onChangeText={setUsername}
        />

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={email}
          onChangeText={setEmail}
        />

        {/* Input Senha */}
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="w-full px-4 py-3 mb-4 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={password}
          onChangeText={setPassword}
        />

        {/* Input Confirmar Senha */}
        <TextInput
          placeholder="Confirmar Senha"
          secureTextEntry
          className="w-full px-4 py-3 mb-6 text-black border border-gray-300 rounded-md focus:border-blue-500"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Botão de Cadastro */}
        <TouchableOpacity
          className="w-full px-6 py-3 transition-all duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
          onPress={() => handleRegister()} // Certifique-se de que está chamando corretamente
        >
          <Text className="text-lg font-semibold text-center text-white">
            Cadastrar
          </Text>
        </TouchableOpacity>

        {/* Texto "Já tem uma conta?" + Botão "Faça login" */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text className="font-medium text-blue-500 underline">Faça login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
