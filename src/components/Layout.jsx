/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { UserContext } from "./Auth/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegUser } from "react-icons/fa";
import Header from "./Header";
import AuthModal from "./Admin/AuthModal";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const [accessInfo, setAccessInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const verifyUser = async () => {
    const loggedInStatus = await fetch("/api/logged_in").then(async (res) => await res.json());
    if (loggedInStatus.status === 0) setAccessInfo(null);
  }

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token && location.pathname === "/admin") {
      setAccessInfo(null);
      return navigate("/");
    }
    if (!token) return setAccessInfo(null);
    const decodedToken = jwtDecode(token);

    if (Date.now() >= decodedToken.exp * 1000) {
      setAccessInfo(null);
    }

    if (location.pathname == "/admin" && decodedToken.sub.role !== "admin") {
      navigate("/");
    }

    return setAccessInfo(decodedToken.sub);
  }, []);

  useEffect(() => {
    verifyUser();
  }, [])

  return (
    <UserContext.Provider value={{ accessInfo, setAccessInfo }}>
      <div className="flex flex-col relative h-screen w-screen max-w-screen">
        <Header />
        {children}
        <div className="fixed bottom-1 right-2 px-4 py-4 pb-4" >
            <button onClick={() => setShowModal(true)} type="button">
              <div className="flex items-center rounded-full border-white border-2 h-8 w-8">
                <FaRegUser className="h-6 w-6 rounded-full mx-auto my-auto" />
              </div>
            </button>
        </div>
        <AuthModal isOpen={showModal} setIsOpen={setShowModal} />
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position="top-center"
        />
      </div>
    </UserContext.Provider>
  );
}

export default Layout;
