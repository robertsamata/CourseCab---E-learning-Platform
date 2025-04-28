/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Table({ grades }) {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const TOTAL_VALUES_PER_PAGE = 5;

  const goOnPrevPage = () => {
    if (currentPageNumber === 1) return;
    setCurrentPageNumber((prev) => prev - 1);
  };
  const goOnNextPage = () => {
    if (dataToDisplay.length < TOTAL_VALUES_PER_PAGE) return;
    setCurrentPageNumber((prev) => prev + 1);
  };

  useEffect(() => {
    const start = (currentPageNumber - 1) * TOTAL_VALUES_PER_PAGE;
    const end = currentPageNumber * TOTAL_VALUES_PER_PAGE;
    setDataToDisplay(grades.slice(start, end));
  }, [currentPageNumber, grades]);

  return (
    <div className="flex flex-col mt-32">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ">
            <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Grade
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {dataToDisplay.map((grade) => {
                  return (
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                     <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {grade.title}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {grade.date_created}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {grade.grade}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end mt-10 space-x-6">
        <button disabled={currentPageNumber === 1} onClick={goOnPrevPage} className="rounded-lg block w-24 h-8 bg-blue-800 hover:bg-blue-600 text-white">Prev</button>
        <button disabled={dataToDisplay.length < TOTAL_VALUES_PER_PAGE} onClick={goOnNextPage} className="rounded-lg block w-24 h-8 bg-blue-800 hover:bg-blue-600 text-white">Next</button>
      </div>
    </div>
  );
}

function History() {
  const [gradings, setGradings] = useState([]);

  const fetchGradings = async () => {
    await fetch("/api/history").then(async (res) => {
      const result = await res.json();
      console.log(result);

      setGradings(result["attended_courses"]);
    });
  };

  useEffect(() => {
    fetchGradings();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col h-full w-full items-center  mt-32 h-screen">
        <div className="text-3xl"> Your Gradings </div>
        {gradings.length > 0 && <Table grades={gradings} />}
        {gradings.length === 0 && <div> No gradings found. </div>}
      </div>
    </Layout>
  );
}

export default History;
