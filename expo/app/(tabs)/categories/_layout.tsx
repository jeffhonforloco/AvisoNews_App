import { Stack } from "expo-router";

export default function CategoriesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Categories",
          headerLargeTitle: true,
          headerTransparent: false,
          headerBlurEffect: "regular",
        }} 
      />
    </Stack>
  );
}