
import { Link } from 'react-router-dom';
import { FileText, Upload, CreditCard, Download, AlertCircle, CheckCircle,  } from 'lucide-react';
// import assets from '../assets/assets';

const Homepage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <section>
        <img className='w-full rounded' src={assets.header} alt="" />
      </section> */}
      <section className="mb-12 mt-10">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Computer Based Test (CBT) - 2025</h1>
          <p className="text-xl mb-6">Generate your admit card by completing the registration process</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-md font-semibold transition-colors duration-200 text-center"
            >
              Register Now
            </Link>
            <Link 
              to="/admit-card" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 text-center"
            >
              Download Admit Card
            </Link>
          </div>
        </div>
      </section>
      

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registration Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProcessCard 
            icon={<FileText className="w-10 h-10 text-blue-600" />}
            title="Step 1: Fill Details"
            description="Complete the registration form with your personal information"
          />
          <ProcessCard 
            icon={<Upload className="w-10 h-10 text-blue-600" />}
            title="Step 2: Upload Documents"
            description="Upload your photo, signature and required documents"
          />
          <ProcessCard 
            icon={<CreditCard className="w-10 h-10 text-blue-600" />}
            title="Step 3: Make Payment"
            description="Pay the registration fee and verify your transaction"
          />
          <ProcessCard 
            icon={<Download className="w-10 h-10 text-blue-600" />}
            title="Step 4: Download Admit Card"
            description="Generate and download your exam admit card"
          />
        </div>
      </section>

      

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Important Instructions for Registration</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
  <Instruction 
    icon={<CheckCircle className="w-5 h-5 text-green-600" />}
    text="Read the Advertisement Carefully"
  />
  <Instruction 
    icon={<CheckCircle className="w-5 h-5 text-green-600" />}
    text="Enter Valid Email ID & Mobile Number"
  />
  <Instruction 
    icon={<CheckCircle className="w-5 h-5 text-green-600" />}
    text="Enter personal details (name, father’s name, date of birth, etc.) exactly as per your matriculation (10th class) certificate."
  />
  <Instruction 
    icon={<AlertCircle className="w-5 h-5 text-red-600" />}
    text="Keep scanned copies of Photos, Signature, Resume, Higher Educational certificate, Work Experience Certificate (Only applicable Post Graduate Posts), ID Proof, before beginning the application."
  />
  <Instruction 
    icon={<AlertCircle className="w-5 h-5 text-red-600" />}
    text="Please note that candidates are required to apply for one union at a time. After successfully completing the application process for one union, they may proceed to apply for the second union if desired."
  />
  <Instruction 
    icon={<AlertCircle className="w-5 h-5 text-red-600" />}
    text="An application fee of ₹600 is applicable for each union and must be paid separately during each application."
  />
  <Instruction 
    icon={<CheckCircle className="w-5 h-5 text-green-600" />}
    text="Regularly visit the official website https://naukriworld.co.in for notifications regarding admit card, exam dates, and further instructions."
  />
  <Instruction 
    icon={<CheckCircle className="w-5 h-5 text-green-600" />}
    text="For any technical issues, contact the helpdesk number or email provided on the portal."
  />
</div>
        </div>
      </section>
    </div>
  );
};

interface ProcessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};





interface InstructionProps {
  icon: React.ReactNode;
  text: string;
}

const Instruction: React.FC<InstructionProps> = ({ icon, text }) => {
  return (
    <div className="flex items-start p-3 border rounded-md">
      <div className="mr-3 mt-0.5">{icon}</div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
};

export default Homepage;