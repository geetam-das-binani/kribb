import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { Property } from "@/types";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [featured, setFeatured] = useState<Array<Property>>([]);
  const [recommended, setRecommended] = useState<Array<Property>>([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data: featuredProperties } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedProperties } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeatured(featuredProperties ?? []);
      setRecommended(recommendedProperties ?? []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onFocus = useCallback(() => {
    fetchProperties();
  }, []);

  useFocusEffect(onFocus);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* <Header  */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 90, height: 96 }}
                resizeMode="contain"
              />
              <View className="items-end">
                <Text>Good Morning 👋</Text>
                <Text className="text-base text-gray-900 font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>
            {/* Searh Bar  */}
            <TouchableOpacity
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3
             gap-3"
              onPress={() => router.push("/(root)/(tabs)/search")}
            >
              <Ionicons name="search-outline" size={24} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search properties,cities...
              </Text>
            </TouchableOpacity>
            {/* Featured  */}
            {/* Recommeder Header  */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }
        ListEmptyComponent={
          recommended?.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No Recommended Properties</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
