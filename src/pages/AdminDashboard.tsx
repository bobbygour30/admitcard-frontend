import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../axiosConfig';
import { Users, FileText, LogOut } from 'lucide-react';

interface Registration {
  applicationNumber: string;
  name: string;
  email: string;
  mobile: string;
  examCenter: string;
  examShift: string;
  paymentStatus: boolean;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const payload = {
          username: 'admin@examportal.com',
          password: 'Admin@2024#',
        };
        console.log('Sending request to /registration/users with payload:', payload);
        const response = await axios.post('/registration/users', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Received response:', response.data);
        setRegistrations(response.data);
      } catch (err: any) {
        console.error('Error fetching users:', {
          message: err.message,
          status: err.status,
          response: err.response?.data,
          headers: err.config?.headers,
        });
        setError(err.response?.data?.message || 'Failed to load user data. Please try again.');
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by application number, name, or email..."
            className="w-full p-3 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Center
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.applicationNumber}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.applicationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.examCenter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.examShift}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.paymentStatus 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registration.paymentStatus ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => window.open(`/admit-card/${registration.applicationNumber}`, '_blank')}
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;