export const InputField = ({ label, error, ...props }) => (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          focus:ring-2 focus:ring-preferred-green/20 focus:border-preferred-green
          ${error ? 'border-red-300' : 'border-gray-200'}
        `}
        {...props}
      />
      {error && (
        <p className="absolute -bottom-6 left-0 text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );