import Layout from "../components/Layout";
import HomePageImage from "../assets/logo.png"; // Importing the image
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const getImageLink = (imageName) => `/api/static/images/courses/${imageName}`;

  useEffect(() => {
    fetch("/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data.courses))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <Layout>
      <div className="flex flex-col flex-grow justify-center max-w-full">
        <div
          id="HomeImage"
          className="h-[1000px] w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${HomePageImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="text-white text-center flex flex-col bg-opacity-40 bg-black justify-center h-full">
            <h1 className="text-2xl font-bold h-35 ">Welcome to CourseCab </h1>
            <p className="text-white text-lg font-semibold mt-2 rounded-lg mx-auto w-2/5 text-center">
              A new way to assess what you have learned with an automated
              assistent to evaluate your skills!
            </p>
          </div>
        </div>
        <div className="flex bg-opacity-40 bg-black justify-center pt-20">
          <div className="flex flex-col space-y-4 max-w-[700px]">
            <span className="text-3xl font-semibold text-center">
              A new way to evaluate your skills based on the knowledge provided
              by our courses.
            </span>
            <span className="text-xl font-medium text-center">
              Enroll into a course, learn, and then you will be able to evaluate
              your skills using our chatbot technology, powered by AI. Based on
              your performance, you will get a certification based on the niche
              you align with.
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-10 bg-opacity-40 bg-black justify-center h-full w-full items-center">
          <div className="w-full text-center text-4xl max-w-[1000px] font-bold">
            {" "}
            Available Courses{" "}
          </div>
          <div className="grid grid-cols-3 place-items-center max-w-[1200px] gap-20 text-black">
            {courses.map((course) => (
              <div
                onClick={() => navigate(`/course/${course.id}`)}
                key={course.id}
                className="cursor-pointer relative transition ease-in-out w-80 h-80 border-2 rounded-md border-black hover:scale-110"
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
      </div>
    </Layout>
  );
}

export default Home;
