import { useState } from 'react';
import { storage } from '../../firebase/config';

function DocumentPreview({ jobId }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = storage.ref(`jobs/${jobId}/documents/${file.name}`);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
      
      // Add to documents list
      setDocuments(prev => [...prev, {
        name: file.name,
        url,
        type: file.type
      }]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>
        <label className="cursor-pointer bg-preferred-green text-white px-4 py-2 rounded-md">
          Upload
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xlsx,.png,.jpg"
          />
        </label>
      </div>

      {uploading && (
        <div className="text-center py-2">
          <p>Uploading...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="border rounded-lg p-3 flex items-center justify-between">
            <span className="truncate">{doc.name}</span>
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}