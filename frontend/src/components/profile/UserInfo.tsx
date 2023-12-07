import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { TextField, Select, MenuItem, InputLabel, FormControl, OutlinedInput, IconButton, InputAdornment, Button } from "@mui/material"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { logout } from '@src/services/user'
import { useAuth } from '@src/context/AuthProvider'

type UserInfoProps = {
    student: boolean
}


const UserInfo = (props: UserInfoProps) => {

    const { auth, setAuth } = useAuth()

    const handleClickShowLastPassword = () => setShowLastPassword((show) => !show);
    const handleMouseDownLastPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const [showLastPassword, setShowLastPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const [showPassword, setShowPassword] = React.useState(false);

    const logoutFn = async () => {
        localStorage.removeItem("token");
        setAuth({
            token: "",
            user: undefined,
            data: undefined,
            isAuth: false
        })
    }

    return (
        <>
            <div className="flex justify-between pb-10">
                <p className="text-blue-500 text-3xl m-0 font-bold">
                    Información Personal
                </p>
                <div className="flex gap-4">
                    <Button size='large' variant='contained'>Guardar</Button>
                    <Button variant="contained" size="large" color="secondary" className='text-white'>Cancelar</Button>
                </div>
            </div>
            <div className="flex gap-3 items-center">
                <div className="flex gap-10 w-1/4 flex-col h-full items-center justify-center align-middle text-center">
                    <FaUserCircle className='text-blue-500 align-middle' style={{ fontSize: "20rem" }} />
                    <Button variant="contained" size="large" className='text-white bg-red-500' onClick={logoutFn}>Cerrar Sesión</Button>
                </div>
                <div className="flex w-3/4 h-full pl-52 flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className='grid grid-cols-2 gap-4'>
                            <TextField label="Nombre" variant="outlined" className='w-full' value={auth.data?.name} />
                            <TextField label="Apellido" variant="outlined" className='w-full' value={auth.data?.lastname} />
                        </div>
                        <div className={`grid gap-4 ` + (props.student == true ? `grid-cols-2` : ``)}>
                            {
                                props.student == true ? (
                                    <>
                                        <TextField label="Fecha de Nacimiento" variant="outlined" className='w-full hidden' value={auth.data?.birthday} />
                                        <TextField label="Matrícula" variant="outlined" className='w-full' />
                                    </>
                                ) : (<><TextField label="Fecha de Nacimiento" variant="outlined" className='w-full hidden' /></>)
                            }
                        </div>
                        {props.student == true ? (
                            <div className='grid grid-cols-3 gap-4'>
                                <TextField label="Número" type="number" InputProps={{ inputProps: { min: 0 } }} variant="outlined" className='w-full' />
                                <FormControl>
                                    <InputLabel id="curso">Curso</InputLabel>
                                    <Select
                                        labelId="curso"
                                        id="curso"
                                        label="curso"
                                    >
                                        <MenuItem value={4}>4to</MenuItem>
                                        <MenuItem value={5}>5to</MenuItem>
                                        <MenuItem value={6}>6to</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="seccion">Sección</InputLabel>
                                    <Select
                                        labelId="seccion"
                                        id="seccion"
                                        label="Sección"
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
                        ) : (<></>)}
                    </div>
                    <div className="flex flex-col gap-4">
                        <TextField variant="outlined" name='username' label="Nombre de Usuario" value={auth.user?.login.username} />
                        <TextField variant="outlined" name="email" value={auth.user?.login.email} type='email' label="Correo Electrónico" />
                        <div className="grid grid-cols-2 gap-4">
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="lastpwd">Anterior Clave</InputLabel>
                                <OutlinedInput
                                    name="password"
                                    id="lastpwd"
                                    type={showLastPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowLastPassword}
                                                onMouseDown={handleMouseDownLastPassword}
                                                edge="end"
                                            >
                                                {showLastPassword ? < AiFillEyeInvisible /> : <AiFillEye />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Anterior Clave"
                                    autoComplete="current-password"
                                />
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="newpwd">Nueva Clave</InputLabel>
                                <OutlinedInput
                                    name="Nueva Clave"
                                    id="newpwd"
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
                                    label="Nueva Clave"
                                    autoComplete="current-password"
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInfo