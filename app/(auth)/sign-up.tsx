import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" && isSignedIn) return null;

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (!error) await signUp.verifications.sendEmailCode();
  };
  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1  justify-center px-6 py-12">
        <Image
          className="w-32 h-16 mb-8"
          resizeMode="contain"
          source={require("@/assets/images/logo.png")}
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your account
        </Text>
        <Text className="text-gray-500 mb-8">we sent a code to {email}</Text>

        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 placeholder:text-[#9CA3AF] mb-4"
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />
        {errors.fields.code && (
          <Text className="text-red-400 mb-4">
            {errors.fields.code.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onVerifyPress}
          className="w-full bg-blue-600 py-4 items-center rounded-xl mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Verify</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => await signUp.verifications.sendEmailCode()}
          className="w-full mb-4"
          disabled={isLoading}
        >
          <Text className="text-blue-600 font-bold text-base">
            I need a new code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView
      className="bg-white"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1  justify-center px-6 py-12">
        <Image
          className="w-32 h-16 mb-8"
          resizeMode="contain"
          source={require("@/assets/images/logo.png")}
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 mb-8">Find your dream home today</Text>
        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 placeholder:text-[#9CA3AF]"
            placeholder="First Name"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 placeholder:text-[#9CA3AF]"
            placeholder="Last Name"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 placeholder:text-[#9CA3AF]"
          placeholder="Enail address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-400 mb-4">
            {errors.fields.emailAddress.message}
          </Text>
        )}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 placeholder:text-[#9CA3AF]"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-400 mb-4">
            {errors.fields.password.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onSignUpPress}
          className="w-full bg-blue-600 py-4 items-center rounded-xl mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign Up</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Link href={"/(auth)/sign-in"}>
            <Text className="text-gray-500">Already have an account ? </Text>
            Sign In{" "}
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
