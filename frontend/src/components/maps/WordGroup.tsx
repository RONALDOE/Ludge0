import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { WorlistWords } from "@src/interfaces/activity.i";

type WordGroupProps = {
  words: WorlistWords[];
};

const WordGroup = (props: WordGroupProps) => {
  return (
    <div className="flex flex-col grid grid-cols-2 h-full  w-40 bg-white shadow-lg rounded-lg p-2 border border-blue-400">
      <div className="p-10">
        <ul>
          {props.words.map((word, i) => (
            <React.Fragment key={i}>
              <li>
                <FormControlLabel
                  sx={{ alignItems: "flex-start" }}
                  control={
                    <Checkbox sx={{ marginTop: -1 }} checked={word.isGuessed} disabled={word.isGuessed} />
                  }
                  label={word.question}
                />
              </li>
              {word.isGuessed ? <li> Respuesta: {word.answer}</li> : null}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordGroup;
