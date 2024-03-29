import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import {
  NUM_OF_ATTEMPTS,
  colors,
  CLEAR,
  ENTER,
  colorsToEmoji,
} from "../../constants";
import { WORD_LENGTH, words } from "./Words";
import Keyboard from "../Keyboard";
import * as Clipboard from "expo-clipboard";
import { copyArray } from "./utils";

const Game = () => {
  const word = words[1];
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
    if (isWon() && gameState !== "won") {
      Alert.alert(
        "You have won!",
        "You guessed the word in " + currRow + " attempts.",
        [{ text: "Share", onPress: shareScore }]
      );
      setGameState("won");
    } else if (isLost() && gameState !== "lost") {
      Alert.alert("Oof, try again tomorrow.");
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

  const shareScore = () => {
    const colorMap = rows
      .map((row, i) =>
        row
          .map((cell, j) => colorsToEmoji[getCellBackgroundColor(cell, i, j)])
          .join("")
      )
      .filter((row) => row)
      .join("\n"); //keeps only the rows that have values
    const textToShare = "Wordle \n" + colorMap;
    Clipboard.setStringAsync(textToShare);
    Alert.alert("Copied to clipboard");
  };

  onKeyPressed = (key) => {
    // console.log(key);
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
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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

export default Game;
