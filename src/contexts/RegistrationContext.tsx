import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface Center {
  name: string;
  location: string;
  capacity: number;
  currentBookings: number;
}

interface Shift {
  id: number;
  name: string;
  time: string;
  date: string;
  capacity: number;
  currentBookings: number;
}

interface PersonalInfo {
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

interface RegistrationData {
  personalInfo: PersonalInfo;
  photo: string | null;
  signature: string | null;
  cv: string | null;
  workCert: string | null;
  qualCert: string | null;
  examCenter: string | null;
  examShift: string | null;
  applicationNumber: string | null;
  paymentStatus: boolean;
  transactionNumber: string | null;
  documents: {
    idProof: string | null;
    addressProof: string | null;
  };
}

const defaultRegistrationData: RegistrationData = {
  personalInfo: {
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
  photo: null,
  signature: null,
  cv: null,
  workCert: null,
  qualCert: null,
  examCenter: null,
  examShift: null,
  applicationNumber: null,
  paymentStatus: false,
  transactionNumber: null,
  documents: {
    idProof: null,
    addressProof: null,
  },
};

const centersData: Center[] = [
  { name: 'DAV Public School', location: 'Ranchi', capacity: 750, currentBookings: 0 },
  { name: 'St. Xavier\'s College', location: 'Ranchi', capacity: 750, currentBookings: 0 },
  { name: 'Delhi Public School', location: 'Bokaro', capacity: 750, currentBookings: 0 },
];

const shiftsData: Shift[] = [
  { id: 1, name: 'A', time: '9:00 AM - 10:00 AM', date: '12-06-2025', capacity: 250, currentBookings: 0 },
  { id: 2, name: 'B', time: '12:00 PM - 1:00 PM', date: '12-06-2025', capacity: 250, currentBookings: 0 },
  { id: 3, name: 'C', time: '3:00 PM - 4:00 PM', date: '12-06-2025', capacity: 250, currentBookings: 0 },
];

interface RegistrationContextType {
  registrationData: RegistrationData;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updatePhoto: (photoUrl: string) => void;
  updateSignature: (signatureUrl: string) => void;
  updateCv: (cvUrl: string | null) => void;
  updateWorkCert: (workCertUrl: string | null) => void;
  updateQualCert: (qualCertUrl: string | null) => void;
  allocateExamCenter: () => void;
  generateApplicationNumber: () => string;
  updatePaymentStatus: (status: boolean, transactionNumber: string) => void;
  updateDocuments: (type: 'idProof' | 'addressProof', url: string) => void;
  centers: Center[];
  shifts: Shift[];
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(defaultRegistrationData);
  const [centers, setCenters] = useState<Center[]>(centersData);
  const [shifts, setShifts] = useState<Shift[]>(shiftsData);

  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    setRegistrationData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...data,
      },
    }));
  };

  const updatePhoto = (photoUrl: string) => {
    setRegistrationData(prev => ({
      ...prev,
      photo: photoUrl,
    }));
  };

  const updateSignature = (signatureUrl: string) => {
    setRegistrationData(prev => ({
      ...prev,
      signature: signatureUrl,
    }));
  };

  const updateCv = (cvUrl: string | null) => {
    setRegistrationData(prev => ({
      ...prev,
      cv: cvUrl,
    }));
  };

  const updateWorkCert = (workCertUrl: string | null) => {
    setRegistrationData(prev => ({
      ...prev,
      workCert: workCertUrl,
    }));
  };

  const updateQualCert = (qualCertUrl: string | null) => {
    setRegistrationData(prev => ({
      ...prev,
      qualCert: qualCertUrl,
    }));
  };

  const allocateExamCenter = () => {
    const availableCenters = centers.filter(center => center.currentBookings < center.capacity);
    if (availableCenters.length === 0) {
      throw new Error('No available centers');
    }
    
    const centerWithLeastBookings = availableCenters.sort((a, b) => 
      a.currentBookings - b.currentBookings
    )[0];

    const availableShifts = shifts.filter(shift => shift.currentBookings < shift.capacity);
    if (availableShifts.length === 0) {
      throw new Error('No available shifts');
    }
    
    const shiftWithLeastBookings = availableShifts.sort((a, b) => 
      a.currentBookings - b.currentBookings
    )[0];
    
    const updatedCenters = centers.map(center => {
      if (center.name === centerWithLeastBookings.name) {
        return {
          ...center,
          currentBookings: center.currentBookings + 1,
        };
      }
      return center;
    });

    const updatedShifts = shifts.map(shift => {
      if (shift.id === shiftWithLeastBookings.id) {
        return {
          ...shift,
          currentBookings: shift.currentBookings + 1,
        };
      }
      return shift;
    });

    setCenters(updatedCenters);
    setShifts(updatedShifts);

    setRegistrationData(prev => ({
      ...prev,
      examCenter: centerWithLeastBookings.name,
      examShift: `${shiftWithLeastBookings.name} (${shiftWithLeastBookings.time}, ${shiftWithLeastBookings.date})`,
    }));
  };

  const generateApplicationNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const applicationNumber = `CBT${randomNum}`;
    
    setRegistrationData(prev => ({
      ...prev,
      applicationNumber,
    }));

    return applicationNumber;
  };

  const updatePaymentStatus = (status: boolean, transactionNumber: string) => {
    setRegistrationData(prev => ({
      ...prev,
      paymentStatus: status,
      transactionNumber,
    }));
  };

  const updateDocuments = (type: 'idProof' | 'addressProof', url: string) => {
    setRegistrationData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: url,
      },
    }));
  };

  const value: RegistrationContextType = {
    registrationData,
    updatePersonalInfo,
    updatePhoto,
    updateSignature,
    updateCv,
    updateWorkCert,
    updateQualCert,
    allocateExamCenter,
    generateApplicationNumber,
    updatePaymentStatus,
    updateDocuments,
    centers,
    shifts,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};