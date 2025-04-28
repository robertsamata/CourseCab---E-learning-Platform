/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";

function EditForm({ entry, selectCourse }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editData, setEditData] = useState({ ...entry });

  const sendEditFormRequest = async (editData) => {
    const token = Cookies.get("token");

    if (uploadedImage) {
      const formData = new FormData();
      formData.append("file", uploadedImage);

      const filename = uploadedImage.name;
      const extension = filename.split(".");

      const uploadImageResponse = await fetch(
        `/api/upload/${editData["title"]}`,
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
      editData["picture"] = `${editData["name"]}.${extension[1]}`;
    }

    const editEntryResponse = await fetch("/api/edit_course", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(editData),
    }).then(async (res) => await res.json());

    if (editEntryResponse["status"] === 401)
      return toast.error(editEntryResponse["message"]);
    toast.success(editEntryResponse["message"]);
    return selectCourse(null);
  };

  const sendDeleteFormRequest = async (id) => {
    const token = Cookies.get("token");

    const deleteEntryResponse = await fetch("/api/delete_course", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id: id }),
    }).then(async (res) => await res.json());
    if (deleteEntryResponse["status"] === 401)
      return toast.error(deleteEntryResponse["message"]);
    toast.success(deleteEntryResponse["message"]);
    return selectCourse(null);
  };

  return (
    <div className="flex flex-col space-y-3 w-2/4 px-10 py-20 h-[700px]">
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Title </label>
        <input
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="bg-white border border-black text-black h-10 rounded-md px-2"
          type="text"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-black"> Description </label>
        <input
          value={editData.description}
          onChange={(e) =>
            setEditData({ ...editData, description: e.target.value })
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
          value={editData.content}
          onChange={(e) =>
            setEditData({ ...editData, content: e.target.value })
          }
          className="bg-white border border-black text-black h-32 px-2 rounded-md"
        />
      </div>
      <div className="flex flex-row justify-center space-x-3 items-center h-10 py-10">
        <button
          onClick={() => sendEditFormRequest(editData)}
          className="text-white bg-blue-500 rounded-md px-4 py-2 font-medium"
        >
          {" "}
          Edit{" "}
        </button>
        <button
          onClick={() => sendDeleteFormRequest(editData.id)}
          className="text-white bg-blue-500 rounded-md px-4 py-2 font-medium"
        >
          {" "}
          Delete{" "}
        </button>
        <button
          onClick={() => selectCourse(null)}
          className="text-white bg-blue-500 rounded-md px-4 py-2 font-medium"
        >
          {" "}
          Cancel{" "}
        </button>
      </div>
    </div>
  );
}

export default EditForm;
