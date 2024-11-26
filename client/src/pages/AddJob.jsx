import React, { useEffect, useRef, useState } from 'react';
import { addJob } from '../firebase/collections';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const [jobName, setJobName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'us' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setAddress(place.formatted_address);
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=AIzaSyAAsae7hTeyyWg8jKheIG3aU-lRX7AYQAM&q=${lat},${lng}`
          );
        }
      });
    }
  }, []);

  // Handle Form Submission
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      title: jobName,
      start: startDate,
      end: endDate,
      address: address,
      mapUrl: mapUrl
    };
    
    const result = await addJob(jobData);
    if (result.success) {
      navigate('/schedule');
    } else {
      alert('Failed to add job: ' + result.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add Job</h1>
      <form onSubmit={handleSubmit}>
        {/* Job Name */}
        <div className="mb-4">
          <label htmlFor="jobName" className="block text-sm font-medium text-gray-700">
            Job Name:
          </label>
          <input
            type="text"
            id="jobName"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter job name"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Job Address:
          </label>
          <input
            type="text"
            id="address"
            ref={inputRef}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter job address"
            required
          />
        </div>

        {/* Map Preview */}
        {mapUrl && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700">Location Preview:</h2>
            <iframe
              src={mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Job Location"
            ></iframe>
          </div>
        )}

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
        >
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;
