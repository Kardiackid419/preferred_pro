import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../firebase/collections';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Schedule = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const fetchedJobs = await getJobs();
      setJobs(fetchedJobs);
    };
    
    fetchJobs();
  }, []);

  const handleDateClick = (date) => {
    const jobsOnDate = jobs.filter(
      (job) => date >= new Date(job.start) && date <= new Date(job.end)
    );
    alert(
      jobsOnDate.length
        ? `Jobs on ${format(date, 'MMMM do, yyyy')}:\n- ${jobsOnDate
            .map((job) => job.title)
            .join('\n- ')}`
        : `No jobs on ${format(date, 'MMMM do, yyyy')}`
    );
  };

  const handleJobClick = (job) => {
    alert(`Job Details:\nTitle: ${job.title}\nStart: ${job.start}\nEnd: ${job.end}`);
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <Calendar
        localizer={localizer}
        events={jobs.map((job) => ({
          ...job,
          start: new Date(job.start),
          end: new Date(job.end),
          title: job.title,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '75vh' }}
        onSelectSlot={handleDateClick}
        onSelectEvent={(event) => handleJobClick(event)}
      />
      <div className="mt-4 flex justify-start">
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={() => navigate('/add-job')}
        >
          Add Job
        </button>
      </div>
    </div>
  );
};

export default Schedule;
