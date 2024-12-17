import React, { useState, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Schedule.css';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Layout from '../components/Layout';
import { useReactToPrint } from 'react-to-print';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const calendarRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' }
  ];

  const filteredEvents = jobs
    .filter(job => {
      const assignmentFilter = showAllJobs || job.assignedEmployees.includes(currentUser.email);
      const statusMatches = statusFilter === 'all' || job.status === statusFilter;
      const searchMatches = 
        searchTerm === '' || 
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return assignmentFilter && statusMatches && searchMatches;
    })
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

  const eventStyleGetter = (event) => {
    if (event.resource.jobColor) {
      return {
        style: {
          backgroundColor: event.resource.jobColor,
          borderRadius: '4px',
          opacity: 1,
          padding: '4px',
          fontSize: '14px',
          color: '#374151',
          border: '1px solid rgba(0,0,0,0.2)'
        }
      };
    }

    const status = event.resource.status || 'default';
    const colors = {
      'pending': { backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B' },
      'in-progress': { backgroundColor: '#DBEAFE', borderLeft: '4px solid #3B82F6' },
      'completed': { backgroundColor: '#D1FAE5', borderLeft: '4px solid #10B981' },
      'delayed': { backgroundColor: '#FEE2E2', borderLeft: '4px solid #EF4444' },
      'default': { backgroundColor: '#F3F4F6', borderLeft: '4px solid #6B7280' }
    };

    return {
      style: {
        ...colors[status],
        borderRadius: '4px',
        opacity: 1,
        padding: '4px',
        fontSize: '14px',
        color: '#374151'
      }
    };
  };

  const CustomToolbar = (toolbar) => {
    return (
      <div className="flex flex-col space-y-4 mb-4">
        {/* Date Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-preferred-green text-white rounded shadow-sm"
              onClick={() => toolbar.onNavigate('PREV')}
            >
              ←
            </button>
            <button
              className="px-3 py-1 bg-preferred-green text-white rounded shadow-sm"
              onClick={() => toolbar.onNavigate('TODAY')}
            >
              Today
            </button>
            <button
              className="px-3 py-1 bg-preferred-green text-white rounded shadow-sm"
              onClick={() => toolbar.onNavigate('NEXT')}
            >
              →
            </button>
          </div>
          <span className="text-sm font-semibold hidden sm:block">
            {toolbar.label}
          </span>
        </div>

        {/* View Selection */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold sm:hidden">
            {toolbar.label}
          </span>
          <div className="flex space-x-1">
            {['month', 'week', 'day'].map(view => (
              <button
                key={view}
                className={`px-2 py-1 text-sm rounded ${
                  toolbar.view === view 
                    ? 'bg-preferred-green text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => toolbar.onView(view)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getEventTooltip = (event) => {
    const job = event.resource;
    return `
      ${job.name}
      Location: ${job.location}
      Status: ${job.status}
      Start: ${format(event.start, 'MMM dd, yyyy')}
      End: ${format(event.end, 'MMM dd, yyyy')}
      ${job.assignedEmployees?.length ? `Employees: ${job.assignedEmployees.length}` : ''}
    `;
  };

  const handlePrint = useReactToPrint({
    content: () => calendarRef.current,
    documentTitle: 'Schedule - Preferred Pro',
    pageStyle: `
      @media print {
        .no-print { display: none; }
        .print-only { display: block; }
      }
    `
  });

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("/preferred_50th.png")',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50%',
        backgroundAttachment: 'fixed',
        opacity: 1
      }}
    >
      <div className="relative z-10">
        <Navigation />
        <main className="container mx-auto p-4">
          <div className="flex justify-end mb-4 no-print">
            <button
              onClick={handlePrint}
              className="bg-preferred-green text-white px-4 py-2 rounded-md hover:bg-opacity-90"
            >
              Print Schedule
            </button>
          </div>
          <div ref={calendarRef} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAllJobs}
                  onChange={(e) => setShowAllJobs(e.target.checked)}
                  className="mr-2 h-4 w-4 text-preferred-green"
                />
                <span className="text-sm">Show all jobs</span>
              </label>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-preferred-green"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-preferred-green"
                />
              </div>
            </div>
            <div className="h-[500px] sm:h-[700px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'day']}
                defaultView="month"
                tooltipAccessor={getEventTooltip}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: CustomToolbar
                }}
                className="mobile-calendar-fixes"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Schedule;