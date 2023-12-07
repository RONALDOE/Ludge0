import { Button as MUIButton } from "@mui/material";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
};

export default function Button({
  className,
  children,
  onClick,
  variant,
  disabled = false,
}: ButtonProps) {
  return (
    <MUIButton
      variant={variant}
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </MUIButton>
  );
}
