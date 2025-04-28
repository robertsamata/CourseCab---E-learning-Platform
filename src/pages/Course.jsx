import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Course() {
  const id = window.location.pathname.replace("/course/", "");
  const [image, setImage] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const getImageLink = (imageName) => {
    return `/api/static/images/courses/${imageName}`;
  }

  const fetchCourse = async () => {
    const response = await fetch(`/api/course/${id}`).then(
      async (res) => await res.json()
    );

    setImage(getImageLink(response.picture));
    setCourseInfo(response);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <Layout>
      {image ? (
        <div className="flex flex-col w-full h-full items-center">
          <div
            id="HomeImage"
            className="relative w-full h-[300px] bg-cover bg-center shrink-0"
            style={{
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          > 
            <img src={image} className="absolute w-full h-full object-contain" />
            <div className="relative z-4 text-white text-center flex flex-col bg-opacity-40 bg-black justify-center h-full">
              <h1 className="text-4xl font-bold h-35 "> {courseInfo.title} </h1>
              <p className="text-white text-lg font-semibold mt-2 rounded-lg mx-auto w-2/5 text-center">
                {courseInfo.description}
              </p>
              <span className="text-white text-lg font-bold mt-2 rounded-lg mx-auto w-64 text-center">
                Added at: {courseInfo.date_added}
              </span>
              <a href={`/evaluate/${id}`} className="flex justify-center items-center border-white h-12 text-center w-44 bg-black text-white text-lg font-bold mt-2 rounded-lg mx-auto text-center">
                <span> Evaluate </span>
              </a>
            </div>
          </div>
          <div id="course-info" className="text-left overflow-y-scroll max-w-[950px] py-20">
            {courseInfo.content}
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

export default Course;
