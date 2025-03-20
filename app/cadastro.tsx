import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    alert("Cadastro realizado com sucesso!");
    router.push("/"); // Redireciona para o login após o cadastro
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-4">
      {/* Logo e Nome TechFund */}
      <View className="items-center mb-6">
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 180, height: 180, marginBottom: 16 }}
          resizeMode="contain"
        />
      </View>

      {/* Card de Cadastro */}
      <View className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Criar Conta
        </Text>

        {/* Input Usuário */}
        <TextInput
          placeholder="Usuário"
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-black focus:border-blue-500"
          value={username}
          onChangeText={setUsername}
        />

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-black focus:border-blue-500"
          value={email}
          onChangeText={setEmail}
        />

        {/* Input Senha */}
        <TextInput
          placeholder="Senha"
          secureTextEntry
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-black focus:border-blue-500"
          value={password}
          onChangeText={setPassword}
        />

        {/* Input Confirmar Senha */}
        <TextInput
          placeholder="Confirmar Senha"
          secureTextEntry
          className="w-full border border-gray-300 rounded-md px-4 py-3 mb-6 text-black focus:border-blue-500"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Botão de Cadastro */}
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition-all duration-200"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Cadastrar
          </Text>
        </TouchableOpacity>

        {/* Texto "Já tem uma conta?" + Botão "Faça login" */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-600">Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-blue-500 underline font-medium">Faça login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}