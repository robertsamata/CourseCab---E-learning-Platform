/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import SwitchToggle from "./SwitchToggle";
import { toast } from 'react-toastify';

function RegisterView({ isLogin, changeAuthView }) {
  const [userInput, setUserInput] = useState("");
  const [fullnameInput, setFullnameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const sendRegister = async () => {
    const registerCredentials = {
      username: userInput,
      fullname: fullnameInput,
      password: passwordInput,
      email: emailInput,
    };
    const registerResponse = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerCredentials),
    }).then(async (res) => await res.json());

    if (registerResponse.status === 401) {
        return toast.error(registerResponse.message);
    }

    changeAuthView();
    toast.success(registerResponse.message);
  };

  return (
    <Dialog.Panel className="bg-white text-black rounded-lg px-6 py-4 w-1/6">
      <div className="w-full flex justify-center">
        {" "}
        <SwitchToggle isLogin={isLogin} onChange={changeAuthView} />{" "}
      </div>
      <Dialog.Title className="text-2xl font-bold">Register</Dialog.Title>

      <div className="flex flex-col space-y-2 items-left py-6">
      <div className="w-full flex flex-col space-y-1">
          <label> Fullname </label>
          <input
            onInput={(e) => setFullnameInput(e.target.value)}
            value={fullnameInput}
            className="bg-white w-full border border-black px-2 rounded-md"
            type="text"
          />
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label> Username </label>
          <input
            onInput={(e) => setUserInput(e.target.value)}
            value={userInput}
            className="bg-white w-full border border-black px-2 rounded-md"
            type="text"
          />
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label> Email </label>
          <input
            onInput={(e) => setEmailInput(e.target.value)}
            value={emailInput}
            className="bg-white w-full border border-black px-2 rounded-md"
            type="text"
          />
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label> Password </label>
          <input
            onInput={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
            className="bg-white w-full border border-black px-2 rounded-md"
            type="password"
          />
        </div>
        <div className="pt-6 flex w-full justify-center">
          <button
            onClick={() => sendRegister()}
            type="button"
            className="bg-blue-500 rounded-lg w-20 h-8 text-white text-lg font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </Dialog.Panel>
  );
}

export default RegisterView;
