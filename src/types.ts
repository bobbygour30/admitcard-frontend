export interface PersonalInfo {
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
  collegeBoard?: string;
  percentage?: string;
  postDesignation?: string;
  timeInYears?: string;
}

export interface RegistrationData {
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
  photo: string;
  signature: string;
  cv?: string;
  workCert?: string;
  qualCert: string;
  idProof?: string;
  examCenter: string;
  examShift: string;
  applicationNumber: string;
  paymentStatus?: boolean;
  transactionNumber?: string;
  transactionDate?: string;
}