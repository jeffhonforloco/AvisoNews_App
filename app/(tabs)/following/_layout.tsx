import { Stack } from 'expo-router';
import React from 'react';

export default function FollowingLayout() {
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
          title: 'Following',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}