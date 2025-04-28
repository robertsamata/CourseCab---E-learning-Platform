import CourseCard from "./CourseCard"
/* eslint-disable react/prop-types */
function EditList({ courses, selectCourse }) {
  return (
    <div id="edit-list" className="flex flex-col space-y-3 w-3/4 px-10 py-20 text-black max-h-[650px] overflow-y-scroll">
      {courses.map((entry, index) => (
        <CourseCard key={index} index={index} entry={entry} selectCourse={selectCourse} />
      ))}
    </div>
  );
}

export default EditList;
