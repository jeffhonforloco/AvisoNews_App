import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsLayout() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Settings",
          headerLargeTitle: true,
          headerTransparent: false,
          headerBlurEffect: "regular",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(home)')}
              style={{ padding: 8 }}
            >
              <ChevronLeft size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}