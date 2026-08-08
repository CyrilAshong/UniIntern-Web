import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { 
  Check, 
  FileText, 
  Eye, 
  Trash2, 
  RefreshCw, 
  UploadCloud, 
  Info 
} from 'lucide-react';

interface Document {
  id: string;
  type: 'CV' | 'LETTER';
  fileName: string;
  fileSize: number | null;
  uploadedAt: string;
  url: string;
}

const UploadDocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<'CV' | 'LETTER' | null>(null);
  const [dragOver, setDragOver] = useState<'CV' | 'LETTER' | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const letterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File, docType: 'CV' | 'LETTER') => {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB.');
      return;
    }

    try {
      setUploadingType(docType);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', docType);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await loadDocuments();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Upload failed.');
    } finally {
      setUploadingType(null);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, docType: 'CV' | 'LETTER') => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file, docType);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent, docType: 'CV' | 'LETTER') => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file, docType);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch {
      alert('Failed to delete document.');
    }
  };

  const cvDoc = documents.find((d) => d.type === 'CV');
  const letterDoc = documents.find((d) => d.type === 'LETTER');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-navy mb-2">My Documents</h1>
            <p className="text-gray-400 text-sm">
              Manage your application documents.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400">Loading documents...</div>
          ) : (
            <>
              {/* Document Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">

                {/* CV Section */}
                <div
                  className={`bg-white rounded-2xl p-6 border-2 transition-colors shadow-sm ${
                    dragOver === 'CV' ? 'border-navy bg-blue-50' : 'border-gray-100'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver('CV'); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, 'CV')}>

                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-navy">Curriculum Vitae</h2>
                    {cvDoc && (
                      <div className="w-7 h-7 bg-teal rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {cvDoc ? (
                    <>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">
                            {cvDoc.fileName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {cvDoc.fileSize
                              ? `${(cvDoc.fileSize / (1024 * 1024)).toFixed(1)} MB`
                              : ''}{' '}
                            • Uploaded{' '}
                            {new Date(cvDoc.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={cvDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-navy transition-colors">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(cvDoc.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => cvInputRef.current?.click()}
                        disabled={uploadingType === 'CV'}
                        className="flex items-center gap-2 text-teal text-sm font-semibold hover:underline disabled:opacity-50">
                        <RefreshCw className="w-4 h-4" /> Replace CV
                      </button>
                    </>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-navy transition-colors"
                      onClick={() => cvInputRef.current?.click()}>
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-gray-400 mb-4">Max 5MB PDF only.</p>
                      {uploadingType === 'CV' ? (
                        <div className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-xl animate-pulse">
                          Uploading...
                        </div>
                      ) : (
                        <button className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-navy-light transition-colors">
                          Browse Files
                        </button>
                      )}
                    </div>
                  )}

                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileInput(e, 'CV')}
                  />
                </div>

                {/* Endorsement Letter Section */}
                <div
                  className={`bg-white rounded-2xl p-6 border-2 transition-colors shadow-sm ${
                    dragOver === 'LETTER'
                      ? 'border-navy bg-blue-50'
                      : letterDoc
                      ? 'border-gray-100'
                      : 'border-dashed border-gray-200'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver('LETTER'); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, 'LETTER')}>

                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-navy">Endorsement Letter</h2>
                    {letterDoc && (
                      <div className="w-7 h-7 bg-teal rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {letterDoc ? (
                    <>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">
                            {letterDoc.fileName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {letterDoc.fileSize
                              ? `${(letterDoc.fileSize / (1024 * 1024)).toFixed(1)} MB`
                              : ''}{' '}
                            • Uploaded{' '}
                            {new Date(letterDoc.uploadedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={letterDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-navy transition-colors">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(letterDoc.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => letterInputRef.current?.click()}
                        disabled={uploadingType === 'LETTER'}
                        className="flex items-center gap-2 text-teal text-sm font-semibold hover:underline disabled:opacity-50">
                        <RefreshCw className="w-4 h-4" /> Replace Letter
                      </button>
                    </>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center py-10 cursor-pointer"
                      onClick={() => letterInputRef.current?.click()}>
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-xs text-gray-400 mb-4">Max 5MB PDF only.</p>
                      {uploadingType === 'LETTER' ? (
                        <div className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-xl animate-pulse">
                          Uploading...
                        </div>
                      ) : (
                        <button className="bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-navy-light transition-colors">
                          Browse Files
                        </button>
                      )}
                    </div>
                  )}

                  <input
                    ref={letterInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileInput(e, 'LETTER')}
                  />
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 leading-5">
                  Documents uploaded here are automatically attached to your
                  internship applications. Ensure they are up to date before
                  submitting new applications.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;