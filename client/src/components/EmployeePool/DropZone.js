const DropZone = ({ type, employees, onDrop, title }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'employee',
      drop: (item) => onDrop(item.id, item.sourceType, type),
      collect: (monitor) => ({
        isOver: monitor.isOver()
      })
    }));
  
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div
          ref={drop}
          className={`
            min-h-[250px] rounded-lg border-2 border-dashed
            transition-colors duration-200 p-4
            ${isOver ? 'border-preferred-green bg-preferred-green/5' : 'border-gray-200'}
          `}
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