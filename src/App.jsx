import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Test from "./Pages/Test";
import Homer from "./Pages/Employer/Homer";
import Homee from "./Pages/Employee/Homee";
import Profile from "./Pages/Profile";
import AddJob from "./Pages/Employer/AddJob";
import ViewJob from "./Pages/ViewJob";
import Blog from "./Pages/Blog";
import Messages from "./Pages/Messages";
import ViewPerson from "./Pages/ViewPerson";
import AllJobs from "./Pages/AllJobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Test" element={<Test />} />
      <Route path="/Homer" element={<Homer />} />
      <Route path="/Homee" element={<Homee />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/AddJob" element={<AddJob />} />
      <Route path="/ViewJob/:id" element={<ViewJob />} />
      <Route path="/ViewPerson/:id" element={<ViewPerson />} />
      <Route path="/Blog" element={<Blog />} />
      <Route path="/Messages" element={<Messages />} />
      <Route path="/AllJobs" element={<AllJobs />} />
    </Routes>
  );
}

export default App;
