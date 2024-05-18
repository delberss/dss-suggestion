import { Stack, useLocalSearchParams } from "expo-router";

export default function Layout(){
    return(
        <Stack
        screenOptions={
            {
                headerStyle: {
                    backgroundColor: "#121212",
                },
                headerTintColor: "#FFF",
                headerTitleAlign: "center", // Adicione esta linha
            }
        }
        >
            <Stack.Screen name="index" options={{title: "HOME"}}  />
            <Stack.Screen name="typePlace" options={{}} />
            <Stack.Screen name="aboutStore" options={{title: "LOJA"}} />

        </Stack>
    )
}