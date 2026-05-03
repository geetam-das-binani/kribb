import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <Text className='p-4'>HomeScreen</Text>
    </SafeAreaView>
  )
}