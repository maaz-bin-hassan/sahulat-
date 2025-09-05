import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import ChatScreen from "./chatscreen";

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    Font.loadAsync({
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return <ChatScreen />;
};

export default App;
