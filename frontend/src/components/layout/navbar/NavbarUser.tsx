import { useAuth } from "@src/context/AuthProvider"
import { FaUserCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import Button from "@src/components/common/Button"

export default function NavbarUser() {
  const { auth } = useAuth()

  const roleLabels: { [key: string]: string } = {
    teacher: "Profesor",
    student: "Estudiante",
  }

  const userName = auth.user?.login.username ?? roleLabels[auth.user?.role ?? 'student']

  return auth.isAuth ? (
    <Link to="/profile" className="text-white flex items-center">
      <p className="mr-2 flex items-center">{userName}</p>
      <FaUserCircle className="text-2xl cursor-pointer" />
    </Link>
  ) : (
    <Link to="/login">
      <Button variant="text" className="text-white">INICIAR SESIÓN</Button>
    </Link>
  )
}

