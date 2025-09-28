import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#1e40af",
      background: "#f8fafc",
      card: "#ffffff",
      text: "#1f2937",
      border: "#e5e7eb",
      notification: "#ef4444",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#3b82f6",
      background: "#111827",
      card: "#1f2937",
      text: "#f9fafb",
      border: "#374151",
      notification: "#f87171",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <CustomThemeProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                {/* Main app with tabs */}
                <Stack.Screen name="(tabs)" />
                
                {/* Auth screens */}
                <Stack.Screen 
                  name="auth"
                  options={{
                    presentation: "modal",
                  }}
                />

                {/* Modal screens */}
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    sheetAllowedDetents: [0.5, 0.8, 1.0],
                    sheetCornerRadius: 20,
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: "transparentModal",
                    headerShown: false,
                  }}
                />
              </Stack>
              <SystemBars style="auto" />
            </GestureHandlerRootView>
          </ThemeProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </>
  );
}
