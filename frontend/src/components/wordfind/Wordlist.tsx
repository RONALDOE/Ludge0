import propTypes from "prop-types";
import { useState, useMemo } from "react";
import { Typography } from "@mui/material";
import { IActivity, WorlistWords } from "@src/interfaces/activity.i";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type WordListProps = {
  words: WorlistWords[];
  setWords: (words: WorlistWords[]) => void;
  size: {
    width: number;
    height: number;
  };
  ended: boolean;
};
type ISelected = {
  row: number;
  col: number;
  letter: string;
  wasFound: boolean;
};
const Wordlist = ({ words, setWords, size, ended = false }: WordListProps) => {
  const fillGrid = useMemo(() => {
    const retry = 50;
    const newWords = words.map((word) => {
      return {
        ...word,
        done: false,
        try: 0,
      };
    });
    const newGrid = Array.from({ length: size.height }).map(() =>
      Array.from({ length: size.width }).map(() => {
        return {
          letter: letters[Math.floor(Math.random() * letters.length)],
          isSelected: false,
          isWord: false,
          wasFound: false,
        };
      })
    );

    // eslint-disable-next-line no-constant-condition
    while (true) {
      newWords.forEach((word) => {
        if (word.done) return;
        if (word.try >= retry) {
          return;
        }
        // if all words are done, and other words are not done, but have 5 tries, then break
        word.try++;
        // check if word has spaces
        if (word.answer.includes(" ")) {
          word.answer = word.answer.split(" ").join("");
        }

        const wordLength = word.answer.length;
        const wordDirection = Math.random() > 0.5 ? "horizontal" : "vertical";
        const wordStart = {
          row: Math.floor(Math.random() * size.height),
          col: Math.floor(Math.random() * size.width),
        };
        // if word is out of grid, then try again
        // if word is overlapping with other words, then try again, to do this we need to check if word[][].isWord is true
        if (wordDirection === "horizontal") {
          if (wordStart.col + wordLength > size.width) return;
          for (let i = 0; i < wordLength; i++) {
            if (newGrid[wordStart.row][wordStart.col + i].isWord) {
              return;
            }
          }
        }
        if (wordDirection === "vertical") {
          if (wordStart.row + wordLength > size.height) return;
          for (let i = 0; i < wordLength; i++) {
            if (newGrid[wordStart.row + i][wordStart.col].isWord) {
              return;
            }
          }
        }
        for (let i = 0; i < wordLength; i++) {
          const row =
            wordDirection === "horizontal" ? wordStart.row : wordStart.row + i;
          const col =
            wordDirection === "horizontal" ? wordStart.col + i : wordStart.col;
          newGrid[row][col].letter = word.answer[i];
          newGrid[row][col].isWord = true;
        }
        word.done = true;
      });
      if (
        newWords.every((word) => word.done) ||
        newWords.some((word) => !word.done && word.try >= retry)
      ) {
        break;
      }
    }

    return newGrid;
  }, [size, words]);
  const [grid, setGrid] = useState(fillGrid);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, SetSelected] = useState<ISelected[]>([
    {
      row: 0,
      col: 0,
      letter: "",
      wasFound: false,
    },
  ]);
  const setSelected = (newSelected: ISelected[]) => {
    if (ended) return;
    SetSelected(newSelected);
    // check if newSelected[].wasFound is true, if true, then return
    if (newSelected.some((s) => s.wasFound)) return;
    const selectedWord = newSelected.map((s) => s.letter).join("");
    const foundWord = words.find(
      (w) => w.answer.toLowerCase() === selectedWord.toLowerCase()
    );
    if (!foundWord) return;
    const newWords = words;
    const index = newWords.findIndex(
      (w) =>
        !w.isGuessed && w.answer.toLowerCase() === selectedWord.toLowerCase()
    );
    if (index === -1) return;
    newWords[index].isGuessed = true;
    setWords(newWords);
    setGrid(() => {
      const newGrid = [...grid];
      newSelected.forEach((s) => {
        newGrid[s.row][s.col].wasFound = true;
      });
      return newGrid;
    });
  };

  return (
    <div className="w-auto">
      <div className="flex flex-col w-auto items-center flex-wrap align-middle text-md select-none">
        {grid.map((row, i) => (
          <div
            className="flex w-auto items-center h-auto justify-around border-1 border-solid border-black flex-row flex-wrap  content-center  m-0 p-0 list-none"
            key={i}
          >
            {row.map((col, j) => (
              <div
                className={`h-12 w-12 items-center  align-middle flex-1 border-1 border-black border-solid m-0 p-0 list-none text-center ${
                  col.isSelected ? " bg-black text-white" : ""
                } ${
                  col.wasFound || (col.isWord && ended)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                key={j}
                onMouseDown={(e) => {
                  setIsSelecting(true);
                  setGrid(() => {
                    const newGrid = [...grid];
                    selected.forEach(
                      (s) => (newGrid[s.row][s.col].isSelected = false)
                    );
                    return newGrid;
                  });
                  setSelected([
                    {
                      row: i,
                      col: j,
                      letter: (e.target as any).innerHTML,
                      wasFound: grid[i][j].wasFound,
                    },
                  ]);
                  setGrid(() => {
                    const newGrid = [...grid];
                    newGrid[i][j].isSelected = true;
                    return newGrid;
                  });
                }}
                onMouseUp={() => setIsSelecting(false)}
                onMouseEnter={(e) => {
                  if (!isSelecting) return;
                  setSelected([
                    ...selected,
                    {
                      row: i,
                      col: j,
                      letter: (e.target as any).innerHTML,
                      wasFound: grid[i][j].wasFound,
                    },
                  ]);
                  setGrid(() => {
                    const newGrid = [...grid];
                    newGrid[i][j].isSelected = true;
                    return newGrid;
                  });
                }}
              >
                {col.letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Typography>
        {ended
          ? "Game Ended"
          : selected.length > 1
          ? selected.map((s) => s.letter).join("")
          : "Select a word from the list to find it in the grid"}
      </Typography>
    </div>
  );
};
export default Wordlist;
