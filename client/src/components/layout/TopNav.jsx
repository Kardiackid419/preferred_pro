import PropTypes from 'prop-types';

function TopNav({ onMenuClick }) {
  return (
    <div className="bg-white p-4 shadow">
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}

TopNav.propTypes = {
  onMenuClick: PropTypes.func.isRequired
};

export default TopNav; 