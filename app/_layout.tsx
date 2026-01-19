import { Stack } from 'expo-router';
import { ProjectProvider } from './GlobalContext'; // Import ไฟล์ที่เพิ่งสร้าง

export default function RootLayout() {
  return (
    // ครอบด้วย Provider
    <ProjectProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ProjectProvider>
  );
}