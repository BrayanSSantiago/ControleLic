import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      router.push("/dashboard");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-4">
      {/* Logo e Nome TechFund */}
      <View className="items-center mb-6">
      <Image
      source={require("../assets/images/logo.png")}
      style={{ width: 200, height: 200, marginBottom: 16 }} // w-24 h-24 em Tailwind equivale a 96px
      resizeMode="contain"
      />
      </View>

      {/* Card de Login */}
      <View className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Controle de Licitações
        </Text>

        {/* Input Usuário */}
        <TextInput
          placeholder="Usuário"
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-black focus:border-blue-500"
          value={username}
          onChangeText={setUsername}
        />

        {/* Input Senha */}
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-6 text-black focus:border-blue-500"
          value={password}
          onChangeText={setPassword}
        />

        {/* Botão de Login */}
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition-all duration-200"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Entrar
          </Text>
        </TouchableOpacity>
        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-600">Não possui uma conta? </Text>
        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text className="text-blue-500 underline font-medium">Crie uma</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}