const getJobStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-200 border-yellow-500',
      'in-progress': 'bg-blue-200 border-blue-500',
      'completed': 'bg-green-200 border-green-500',
      'delayed': 'bg-red-200 border-red-500',
      'default': 'bg-gray-200 border-gray-500'
    };
    return colors[status] || colors.default;
  };
  
  function JobEvent({ job }) {
    const statusColor = getJobStatusColor(job.status);
    
    return (
      <div className={`rounded-lg p-2 border-l-4 ${statusColor} hover:shadow-lg transition-all`}>
        <h3 className="font-semibold">{job.name}</h3>
        <p className="text-sm">{job.location}</p>
      </div>
    );
  }