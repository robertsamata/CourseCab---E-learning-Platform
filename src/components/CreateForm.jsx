/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";

function CreateForm({ setCanRefresh }) {
  const [uploadedImage, setUploadedImage] = useState(null);

  const [createData, setCreateData] = useState({
    title: "",
    description: "",
    content: "",
    picture: "",
  });

  const sendCreateFormRequest = async (createData) => {
    if (createData["title"] == "") return toast.error("Invalid event data.");

    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("file", uploadedImage);

    const uploadImageResponse = await fetch(
      `/api/upload/${createData["title"]}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    ).then(async (res) => await res.json());

    if (!(uploadImageResponse["status"] === 201))
      return toast.error("Error uploading image.");

    const filename = uploadImageResponse.filename;

    const createdEntryResponse = await fetch("/api/create_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...createData, picture: filename }),
    }).then(async (res) => await res.json());

    if (!(createdEntryResponse["status"] === 201))
      return toast.error(createdEntryResponse.message);

    toast.success("Uploaded course successfully!");
    setCanRefresh(true);
  };

  return (
    <div className="flex flex-col space-y-3 w-2/4 px-10 py-20 h-[700px]">
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Title </label>
        <input
          onChange={(e) =>
            setCreateData({ ...createData, title: e.target.value })
          }
          className="bg-white border border-black text-black h-10 rounded-md px-2"
          type="text"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Description </label>
        <input
          onChange={(e) =>
            setCreateData({ ...createData, description: e.target.value })
          }
          className="bg-white border border-black text-black h-10 rounded-md px-2"
          type="text"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Picture </label>
        <input
          onChange={(e) => setUploadedImage(e.target.files[0])}
          className="bg-white border border-black text-black  rounded-md"
          type="file"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Content </label>
        <textarea
          onChange={(e) =>
            setCreateData({ ...createData, content: e.target.value })
          }
          className="bg-white border border-black text-black h-32 px-2 rounded-md"
        />
      </div>
      <div className="flex justify-center items-center h-10 py-10">
        <button
          onClick={() => sendCreateFormRequest(createData)}
          className="text-white bg-blue-500 rounded-md px-4 py-2 font-medium"
        >
          {" "}
          Create{" "}
        </button>
      </div>
    </div>
  );
}

export default CreateForm;
