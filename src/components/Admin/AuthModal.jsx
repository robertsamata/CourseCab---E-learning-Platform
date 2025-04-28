/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { Dialog } from "@headlessui/react";
import LoginView from "../Auth/LoginView";
import RegisterView from "../RegisterView";
import { UserContext } from "../Auth/Context";
import UserDetails from "./UserDetails";

function AuthModal({ isOpen, setIsOpen }) {
  const {accessInfo} = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);

  const changeAuthView = () => {
    setIsLogin(!isLogin);
  };

  if (!accessInfo)
    return (
      <Dialog
        className="flex w-full h-full justify-center items-center absolute top-0 left-0"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {isLogin ? (
          <LoginView isLogin={isLogin} changeAuthView={changeAuthView} />
        ) : (
          <RegisterView isLogin={isLogin} changeAuthView={changeAuthView} />
        )}
      </Dialog>
    );
  return (
    <Dialog
      className="flex w-full h-full justify-center items-center absolute top-0 left-0"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {" "}
      <UserDetails />{" "}
    </Dialog>
  );
}

export default AuthModal;
