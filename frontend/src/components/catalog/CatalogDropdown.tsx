import { Autocomplete, TextField } from "@mui/material"
import ThemeProvider from "../misc/ThemeProvider"

type CatalogDropdownProps = {
  onChange: (event: React.SyntheticEvent, value: { id: number, label: string } | null) => void
  value?: { id: number, label: string } | null
}

export default function CatalogDropdown({ onChange, value }: CatalogDropdownProps) {
  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={onChange}
      renderInput={(params) => (
        <TextField {...params} color='primary' placeholder="Actividades" />
      )}
      options={[
        { label: 'Sopa de Letras', id: 1 },
        { label: 'Cuestionarios', id: 2 },
        { label: 'Mapas', id: 3 },
      ]}
      className='border-blue-500 w-48'
      blurOnSelect
      value={value || null}
      defaultValue={null}
    />
  )
}