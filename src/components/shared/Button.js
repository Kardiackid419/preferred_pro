export const Button = ({ variant = 'primary', children, ...props }) => {
    const styles = {
      primary: 'bg-preferred-green text-white hover:bg-preferred-green/90',
      secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50',
      danger: 'bg-red-500 text-white hover:bg-red-600'
    };
  
    return (
      <button
        className={`
          ${styles[variant]}
          px-6 py-3 rounded-lg font-semibold
          transform transition-all duration-200
          hover:shadow-md hover:scale-[1.02]
          active:scale-[0.98] disabled:opacity-50
        `}
        {...props}
      >
        {children}
      </button>
    );
  }