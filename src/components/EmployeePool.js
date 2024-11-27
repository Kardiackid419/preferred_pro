import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useJobs } from '../context/JobContext';

function EmployeePool({ jobData, onAssignEmployee, onUnassignEmployee }) {
  const { employees, jobs } = useJobs();

  const checkEmployeeAvailability = (employeeId) => {
    const start = new Date(jobData.startDate);
    const end = new Date(jobData.endDate);
    
    const isAvailable = !jobs.some(job => {
      if (job.id === jobData.id) return false;
      
      const jobStart = new Date(job.startDate);
      const jobEnd = new Date(job.endDate);
      
      const hasOverlap = (
        (start <= jobEnd && start >= jobStart) ||
        (end >= jobStart && end <= jobEnd) ||
        (start <= jobStart && end >= jobEnd)
      );
      
      return hasOverlap && job.assignedEmployees.includes(employeeId);
    });

    return isAvailable;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    if (destination.droppableId === 'dayShift') {
      onAssignEmployee(draggableId, 'day');
    } else if (destination.droppableId === 'nightShift') {
      onAssignEmployee(draggableId, 'night');
    } else if (destination.droppableId === 'pool') {
      onUnassignEmployee(draggableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div>
          <h3 className="font-medium mb-2">Employee Pool</h3>
          <Droppable droppableId="pool">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px] border rounded p-4"
              >
                {employees
                  .filter(emp => !jobData.assignedEmployees.includes(emp.id))
                  .map((employee, index) => (
                    <Draggable
                      key={employee.id}
                      draggableId={employee.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2 mb-2 rounded shadow-sm ${
                            checkEmployeeAvailability(employee.id) 
                              ? 'bg-blue-100' 
                              : 'bg-red-100'
                          }`}
                        >
                          {employee.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div>
          <h3 className="font-medium mb-2">Day Shift</h3>
          <Droppable droppableId="dayShift">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px] border rounded p-4"
              >
                {employees
                  .filter(emp => jobData.dayShift?.includes(emp.id))
                  .map((employee, index) => (
                    <Draggable
                      key={employee.id}
                      draggableId={employee.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-green-100 rounded shadow-sm"
                        >
                          {employee.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div>
          <h3 className="font-medium mb-2">Night Shift</h3>
          <Droppable droppableId="nightShift">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px] border rounded p-4"
              >
                {employees
                  .filter(emp => jobData.nightShift?.includes(emp.id))
                  .map((employee, index) => (
                    <Draggable
                      key={employee.id}
                      draggableId={employee.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-green-100 rounded shadow-sm"
                        >
                          {employee.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default EmployeePool;