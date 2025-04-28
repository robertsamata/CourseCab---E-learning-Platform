/* eslint-disable react/prop-types */
function CourseCard({ index, selectCourse, entry }) {
  const getImageLink = (imageName) => `/api/static/images/courses/${imageName}`;

  return (
    <div
      onClick={() => selectCourse(entry)}
      className="flex h-32 w-full border border-black rounded-md space-x-4 cursor-pointer"
      key={index}
    >
      <div className="w-40 border-r border-black">
        <img
          className="h-full w-full"
          alt={entry.picture}
          src={getImageLink(entry.picture)}
        />
      </div>
      <div className="flex flex-col space-y-3 py-4">
        <div className="text-lg font-medium"> {entry.title} </div>
        <div className="text-md"> {entry.description} </div>
      </div>
    </div>
  );
}

export default CourseCard;
