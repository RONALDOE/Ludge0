import React, { useState } from "react";
import { IUser } from "@src/interfaces/user.i";
import { IStudent } from "@src/interfaces/student.i";
import { ITeacher } from "@src/interfaces/teacher.i";
import { useContext } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
}

export type Auth = {
  token: string;
  user?: IUser;
  data?: IStudent | ITeacher;
  isAuth: boolean;
};

const AuthContext = React.createContext<{
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}>({
  auth: {
    token: "",
    user: undefined,
    data: undefined,
    isAuth: false,
  },
  setAuth: () => null,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({
    token: "",
    user: undefined,
    data: undefined,
    isAuth: false,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
