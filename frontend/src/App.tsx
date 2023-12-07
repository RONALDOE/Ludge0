import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Catalog from "@pages/Catalog";
import CreateWF from "@src/pages/WordFind/CreateWF";
import CreateM from "@src/pages/Maps/CreateM";
import GameTeacher from "@src/pages/WordFind/GameTeacher";
import Quiz from "@src/pages/Quiz/Quiz";
import MapGame from "./pages/Maps/Maps";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import QuizReceived from "./pages/Quiz/QuizReceived";
import Loading from "./pages/Loading";
import Restricted from "./pages/Restricted";
import Register from "./pages/Register";
import QuizReview from "./pages/Quiz/QuizReview";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/catalog" Component={Catalog} />
          <Route path="/" Component={Home} />
          <Route element={<ProtectedRoute />}>
            <Route path="/map">
              <Route path="" Component={CreateM} />
              <Route path=":id" Component={CreateM} />
              <Route path="game/:id" Component={MapGame} />
            </Route>
            <Route path="/" Component={Home} />
            <Route path="/quiz">
              <Route path="" Component={Quiz} />
              <Route path="review/:id/:matchId" Component={QuizReview} />
              <Route path="received/:id" Component={QuizReceived} />
              <Route path=":id" Component={Quiz}>
                <Route path=":matchId" Component={Quiz} />
              </Route>
            </Route>
            <Route path="/wordfind">
              <Route path="" Component={CreateWF} />
              <Route path=":id" Component={CreateWF} />
              <Route path="game/:id" Component={GameTeacher} />
            </Route>
            <Route path="/profile" Component={Profile} />
            <Route path="/restricted" Component={Restricted} />
          </Route>
          <Route path="/register" Component={Register} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
