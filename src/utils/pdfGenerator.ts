import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { RegistrationData } from "../types";

export const generateAdmitCardPDF = async (data: RegistrationData) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210;
  const maxHeight = 297;

  // Page 1: Candidate Details
  const page1 = document.createElement("div");
  page1.style.width = "210mm";
  page1.style.padding = "10mm";
  page1.style.fontFamily = "Times New Roman, Times, serif";
  page1.style.fontSize = "11pt";
  page1.style.lineHeight = "1.4";
  page1.style.backgroundColor = "#ffffff";
  page1.style.boxSizing = "border-box";
  page1.innerHTML = `
    <div style="border: 1px solid #000; padding: 8mm; border-radius: 5px;">
      <div style="text-align: center; color: #000000; margin-bottom: 8mm;">
        <p style="font-size: 14pt; font-weight: bold; margin: 0;">Recruitment to Various Posts</p>
        <p style="font-size: 12pt; margin: 2mm 0;">FOR</p>
        <p style="font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0;">Various Vegetable Cooperative Societies</p>
        <p style="font-size: 9pt; margin: 2mm 0;">(Registered Under Bihar Cooperative Society Act 1935)</p>
        <p style="font-size: 12pt; margin: 2mm 0;">BY</p>
        <p style="font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0;">${data.union === "Tirhut Union" ? "Shiva Protection Force Private Limited" : "Isha Protectional Security Guard Pvt Ltd"}</p>
        <div style="display: flex; justify-content: center; gap: 15mm; margin: 6mm 0;">
          <span style="font-size: 10pt;"><strong>Website:</strong> ${data.union === "Tirhut Union" ? "https://shivagroups.com" : "https://www.ishaprotectional.com"}</span>
          <span style="font-size: 10pt;"><strong>Email:</strong> ${data.union === "Tirhut Union" ? "spf_patna@shivagroups.com" : "ipsguard@yahoo.com"}</span>
        </div>
      </div>
      <div style="background-color: #e6e6e6; padding: 5mm; border: 1px solid #000; border-radius: 3px; margin-bottom: 8mm;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="font-size: 11pt; margin: 2mm 0;"><strong>CBT Roll No.:</strong> ${
              data.applicationNumber || "N/A"
            }</p>
            <p style="font-size: 11pt; margin: 2mm 0;">
  <strong>Admit Card for:</strong> ${data.union || "N/A"}${
    data.union === "Tirhut Union" ? "" : " Union"
  }
</p>
          </div>
          <div>
            <p style="font-size: 11pt; margin: 2mm 0;"><strong>Aadhaar No.:</strong> ${
              data.aadhaarNumber || "N/A"
            }</p>
            <p style="font-size: 11pt; margin: 2mm 0;"><strong>Highest Qualification:</strong> ${
              data.higherEducation || "N/A"
            }</p>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-bottom: 8mm;">
        <h2 style="font-size: 14pt; font-weight: bold; margin: 0; border-bottom: 2px solid #000; padding-bottom: 2mm;">Admit Card for Computer Based Test (CBT): June 2025</h2>
      </div>
      <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 10mm; margin-bottom: 8mm;">
        <div style="display: flex; flex-direction: column; gap: 4mm;">
          <p style="margin: 0;"><strong>Centre of CBT Exam:</strong> ${
            data.examCenter || "N/A"
          }</p>
          <p style="margin: 0;"><strong>Shift & Date of CBT Exam:</strong> ${
            data.examShift || "N/A"
          }</p>
          <p style="margin: 0;"><strong>Time of Gate-Entry:</strong> 60 minutes before shift start time</p>
          <p style="margin: 0;"><strong>Candidate's Name:</strong> ${
            data.name || "N/A"
          }</p>
          <p style="margin: 0;"><strong>Date of Birth:</strong> ${
            data.dob ? new Date(data.dob).toLocaleDateString("en-GB") : "N/A"
          }</p>
          <p style="margin: 0;"><strong>Gender:</strong> ${
            data.gender ? data.gender.toUpperCase() : "N/A"
          }</p>
          <p style="margin: 0;"><strong>Father's/Husband's Name:</strong> ${
            data.fatherName || "N/A"
          }</p>
          <p style="margin: 0;"><strong>Mother's Name:</strong> ${
            data.motherName || "N/A"
          }</p>
          <p style="margin: 0;"><strong>Posts Applied For:</strong></p>
          <ul style="list-style-type: disc; padding-left: 8mm; margin: 2mm 0;">
            ${
              data.selectedPosts?.length
                ? data.selectedPosts
                    .map((post) => `<li style="margin: 1mm 0;">${post}</li>`)
                    .join("")
                : '<li style="margin: 1mm 0;">N/A</li>'
            }
          </ul>
          <p style="margin: 0;"><strong>District Preferences:</strong> ${
            data.districtPreferences?.length
              ? data.districtPreferences.join(", ")
              : "N/A"
          }</p>
        </div>
        <div style="text-align: center; display: flex; flex-direction: column; gap: 4mm;">
          <img src="${
            data.photo || ""
          }" style="width: 45mm; height: 55mm; object-fit: contain; border: 1px solid #000; border-radius: 3px;" />
          <img src="${
            data.signature || ""
          }" style="width: 45mm; height: 12mm; object-fit: contain; border: 1px solid #000; border-radius: 3px;" />
          <p style="font-size: 9pt; margin: 2mm 0;">Signature of the Candidate</p>
        </div>
      </div>
      <div style="border-top: 1px solid #000; padding-top: 5mm; display: flex; justify-content: space-between;">
        <div>
          <div style="width: 60mm; height: 12mm; border-bottom: 1px solid #000;">
            <img src="${
              data.signature || ""
            }" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <p style="font-size: 9pt; margin: 2mm 0;">Signature of the Candidate</p>
        </div>
        <div style="text-align: right;">
          <div style="width: 60mm; height: 12mm; border-bottom: 1px solid #000;"></div>
          <p style="font-size: 9pt; margin: 2mm 0;">(To be signed in presence of the Invigilator)</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(page1);
  const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true });
  document.body.removeChild(page1);
  const imgData1 = canvas1.toDataURL("image/png");
  const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
  pdf.addImage(
    imgData1,
    "PNG",
    0,
    0,
    imgWidth,
    Math.min(imgHeight1, maxHeight)
  );

  // Page 2: Instructions
  pdf.addPage();
  const page2 = document.createElement("div");
  page2.style.width = "210mm";
  page2.style.padding = "10mm";
  page2.style.fontFamily = "Times New Roman, Times, serif";
  page2.style.fontSize = "11pt";
  page2.style.lineHeight = "1.4";
  page2.style.backgroundColor = "#ffffff";
  page2.style.boxSizing = "border-box";
  page2.innerHTML = `
    <div style="border: 1px solid #000; padding: 8mm; border-radius: 5px; height: calc(100% - 16mm);">
      <div style="text-align: center; margin-bottom: 8mm;">
        <h2 style="font-size: 14pt; font-weight: bold; margin: 0; border-bottom: 2px solid #000; padding-bottom: 2mm;">Admit Card for Computer Based Test (CBT): June 2025</h2>
      </div>
      <h3 style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 6mm 0; border-bottom: 1px solid #000; padding-bottom: 2mm;">Important Instructions for Candidates</h3>
      <div style="margin: 0;">
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">1.</span>
          <span style="flex: 1; text-align: justify;">Please check on the website <a href="http://www.naukriworld.co.in">www.naukriworld.co.in</a> for updates related to the exact exam date and exam center name by Wednesday 12th June 2025, 11PM on Notice page.</span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">2.</span>
          <span style="flex: 1; text-align: justify;">
            Candidates should bring the following documents, in addition to their Admit Card:
            <div style="margin: 3mm 0;">
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">a.</span>
                <span style="flex: 1;">Two copies of their latest colored photo (3 cm x 3.5 cm)</span>
              </div>
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">b.</span>
                <span style="flex: 1;">At least one photo identity proof in ORIGINAL with clear photograph (e.g. AADHAR Card, Driving License, University/College ID, Voter ID Card, PAN Card, etc)</span>
              </div>
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">c.</span>
                <span style="flex: 1;">Photocopy of identity proof mentioned at (b) above.</span>
              </div>
            </div>
            If a candidate fails to bring the above documents, he/she would not be admitted in the examination venue and his/her candidature could be cancelled.
          </span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">3.</span>
          <span style="flex: 1; text-align: justify;">The Admit Card is provisional, subject to verification of particulars during document verification.</span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">4.</span>
          <span style="flex: 1; text-align: justify;">Candidates are advised to reach the CBT 2025 exam center at least 1 hour before the exam starts, to avoid any unexpected delays.</span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">5.</span>
          <span style="flex: 1; text-align: justify;">Candidates should report directly to the examination hall/room, as per details mentioned on the Admit Card.</span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">6.</span>
          <span style="flex: 1; text-align: justify;">
            The entry of the Candidates inside the venue will ONLY be allowed:
            <div style="margin: 3mm 0;">
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">i.</span>
                <span style="flex: 1;">Between 8.00 AM - 8.30 AM for the first session,</span>
              </div>
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">ii.</span>
                <span style="flex: 1;">Between 11.00 AM - 11.30 AM for the second session, and</span>
              </div>
              <div style="display: flex; margin: 1mm 0;">
                <span style="width: 8mm; text-align: right; margin-right: 4mm;">iii.</span>
                <span style="flex: 1;">Between 2.00 PM - 2.30 PM for the third session.</span>
              </div>
            </div>
            Note: Candidates reaching the venue after entry closing time shall not be allowed to enter the examination venue.
          </span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">7.</span>
          <span style="flex: 1; text-align: justify;">
            Candidates are not allowed to carry any personal belongings or prohibited items including electronic devices, mobile phone, calculator etc. inside the examination hall. We will not be responsible for safe keeping of candidate's personal belongings.
          </span>
        </div>
        <div style="display: flex; margin-bottom: 4mm;">
          <span style="width: 8mm; text-align: right; margin-right: 4mm;">8.</span>
          <span style="flex: 1; text-align: justify;">
            For any query or clarification please email at <a href="mailto:writetogsgspl@gmail.com">writetogsgspl@gmail.com</a> or Call/WhatsApp at 01169270767.
          </span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(page2);
  const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true });
  document.body.removeChild(page2);
  const imgData2 = canvas2.toDataURL("image/png");
  const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;
  pdf.addImage(
    imgData2,
    "PNG",
    0,
    0,
    imgWidth,
    Math.min(imgHeight2, maxHeight)
  );

  pdf.save(`admit_card_${data.applicationNumber || "unknown"}.pdf`);
};
