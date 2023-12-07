import Footer from "@src/components/layout/Footer";
import { TextField, IconButton, Button, OutlinedInput, InputLabel, InputAdornment, FormControl, MenuItem, Select, Box, Typography } from "@mui/material";
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Slider from '@src/components/misc/Slider'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@src/context/AuthProvider";
import { login } from "@src/services/user"
import { useNavigate, useLocation } from "react-router-dom";
import { IStudent } from "@src/interfaces/student.i";
import { IUser } from "@src/interfaces/user.i";
import api from "@src/config/axios";
import Dayjs from "dayjs";

const Register = () => {

    const navigate = useNavigate();

    const [student, setStudent] = useState<IStudent>({
        name: "",
        lastname: "",
        user: {
            status: "active",
            login: {
                username: "",
                email: "",
                password: "",
                provider: "local"
            },
            role: "student",
        },
        enrollment: "",
        classroom: {
            name: "4A",
            number: 1,
        },
        birthday: new Date(),
    });


    const [user, _setUser] = useState<IUser>({
        status: "active",
        login: {
            username: "",
            email: "",
            password: "",
            provider: "local"
        },
        role: "student",
    })

    const setUser = (user: IUser) => {
        _setUser(user)
        setStudent({ ...student, user: user })
        console.log(user)
        console.log(student)
    }

    const handleSend = async () => {
        const object = student as any
        console.log(object)

        const response = await api.post("/students", {
            student: object
        })
    }

    const { auth, setAuth } = useContext(AuthContext)
    const location = useLocation()
    const [showPassword, setShowPassword] = React.useState(false);
    const [userLogin, setUserLogin] = useState({
        username: "",
        password: ""
    })

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const response = await login(userLogin);
        if (!response) {
            return console.log('error')
        }
        localStorage.setItem('token', response.token)
        setAuth({
            token: response.token,
            user: response.user,
            data: response.data,
            isAuth: true
        })
        navigate(location.state?.from ? location.state.from : '/')
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserLogin({ ...userLogin, [event.target.name]: event.target.value });
        console.log(userLogin)
    }


    return (
        <>
            <div className="h-full w-full flex place-content-center">

                <div className="xs:w-1/2 w-full h-full m-0 flex flex-col px-[7%] gap-2 items-center justify-center">
                    <Typography
                        variant="h5"
                        className="capitalize font-bold text-4xl"
                        sx={{ color: "#3B82F6", marginBottom: "1rem" }}
                    >
                        Regístrate
                    </Typography>
                    <div className="mb-4 flex flex-col gap-4 max-w-md">
                        <div className="grid grid-cols-2 gap-4">
                            <TextField label="Nombre" variant="outlined" sx={{ width: "100%" }}
                                value={student.name}
                                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                            />
                            <TextField label="Apellido" variant="outlined" className='w-full'
                                value={student.lastname}
                                onChange={(e) => setStudent({ ...student, lastname: e.target.value })}
                            />
                        </div>
                        <TextField label="Correo Electronico" variant="outlined" type='email'
                            value={user.login.email}
                            onChange={(e) => setUser({ ...user, login: { ...user.login, email: e.target.value } })}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                            <LocalizationProvider className="overflow-visible" dateAdapter={AdapterDayjs} sx={{ paddingTop: "0" }}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker className="overflow-visible" label="Fecha de Nacimiento" sx={{ paddingTop: "0" }}
                                        value={Dayjs(student.birthday)}
                                        onChange={(value) => {
                                            if (!value) return;
                                            setStudent({ ...student, birthday: value.toDate() })
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <TextField label="Usuario" variant="outlined" className='w-full'
                                value={user.login.username}
                                onChange={(e) => setUser({ ...user, login: { ...user.login, username: e.target.value } })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <TextField label="Matrícula" variant="outlined" className='w-full'
                                value={student.enrollment}
                                onChange={(e) => setStudent({ ...student, enrollment: e.target.value })}
                            />
                            <TextField label="Número" type="number" InputProps={{ inputProps: { min: 1 } }} variant="outlined" className='w-full'
                                value={student.classroom?.number ?? 1}
                                onChange={(e) => {
                                    let classroom = student.classroom
                                    classroom = !classroom ? { number: Number(e.target.value), name: "4A" } : {
                                        ...classroom, number: Number(e.target.value)
                                    }
                                    setStudent({ ...student, classroom })
                                }}
                            />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                            <FormControl className='w-full' >
                                <InputLabel id="curso">Curso</InputLabel>
                                <Select
                                    labelId="curso"
                                    id="curso"
                                    label="curso"
                                    value={student.classroom?.name[0]}
                                    onChange={(e) => {
                                        let classroom = student.classroom
                                        classroom = !classroom ? { number: 1, name: e.target.value + "A" } : {
                                            ...classroom, name: e.target.value + classroom.name[1]
                                        }
                                        setStudent({ ...student, classroom })

                                    }}
                                >
                                    <MenuItem value={4}>4to</MenuItem>
                                    <MenuItem value={5}>5to</MenuItem>
                                    <MenuItem value={6}>6to</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className='w-full' >
                                <InputLabel id="seccion">Sección</InputLabel>
                                <Select
                                    labelId="seccion"
                                    id="seccion"
                                    label="Sección"
                                    value={student.classroom?.name[1]}
                                    onChange={(e) => {
                                        let classroom = student.classroom
                                        classroom = !classroom ? { number: 1, name: "4" + e.target.value } : {
                                            ...classroom, name: classroom.name[0] + e.target.value
                                        }
                                        setStudent({ ...student, classroom })
                                    }}
                                >
                                    <MenuItem value={"A"}>A - Electrónica</MenuItem>
                                    <MenuItem value={"B"}>B - Artes Gráficas</MenuItem>
                                    <MenuItem value={"C"}>C - Mecánica</MenuItem>
                                    <MenuItem value={"D"}>D - Electricidad</MenuItem>
                                    <MenuItem value={"E"}>E - Programación</MenuItem>
                                    <MenuItem value={"F"}>F - Redes</MenuItem>
                                    <MenuItem value={"G"}>G - Artes Gráficas</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password" className="mt-2">Password</InputLabel>
                            <OutlinedInput
                                value={user.login.password}
                                onChange={(e) => setUser({ ...user, login: { ...user.login, password: e.target.value } })}
                                name="password"
                                className="mt-2 w-full border-solid font-mono text-center mb-2 text-sm"
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? < AiFillEyeInvisible /> : <AiFillEye />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                autoComplete="current-password"
                            />
                        </FormControl>
                        <Button variant="contained" size="large" className=" hover:bg-blue-600 text-white bg-blue-500 normal-case text-base font-bold px-4text-center rounded mb-2 w-full"
                            onClick={() => {
                                handleSend()
                                navigate("/login")
                            }}
                        >Crear Cuenta</Button>
                    </div>
                    <Button variant="text" className="normal-case text-base text-blue-500" onClick={() => {
                        navigate("/login")
                    }}>Tienes una Cuenta? Inicia Sesión</Button>
                </div>
                <div className="h-full w-1/2 bg-blue-500 place-items-center hidden md:flex">
                    <Slider />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register