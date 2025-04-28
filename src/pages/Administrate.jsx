import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react'
import Layout from "../components/Layout";
import CreateForm from '../components/CreateForm';
import EditForm from '../components/EditForm';
import EditList from '../components/EditList';

function Administrate() {
  const [canRefresh, setCanRefresh] = useState(false);

  const [coursesData, setCoursesData] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    await fetch("/api/courses").then(async (response) => setCoursesData(await response.json()))
  }

  useEffect(() => {
    fetchCourses();
  }, [])

  useEffect(() => {
    if (!selectedCourse) {
      fetchCourses();
    }
  }, [selectedCourse])

  useEffect(() => {
    if (canRefresh) {
      fetchCourses();
      setCanRefresh(false);
    }
  }, [canRefresh])

  return (
    <Layout>
      <div className="flex flex-col flex-grow justify-center items-center space-y-10">
        <div className="text-5xl font-semibold"> Administrate </div>
     
        <div className="h-3/4 w-5/12 rounded-lg shadow-lg bg-gray-200 border-2 border-black">
            <Tab.Group>
                <Tab.List className="flex w-full text-black justify-between items-start border-b-2 border-black">
                    <Tab className="w-1/2 py-6 text-xl font-medium text-center border-r border-black">Create</Tab>
                    <Tab className="w-1/2 py-6 text-xl font-medium text-center border-l border-black">Edit</Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel className="flex w-full justify-center">
                        <CreateForm setCanRefresh={setCanRefresh} />
                    </Tab.Panel>
                    <Tab.Panel className="flex w-full justify-center">
                        {selectedCourse ? <EditForm selectCourse={setSelectedCourse} entry={selectedCourse} /> : <EditList selectCourse={setSelectedCourse} courses={coursesData?.courses} />}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
      </div>
    </Layout>
  );
}

export default Administrate;
