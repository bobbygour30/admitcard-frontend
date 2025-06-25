import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../axiosConfig';
import { Users, FileText, LogOut, Download, Trash2, Eye, X } from 'lucide-react';

interface Registration {
  _id: string;
  applicationNumber: string;
  union: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  address: string;
  aadhaarNumber: string;
  selectedPosts: string[];
  districtPreferences: string[];
  higherEducation: string;
  percentage: string;
  postDesignation?: string;
  organizationName?: string;
  totalExperience?: string;
  examCenter: string;
  examShift: string;
  paymentStatus?: boolean;
  transactionNumber?: string;
  transactionDate?: string;
  photo?: string;
  signature?: string;
  cv?: string;
  workCert?: string;
  qualCert?: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState<{ url: string; type: 'image' | 'pdf' } | null>(null);
  const usersPerPage = 30;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const payload = { username: 'admin@examportal.com', password: 'Admin@2024#' };
        const response = await axios.post('/registration/users', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        setRegistrations(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (applicationNumber: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setIsLoading(true);
      await axios.delete(`/registration/users/${applicationNumber}`, {
        data: { username: 'admin@examportal.com', password: 'Admin@2024#' },
        headers: { 'Content-Type': 'application/json' },
      });
      setRegistrations(registrations.filter((reg) => reg.applicationNumber !== applicationNumber));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFile = (url: string, type: 'image' | 'pdf') => {
    setModalContent({ url, type });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const filteredRegistrations = registrations.filter((reg) =>
    (reg.applicationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.fatherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.motherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.union || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.aadhaarNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredRegistrations.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredRegistrations.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="w-8 h-8 mr-2 text-blue-600" />
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by application number, name, email, etc..."
            className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700">
            Search
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Application No.',
                      'Union',
                      'Name',
                      'Father\'s Name',
                      'Mother\'s Name',
                      'DOB',
                      'Gender',
                      'Email',
                      'Mobile',
                      'Address',
                      'Aadhaar Number',
                      'Selected Posts',
                      'District Preferences',
                      'Higher Education',
                      'Percentage',
                      'Post Designation',
                      'Organization',
                      'Experience',
                      'Exam Center',
                      'Shift',
                      'Payment Status',
                      'Transaction No.',
                      'Transaction Date',
                      'Files',
                      'Actions',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((registration) => (
                    <tr key={registration.applicationNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.applicationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.union || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.fatherName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.motherName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.dob || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.gender || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.mobile}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{registration.address || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.aadhaarNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Array.isArray(registration.selectedPosts) && registration.selectedPosts.length > 0
                          ? registration.selectedPosts.join(', ')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Array.isArray(registration.districtPreferences) &&
                        registration.districtPreferences.length > 0
                          ? registration.districtPreferences.join(', ')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.higherEducation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.percentage || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.postDesignation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.organizationName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.totalExperience || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{registration.examCenter}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.examShift}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registration.paymentStatus
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {registration.paymentStatus ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.transactionNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.transactionDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col space-y-2">
                          {registration.photo && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewFile(registration.photo!, 'image')}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Photo"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(registration.photo!, `${registration.applicationNumber}_photo.jpg`)
                                }
                                className="text-green-600 hover:text-green-800"
                                title="Download Photo"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {registration.signature && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewFile(registration.signature!, 'image')}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Signature"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(
                                    registration.signature!,
                                    `${registration.applicationNumber}_signature.jpg`
                                  )
                                }
                                className="text-green-600 hover:text-green-800"
                                title="Download Signature"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {registration.qualCert && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewFile(registration.qualCert!, 'pdf')}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Qualification Certificate"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(
                                    registration.qualCert!,
                                    `${registration.applicationNumber}_qualCert.pdf`
                                  )
                                }
                                className="text-green-600 hover:text-green-800"
                                title="Download Qualification Certificate"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {registration.cv && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewFile(registration.cv!, 'pdf')}
                                className="text-blue-600 hover:text-blue-800"
                                title="View CV"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(registration.cv!, `${registration.applicationNumber}_cv.pdf`)
                                }
                                className="text-green-600 hover:text-green-800"
                                title="Download CV"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {registration.workCert && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewFile(registration.workCert!, 'pdf')}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Work Certificate"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(
                                    registration.workCert!,
                                    `${registration.applicationNumber}_workCert.pdf`
                                  )
                                }
                                className="text-green-600 hover:text-green-800"
                                title="Download Work Certificate"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              window.open(`/admit-card/${registration.applicationNumber}`, '_blank')
                            }
                            title="View Admit Card"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(registration.applicationNumber)}
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            {modalContent.type === 'image' ? (
              <img src={modalContent.url} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
            ) : (
              <iframe
                src={modalContent.url}
                className="w-full h-[80vh]"
                title="PDF Preview"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;