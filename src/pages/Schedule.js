import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Schedule() {
  const { currentUser } = useAuth();
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [showAllJobs, setShowAllJobs] = useState(true);

  const events = jobs
    .filter(job => showAllJobs || job.assignedEmployees.includes(currentUser.email))
    .map(job => ({
      id: job.id,
      title: job.name,
      start: new Date(job.startDate),
      end: new Date(job.endDate),
      resource: job
    }));

  const handleSelectEvent = (event) => {
    navigate(`/job/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-end mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAllJobs}
                onChange={(e) => setShowAllJobs(e.target.checked)}
                className="mr-2"
              />
              Show all jobs
            </label>
          </div>
          <div style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day']}
              defaultView="month"
              tooltipAccessor={event => `${event.title}\n${event.resource.location}`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Schedule;