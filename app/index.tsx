import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
     
      <View className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl ">
        {/* Título */}
        <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
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
      </View>
    </View>
  );
}