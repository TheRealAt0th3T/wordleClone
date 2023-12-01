import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { colors, CLEAR, ENTER } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

const NUM_OF_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export default function App() {
  const word = "hello";
  const characters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUM_OF_ATTEMPTS).fill(new Array(WORD_LENGTH).fill(""))
  );

  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [gameState, setGameState] = useState("playing");

  //CHECKING WIN AND LOSS STATUS
  //check when currRow changes
  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  const checkGameState = () => {
    if (isWon()) {
      Alert.alert("won");
      setGameState("won");
    } else if (isLost()) {
      Alert.alert("lost");
      setGameState("lost");
    }
  };

  const isWon = () => {
    const rowToCheck = rows[currRow - 1];
    return rowToCheck.every((cell, i) => cell === characters[i]);
  };

  const isLost = () => {
    return currRow === NUM_OF_ATTEMPTS;
  };

  onKeyPressed = (key) => {
    if (gameState !== "playing") return;

    const updatedRows = copyArray(rows); //returns each individual col/cell from that row

    if (key === CLEAR) {
      //so cant clear into negative space
      if (currCol == 0) {
        return;
      }
      const prevCol = currCol - 1;
      updatedRows[currRow][prevCol] = "";
      setRows(updatedRows);
      setCurrCol(prevCol);
      return;
    }

    if (key === ENTER) {
      if (currCol != WORD_LENGTH) {
        return;
      }
      setCurrRow(currRow + 1);
      setCurrCol(0);
      return;
    }

    if (currCol < WORD_LENGTH) {
      updatedRows[currRow][currCol] = key;
      setRows(updatedRows);
      setCurrCol(currCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === currRow && col === currCol;
  };

  const getCellBackgroundColor = (cell, row, col) => {
    //If still typing word, wait for ENTER to reveal letter status
    if (row >= currRow) {
      return;
    }
    //GREEN - letter in correct location
    if (cell === characters[col]) {
      return colors.primary;
    }
    //YELLOW - letter in the word but wrong location
    if (characters.includes(cell)) {
      return colors.secondary;
    }
    //DARK GREY - letter not in word
    return colors.darkgrey;
  };

  const getKeyCapColors = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBackgroundColor(cell, i, j) === color)
    );
  };

  const greenCaps = getKeyCapColors(colors.primary);
  const yellowCaps = getKeyCapColors(colors.secondary);
  const greyCaps = getKeyCapColors(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={"row-" + i} style={styles.row}>
            {row.map((cell, j) => (
              <View
                key={"cell-" + i + "-" + j}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.grey
                      : colors.darkgrey,
                    backgroundColor: getCellBackgroundColor(cell, i, j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
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
