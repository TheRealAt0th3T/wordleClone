import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native"; //SafeAreaView -- sets view where user can actually see (skips over the notch forexample on top of iphone)
import { colors } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <View style={styles.map}>
        <View style={styles.row}>
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
          <View style={styles.cell} />
        </View>
      </View>
      <Keyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 5,
  },
  map: {
    borderColor: "red",
    borderWidth: 3,
    alignSelf: "stretch",
    height: 100,
  },
  row: {
    alignSelf: "stretch",
    height: 50,
    flexDirection: "row",
  },
  cell: {
    borderColor: colors.grey,
    borderWidth: 2,
    flex: 1, //splits horizontal space evenly between cells
    aspectRatio: 1, //creates square cells
    margin: 5,
  },
});
