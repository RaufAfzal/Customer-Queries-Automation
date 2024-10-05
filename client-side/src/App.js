import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import UserForm from "./features/users/UserForm";
import NoteForm from "./features/notes/NoteForm";
import EditNote from "./features/notes/EditNote";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
            <Route path="newnote" element={<NoteForm />} />
            <Route path="edit/:id" element={<EditNote />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path="newuser" element={<UserForm />} />
            <Route path="edit/:id" element={<EditUser />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
