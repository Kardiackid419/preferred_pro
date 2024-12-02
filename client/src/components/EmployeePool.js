import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useJobs } from '../context/JobContext';

const EmployeeCard = ({ employee, type, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'employee',
    item: { id: employee.id, sourceType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 rounded shadow-sm cursor-move ${
        isDragging ? 'opacity-50' : type === 'pool' ? 'bg-blue-100' : 'bg-green-100'
      }`}
    >
      {employee.name}
    </div>
  );
};

const DropZone = ({ type, employees, onDrop, title }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'employee',
    drop: (item) => onDrop(item.id, item.sourceType, type),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      <div
        ref={drop}
        className={`min-h-[200px] border rounded p-4 ${
          isOver ? 'bg-gray-200' : 'bg-gray-50'
        }`}
      >
        {employees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            type={type}
            onMove={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

function EmployeePool({ jobData, onAssignEmployee, onUnassignEmployee }) {
  const { employees } = useJobs();

  const handleDrop = (employeeId, sourceType, targetType) => {
    if (sourceType === targetType) return;
    
    if (sourceType === 'pool') {
      onAssignEmployee(employeeId, targetType === 'dayShift' ? 'day' : 'night');
    } else if (targetType === 'pool') {
      onUnassignEmployee(employeeId);
    } else {
      onUnassignEmployee(employeeId);
      onAssignEmployee(employeeId, targetType === 'dayShift' ? 'day' : 'night');
    }
  };

  const poolEmployees = employees.filter(emp => !jobData.assignedEmployees.includes(emp.id));
  const dayShiftEmployees = employees.filter(emp => jobData.dayShift?.includes(emp.id));
  const nightShiftEmployees = employees.filter(emp => jobData.nightShift?.includes(emp.id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <DropZone
          type="pool"
          employees={poolEmployees}
          onDrop={handleDrop}
          title="Employee Pool"
        />
        <DropZone
          type="dayShift"
          employees={dayShiftEmployees}
          onDrop={handleDrop}
          title="Day Shift"
        />
        <DropZone
          type="nightShift"
          employees={nightShiftEmployees}
          onDrop={handleDrop}
          title="Night Shift"
        />
      </div>
    </DndProvider>
  );
}

export default EmployeePool;