import { Stack } from 'expo-router';
import React from 'react';

export default function AudioLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Audio News',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}