import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {}
  };
  return (
    <SafeAreaView>
      
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
