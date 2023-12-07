import Footer from "@src/components/layout/Footer";
import { TextField } from "@mui/material";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Slider from '@src/components/misc/Slider'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaUserCircle } from 'react-icons/fa'
import { useState } from "react";
import { useAuth } from "@src/context/AuthProvider";
import { login } from "@src/services/user"
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@components/common/Button";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = React.useState(false);
  const [userLogin, setUserLogin] = useState({
    username: "",
    password: ""
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleOnSubmit = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const response = await login(userLogin);
    if (!response) {
      return console.log("error");
    }
    localStorage.setItem("token", response.token);
    setAuth({
      token: response.token,
      user: response.user,
      data: response.data,
      isAuth: true,
    });
    navigate(location.state?.from ? location.state.from : "/");
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserLogin({ ...userLogin, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="h-full w-full flex place-content-center">
        {/* <h1 className="absolute translate-x-1 top-[10%] text-center text-8xl"><span className="text-white mr-10">LUD</span><span className="text-blue-500">GEO</span></h1> */}
        <div className="h-full w-1/2 bg-blue-500 place-items-center hidden md:flex">
          <Slider />
        </div>
        <form
          onSubmit={handleOnSubmit}
          className="w-1/2 sm:w-full h-full m-0 flex flex-col gap-2 p-8 items-center justify-center"
        >
          <FaUserCircle className="text-8xl mb-1 text-blue-500" />
          <TextField
            name="username"
            onChange={handleOnChange}
            className="w-64 border-solid font-mono text-center mb-4 text-xl"
            label="Username"
            autoFocus
            autoComplete="email"
            margin="normal"
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              onChange={handleOnChange}
              name="password"
              className="w-64 border-solid font-mono text-center mb-4 text-xl"
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              autoComplete="current-password"
            />
          </FormControl>
          <input
            value="Ingresar"
            type="submit"
            onClick={handleOnSubmit}
            className="bg-blue-500 hover:bg-blue-900 py-3 text-white normal-case text-base font-bold px-4 w-64 text-center rounded mb-2"
          />
          <Button
            variant="text"
            className="normal-case text-base text-blue-500"
            onClick={() => {
              navigate("/register")
            }}
          >
            Registrate Gratis
          </Button>
        </form>
      </div>
      <Footer />
    </>
  );
}
