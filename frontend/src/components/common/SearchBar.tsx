import { InputAdornment, TextField } from "@mui/material";
import { RxMagnifyingGlass } from "react-icons/rx";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};


export default function SearchBar(props: SearchBarProps) {
  return (
    <TextField
      className={props.className}
      placeholder={props.placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <RxMagnifyingGlass className="text-2xl" />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      onChange={props.onChange}
    />
  )
}