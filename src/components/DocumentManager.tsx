import React, { useState, useRef } from 'react';
import { Document } from '../types';

interface DocumentManagerProps {
  restaurantId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onDeleteDocument: (id: string) => void;
  user: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  restaurantId,
  documents,
  onAddDocument,
  onDeleteDocument,
  user,
}) => {
  const [selectedType, setSelectedType] = useState<'license' | 'hs_document' | 'training_record'>('license');
  const [documentName, setDocumentName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name);
    }
  };

  const handleViewDocument = (document: Document) => {
    setViewingDocument(document);
    setFilePreview(null);

    // In a real application, you would fetch the file from the server
    // For this demo, we'll show file information
    // If it were an image, you could show a preview
  };

  const closeViewModal = () => {
    setViewingDocument(null);
    setFilePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !documentName) return;

    const document: Document = {
      id: Date.now().toString(),
      restaurantId,
      name: documentName,
      type: selectedType,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      uploadDate: new Date(),
      uploadedBy: user,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: 'active',
    };

    onAddDocument(document);
    setDocumentName('');
    setExpiryDate('');
    setSelectedFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'license': return 'License';
      case 'hs_document': return 'H&S Document';
      case 'training_record': return 'Training Record';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'pending_review': return 'orange';
      default: return 'gray';
    }
  };

  const restaurantDocuments = documents.filter(doc => doc.restaurantId === restaurantId);

  return (
    <div className="document-manager">
      <h2>Document Management</h2>

      <div className="upload-section">
        <h3>Upload New Document</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Document Type:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as any)}>
              <option value="license">License</option>
              <option value="hs_document">H&S Document</option>
              <option value="training_record">Training Record</option>
            </select>
          </div>
          <div>
            <label>Document Name:</label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>
          <div>
            <label>File:</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
          </div>
          <div>
            <label>Expiry Date (optional):</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <button type="submit">Upload Document</button>
        </form>
      </div>

      <div className="documents-section">
        <h3>Uploaded Documents</h3>
        <div className="documents-grid">
          {restaurantDocuments.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-header">
                <h4>{doc.name}</h4>
                <span className={`status ${getStatusColor(doc.status)}`}>
                  {doc.status.replace('_', ' ')}
                </span>
              </div>
              <div className="document-details">
                <p><strong>Type:</strong> {getTypeLabel(doc.type)}</p>
                <p><strong>File:</strong> {doc.fileName}</p>
                <p><strong>Size:</strong> {(doc.fileSize / 1024).toFixed(1)} KB</p>
                <p><strong>Uploaded:</strong> {doc.uploadDate.toLocaleDateString()}</p>
                <p><strong>By:</strong> {doc.uploadedBy}</p>
                {doc.expiryDate && (
                  <p><strong>Expires:</strong> {doc.expiryDate.toLocaleDateString()}</p>
                )}
              </div>
              <div className="document-actions">
                <button onClick={() => handleViewDocument(doc)}>View</button>
                <button onClick={() => onDeleteDocument(doc.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewingDocument && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{viewingDocument.name}</h3>
              <button className="close-button" onClick={closeViewModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="document-details-modal">
                <p><strong>Type:</strong> {getTypeLabel(viewingDocument.type)}</p>
                <p><strong>File Name:</strong> {viewingDocument.fileName}</p>
                <p><strong>Size:</strong> {(viewingDocument.fileSize / 1024).toFixed(1)} KB</p>
                <p><strong>Uploaded:</strong> {viewingDocument.uploadDate.toLocaleDateString()}</p>
                <p><strong>Uploaded By:</strong> {viewingDocument.uploadedBy}</p>
                {viewingDocument.expiryDate && (
                  <p><strong>Expires:</strong> {viewingDocument.expiryDate.toLocaleDateString()}</p>
                )}
                <p><strong>Status:</strong> <span className={`status ${getStatusColor(viewingDocument.status)}`}>{viewingDocument.status.replace('_', ' ')}</span></p>
              </div>
              <div className="document-preview">
                {filePreview ? (
                  <div>
                    <img src={filePreview} alt={viewingDocument.fileName} style={{maxWidth: '100%', maxHeight: '400px'}} />
                  </div>
                ) : (
                  <div className="file-info">
                    <p><strong>File Type:</strong> {viewingDocument.fileName.split('.').pop()?.toUpperCase()}</p>
                    <p>This document has been uploaded and stored. In a production application, you would be able to view or download the file here.</p>
                  </div>
                )}
                <button className="download-button" onClick={() => alert('Download functionality would be implemented with a backend file storage system.')}>
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;