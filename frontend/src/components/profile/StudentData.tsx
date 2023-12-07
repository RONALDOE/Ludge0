import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Modal, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import api from "@src/config/axios";
import { IStudent } from '@interfaces/student.i'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { IUser } from '@src/interfaces/user.i';
import Dayjs from 'dayjs';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 10,
  padding: "2.8rem 2.1rem",
  textTransform: "capitalize",
  borderRadius: 2,
};

const StudentData = () => {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setStudent({
      name: "",
      lastname: "",
      user: "",
      enrollment: "",
      classroom: {
        name: "4A",
        number: 1,
      },
      birthday: new Date(),
    })
    _setUser({
      status: "active",
      login: {
        username: "",
        email: "",
        password: "",
        provider: "local"
      },
      role: "student",
    })
  };

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
  }

  const getStudents = async () => {
    const response = await api.get("/students");
    return setStudents(response.data);
  };

  const handleSend = async () => {
    if (student.id) {
      if (typeof student.user != "string") return;
      const response = await api.put("/users", {
        user: { ...user, login: { ...user.login, password: undefined } }
      })
      console.log(response.data)
      const response2 = await api.put("/students/", {
        student: { ...student, user: response.data.id }
      })
      console.log(response2.data)
      getStudents();
      return;
    }

    const object = student as any
    object.user.login.password = object.enrollment

    const response = await api.post("/students", {
      student: object
    })

    getStudents();
  }

  const [students, setStudents] = useState<IStudent[]>([]);

  useEffect(() => {
    getStudents();
  }, [])

  return (
    <>
      <div>
        <div className="flex justify-between pb-4">
          <p className="text-blue-500 text-3xl m-0 font-bold">
            Registro de Estudiantes
          </p>
          <div className="flex gap-4">
            <Button size='large' variant='contained' onClick={handleOpen}>Añadir Estudiante</Button>
          </div>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%" }}>
                    <p className="font-bold">Nombre</p>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <p className="font-bold">Apellido</p>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <p className="font-bold">Nacimiento</p>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <p className="font-bold">Matricula</p>
                  </TableCell>
                  <TableCell sx={{ width: "9%" }}>
                    <p className="font-bold">Número</p>
                  </TableCell>
                  <TableCell sx={{ width: "8%" }}>
                    <p className="font-bold">Curso</p>
                  </TableCell>
                  <TableCell sx={{ width: "8%" }}>
                    <p className="font-bold">Acciones</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.lastname}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.birthday.toString().substring(0, 10)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.enrollment}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.classroom?.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.classroom?.number}
                    </TableCell>
                    <TableCell>
                      <div className='flex'>
                        <Button className='cursor-poiner min-w-0'>
                          <FaTrash />
                        </Button>
                        <Button className="cursor-pointer min-w-0">
                          <FaEdit />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" className="capitalize" sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            className="capitalize"
            sx={{ color: "#3B82F6", marginBottom: "2rem" }}
          >
            Añadir Estudiante
          </Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
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
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ paddingTop: "0" }}>
                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                  <DatePicker label="Fecha de Nacimiento" sx={{ paddingTop: "0" }}
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
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

          </div>
          <Button
            variant="contained"
            style={{ width: "100%" }}
            size="large"
            onClick={() => {
              handleSend()
              handleClose()

            }}
          >
            Agregar Estudiante
          </Button>
        </Box>
      </Modal>
    </>
  )
}

export default StudentData