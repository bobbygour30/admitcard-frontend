import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../axiosConfig';
import { ChevronRight, User, FileText, Upload, AlertCircle } from 'lucide-react';

interface FormData {
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
}

const postOptions = [
  'State Manager (Sales and Marketing)',
  'District Manager (Agri Business Management)',
  'District Manager (Sales and Marketing)',
  'District Manager (Finance and Accountant)',
  'Assistant Manager',
  'Supervisor',
  'Support Product',
  'Data Entry Operator',
  'Office Boy',
];

const haritDistrictOptions = [
  'Patna',
  'Vaishali',
  'Samasatipur',
  'Begusarai',
  'Nalanda',
  'Buxar',
  'Bhojpur',
];

const tirhutDistrictOptions = [
  'Sheohar',
  'East Champaran',
  'West Champaran',
  'Muzaffarpur',
  'Siwan',
  'Gopalganj',
  'Saran',
  'Patna',
];

const unionOptions = ['Harit Union', 'Tirhut Union'];
const educationOptions = ['10', '12th', 'Graduate', 'Postgraduate'];

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm<FormData>({
    defaultValues: {
      union: '',
      name: '',
      fatherName: '',
      motherName: '',
      dob: '',
      gender: '',
      email: '',
      mobile: '',
      address: '',
      aadhaarNumber: '',
      selectedPosts: [],
      districtPreferences: [],
      higherEducation: '',
      percentage: '',
      postDesignation: '',
      organizationName: '',
      totalExperience: '',
    },
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [cv, setCv] = useState<string | null>(null);
  const [workCert, setWorkCert] = useState<string | null>(null);
  const [qualCert, setQualCert] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [workCertError, setWorkCertError] = useState<string | null>(null);
  const [qualCertError, setQualCertError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedUnion = watch('union');
  const districtOptions = selectedUnion === 'Tirhut Union' ? tirhutDistrictOptions : haritDistrictOptions;

  // Disable form only for Harit Union
  const isFormDisabled = selectedUnion === 'Harit Union';

  useEffect(() => {
    resetField('districtPreferences');
  }, [selectedUnion, resetField]);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (data: string | null) => void,
    setError: (error: string | null) => void,
    maxSize: number,
    allowedTypes: string[],
    errorMessage: string
  ) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File size should not exceed ${maxSize / 1024}KB`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(errorMessage);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    setApiError(null);

    if (!photo) {
      setPhotoError('Photo is required');
      return;
    }

    if (!signature) {
      setSignatureError('Signature is required');
      return;
    }

    if (!qualCert) {
      setQualCertError('Higher Qualification Certificate is required');
      return;
    }

    if (!data.districtPreferences || data.districtPreferences.length === 0) {
      setApiError('Please select at least one district preference');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        photo,
        signature,
        cv,
        workCert,
        qualCert,
      };

      const response = await axios.post('/registration/register', payload);
      navigate('/upload-documents', { state: { applicationNumber: response.data.applicationNumber } });
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Registration Form
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
              Union Selection
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Union <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                {unionOptions.map((union) => (
                  <label
                    key={union}
                    className={`relative flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      selectedUnion === union
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={union}
                      className="hidden"
                      {...register('union', { required: 'Please select a union' })}
                    />
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{union}</span>
                    </div>
                    <div
                      className={`absolute top-2 right-2 w-4 h-4 rounded-full transition-all duration-300 ${
                        selectedUnion === union ? 'bg-blue-600 scale-100' : 'bg-gray-300 scale-0'
                      }`}
                    ></div>
                  </label>
                ))}
              </div>
              {errors.union && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.union.message}
                </p>
              )}
            </div>
          </div>

          {isFormDisabled ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-700">
                Thank you for your response. We will get back to you very soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.fatherName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('fatherName', { required: "Father's name is required" })}
                    />
                    {errors.fatherName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.motherName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('motherName', { required: "Mother's name is required" })}
                    />
                    {errors.motherName && (
                      <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full p-2 border rounded-md ${
                        errors.dob ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('dob', { required: 'Date of birth is required' })}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-2 border rounded-md ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('gender', { required: 'Gender is required' })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`w-full p-2 border rounded-md ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('mobile', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Mobile number must be 10 digits',
                        },
                      })}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('aadhaarNumber', {
                        required: 'Aadhaar number is required',
                        pattern: {
                          value: /^[0-9]{12}$/,
                          message: 'Aadhaar number must be 12 digits',
                        },
                      })}
                    />
                    {errors.aadhaarNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className={`w-full p-2 border rounded-md ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('address', { required: 'Address is required' })}
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Higher Education Qualification Detail <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Higher Education <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full p-2 border rounded-md ${
                        errors.higherEducation ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('higherEducation', { required: 'Higher education is required' })}
                    >
                      <option value="">Select Education</option>
                      {educationOptions.map((edu) => (
                        <option key={edu} value={edu}>{edu}</option>
                      ))}
                    </select>
                    {errors.higherEducation && (
                      <p className="text-red-500 text-xs mt-1">{errors.higherEducation.message}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage/CGPA/GPA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors.percentage ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register('percentage', {
                        required: 'Percentage is required',
                        pattern: {
                          value: /^(?:100|[0-9]{1,2})(\.[0-9]{1,2})?$/,
                          message: 'Enter a valid percentage (0-100)',
                        },
                      })}
                    />
                    {errors.percentage && (
                      <p className="text-red-500 text-xs mt-1">{errors.percentage.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Work Experience (Required for District and State Manager posts only)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Post/Designation
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('postDesignation')}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('organizationName')}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Experience (In Years)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('totalExperience', {
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: 'Enter a valid number of years (e.g., 2, 2.5)',
                        },
                      })}
                    />
                    {errors.totalExperience && (
                      <p className="text-red-500 text-xs mt-1">{errors.totalExperience.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Post Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postOptions.map((post) => (
                    <div key={post} className="flex items-center">
                      <input
                        type="checkbox"
                        id={post}
                        value={post}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        {...register('selectedPosts')}
                      />
                      <label htmlFor={post} className="ml-2 text-sm text-gray-700">
                        {post}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Job Location Preference <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">Select one or more district preferences</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {districtOptions.map((district) => (
                    <div key={district} className="flex items-center">
                      <input
                        type="checkbox"
                        id={district}
                        value={district}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        {...register('districtPreferences', { required: 'Please select at least one district' })}
                      />
                      <label htmlFor={district} className="ml-2 text-sm text-gray-700">
                        {district}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.districtPreferences && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.districtPreferences.message}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-700">
                  Document Upload
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Photo <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      JPG/PNG format, max size 200KB, dimensions 3.5cm x 4.5cm
                    </p>

                    <div className="mb-3 flex justify-center">
                      <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        {photo ? (
                          <img src={photo} alt="Uploaded photo" className="max-w-full max-h-full" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              setPhoto,
                              setPhotoError,
                              200 * 1024,
                              ['image/jpeg', 'image/png'],
                              'Only JPG and PNG formats are accepted'
                            )
                          }
                        />
                      </label>
                    </div>

                    {photoError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {photoError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Signature <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      JPG/PNG format, max size 100KB, dimensions 3.5cm x 1.5cm
                    </p>

                    <div className="mb-3 flex justify-center">
                      <div className="w-32 h-16 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        {signature ? (
                          <img src={signature} alt="Uploaded signature" className="max-w-full max-h-full" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                        <span>Choose Signature</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              setSignature,
                              setSignatureError,
                              100 * 1024,
                              ['image/jpeg', 'image/png'],
                              'Only JPG and PNG formats are accepted'
                            )
                          }
                        />
                      </label>
                    </div>

                    {signatureError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {signatureError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload CV/Resume (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      JPG/PNG/PDF format, max size 2MB
                    </p>

                    <div className="mb-3 flex justify-center">
                      <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        {cv ? (
                          cv.startsWith('data:image') ? (
                            <img src={cv} alt="Uploaded CV" className="max-w-full max-h-full" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                        <span>Choose CV/Resume</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              setCv,
                              setCvError,
                              2 * 1024 * 1024,
                              ['image/jpeg', 'image/png', 'application/pdf'],
                              'Only JPG, PNG, or PDF formats are accepted'
                            )
                          }
                        />
                      </label>
                    </div>

                    {cvError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {cvError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Work Experience Certificate (Only required for State and District Manager Posts)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      JPG/PNG/PDF format, max size 2MB
                    </p>

                    <div className="mb-3 flex justify-center">
                      <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        {workCert ? (
                          workCert.startsWith('data:image') ? (
                            <img src={workCert} alt="Uploaded work certificate" className="max-w-full max-h-full" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                        <span>Choose Work Certificate</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              setWorkCert,
                              setWorkCertError,
                              2 * 1024 * 1024,
                              ['image/jpeg', 'image/png', 'application/pdf'],
                              'Only JPG, PNG, or PDF formats are accepted'
                            )
                          }
                        />
                      </label>
                    </div>

                    {workCertError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {workCertError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Higher Qualification Certificate <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      JPG/PNG/PDF format, max size 2MB
                    </p>

                    <div className="mb-3 flex justify-center">
                      <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        {qualCert ? (
                          qualCert.startsWith('data:image') ? (
                            <img src={qualCert} alt="Uploaded qualification certificate" className="max-w-full max-h-full" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition-colors duration-200">
                        <span>Choose Qualification Certificate</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              setQualCert,
                              setQualCertError,
                              2 * 1024 * 1024,
                              ['image/jpeg', 'image/png', 'application/pdf'],
                              'Only JPG, PNG, or PDF formats are accepted'
                            )
                          }
                        />
                      </label>
                    </div>

                    {qualCertError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {qualCertError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-semibold flex items-center text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold flex items-center text-sm transition-colors duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Next: Upload Documents
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;