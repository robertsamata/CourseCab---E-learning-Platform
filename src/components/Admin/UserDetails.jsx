import { useContext } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { UserContext } from "../Auth/Context";
import { useNavigate } from "react-router-dom";

function UserDetails() {
  const navigate = useNavigate();
  const {accessInfo, setAccessInfo} = useContext(UserContext);
  const isAdmin = accessInfo.role === "admin";

  const sendLogout = async () => {
    try {
        const authToken = Cookie.get("token");
        const authHeader = `Bearer ${authToken}`;
    
        await fetch("/api/logout", {
            method: "POST",
            headers: {
            "Authorization": authHeader
            },
        }).then(async (res) => await res.json());

        setAccessInfo(null);
        Cookie.remove("token");
        toast.success("You have logged out successfully!");
        if (location.pathname == "/admin") {
          return navigate("/");
        }
    }
    catch (error) {
        toast.error("Something went wrong in the logout procedure, you are being logged out automatically");
        setAccessInfo(null);
        Cookie.remove("token");
    }
  }

  return (
    <Dialog.Panel className="bg-white text-black rounded-lg px-6 py-4 w-[360px]">
      <Dialog.Title className="text-2xl font-bold">User details</Dialog.Title>

      <div className="flex flex-col space-y-6 items-left py-6">
      <div className="w-full flex flex-col space-y-1">
          <label className="font-semibold text-xl"> Fullname </label>
          <span> {accessInfo.fullname} </span>
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label className="font-semibold text-xl"> Username </label>
          <span> {accessInfo.username} </span>
        </div>
        <div className="w-full flex flex-col space-y-1">
          <label className="font-semibold text-xl"> Email </label>
          <span> {accessInfo.email} </span>
        </div>
        <div className="pt-6 flex w-full justify-center">
          <div className="flex flex-row space-x-3">
            <button
                onClick={() => sendLogout()}
                type="button"
                className="bg-blue-500 rounded-lg w-32 h-8 text-white text-lg font-medium"
            >
                Log out
            </button>
            {isAdmin ? <button
                onClick={() => window.open("/admin", "_self")}
                className="bg-blue-500 rounded-lg w-32 h-8 text-white text-lg font-medium text-center"
            >
                Administrate
            </button> : null}
          </div>
        </div>
      </div>
    </Dialog.Panel>
  );
}

export default UserDetails;
