import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
//SafeAreaView -- sets view where user can actually see (skips over the notch forexample on top of iphone)
//ScrollView -- added for if num of attempts goes beyond screen length
import { colors } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

const NUM_OF_ATTEMPTS = 6;

export default function App() {
  const word = "hello";
  const characters = word.split("");

  const rows = new Array(NUM_OF_ATTEMPTS).fill(
    new Array(characters.length).fill("a".toUpperCase())
  ); //creating 6 rows with initial input empty

  onKeyPressed = (key) => {
    console.log(key);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, index) => (
              <View key={index} style={styles.cell}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard onKeyPressed={onKeyPressed} />
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
    alignSelf: "stretch",
    height: 100,
    marginTop: 20,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderColor: colors.darkgrey,
    borderWidth: 2,
    flex: 1, //splits horizontal space evenly between cells
    aspectRatio: 1, //creates square cells
    margin: 5,
    maxWidth: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
  },
});
