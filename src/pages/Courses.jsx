import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const getImageLink = (imageName) => `/api/static/images/courses/${imageName}`;

  useEffect(() => {
    fetch("/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data.courses))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const hiddenScrollbarStyle = {
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  const webkitScrollbarStyle = {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  return (
    <Layout>
      <div
        className="page-container text-white text-center  bg-opacity-40 justify-center h-full"
        style={{
          padding: "4rem 10rem",
          ...hiddenScrollbarStyle,
          ...webkitScrollbarStyle,
          marginRight: "10%",
          marginLeft: "10%",
        }}
      >
        <div className="flex justify-center items-center py-20">
          <span className="text-5xl text-center">
            All Courses
          </span>
        </div>
        <div className="flex w-full justify-center">
        <div className="grid grid-cols-3 place-items-center lg:gap-x-80 xl:gap-x-96 gap-y-16 w-[700px]">
          {courses.map((course) => (
            <div
              onClick={() => navigate(`/course/${course.id}`)}
              key={course.id}
              className="cursor-pointer relative transition ease-in-out h-64 w-64 xl:w-80 xl:h-80 border-2 rounded-md border-black hover:scale-110"
            >
              <img
                className="absolute object-cover h-full w-full rounded-md"
                src={getImageLink(course.picture)}
              />
              <div className="text-center font-bold text-2xl flex w-full h-full justify-center items-center absolute text-black">
                {course.title}
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* {courses.map(course => (
             <div key={course.id} className="flex flex-col md:flex-row items-center md:items-start p-4 border-b mb-10">
             <div className="flex-1">
               <h3 className="text-xl font-bold mb-10">{course.title}</h3>
               <p className="mt-auto ">{course.description}</p>
             </div>
            <div className="w-full md:w-40 lg:w-60 flex-shrink-0 mt-2 md:mt-0 " >
               <img
                 className="h-full w-full object-cover ml-10"
                 alt={`Image of ${course.title}`}
                 src={getImageLink(course.picture)}
                 onError={(e) => {
                   if (e.target.src !== getImageLink("default.png")) {
                     e.target.onerror = null;
                     e.target.src = getImageLink("default.png");
                   }
                 }}
               />
              <div className="text-sm mt-4 ml-20">
                <p><strong>Added:</strong> {new Date(course.date_added).toLocaleDateString()}</p>
              </div>
            </div>
           </div>
          ))} */}
      </div>
    </Layout>
  );
}

export default Courses;
