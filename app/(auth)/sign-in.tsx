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
import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignInPress = async () => {
    await signIn.password({
      emailAddress: email,
      password,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (f) => f.strategy === "email_code",
      );

      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    }
  };
  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn?.status === "needs_client_trust") {
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
          onPress={async () => await signIn.mfa.sendEmailCode()}
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
          Welcome back
        </Text>
        <Text className="text-gray-500 mb-8">Sign in to your account</Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 placeholder:text-[#9CA3AF]"
          placeholder="Enail address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors?.fields.identifier && (
          <Text className="text-red-400 mb-4">
            {errors.fields.identifier.message}
          </Text>
        )}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 placeholder:text-[#9CA3AF]"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors?.fields.password && (
          <Text className="text-red-400 mb-4">
            {errors.fields.password.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onSignInPress}
          className="w-full bg-blue-600 py-4 items-center rounded-xl mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Link href={"/(auth)/sign-up"}>
            <Text className="text-gray-500">Dont have an account ? </Text>
            Sign Up{" "}
          </Link>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
