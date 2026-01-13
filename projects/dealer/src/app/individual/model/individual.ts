interface EmploymentDetails {
  comments: string;
  effectDtFrom: string; // ISO Date string
  effectDtTO: string; // ISO Date string
  employer: string;
  employmentInfoId: string;
  employmentStatus: string;
  grossIncome: number;
  isCurrent: boolean;
  jobTitle: string;
  occupationType: string;
  partyNo: number;
  primaryIncomeSource: string;
}

interface Email {
  type: string;
  value: string;
}

interface Phone {
  type: string;
  value: string;
}

interface PersonalDetails {
  countryOfBirth: string;
  countryOfIssue: string;
  dateOfBirth: string; // ISO Date string
  dependentsAge: string;
  emails: Email[];
  // isNewZealandResident:boolean,
  // countryOfCitizenship3:string;
  // countryOfCitizenship2:string;
  // countryOfCitizenship1:string;
  firstName: string;
  gender: string;
  knownAs: string;
  lastName: string;
  licenceNumber: string;
  licenceType: string;
  maritalStatus: string;
  middleName: string;
  noOfDependents: string;
  partyStatus: string;
  partyType: string[];
  phone: Phone[];
  phoneBusinessExtension: string;
  preferredContactMethod: string;
  reference: string;
  versionNumber: string;
  isNewZealandResident: any;
  countryOfCitizenship1: String;
  countryOfCitizenship2: String;
  countryOfCitizenship3: String;
  title?: string;
}

interface Individual {
  addressDetails: any; // Could be defined with more details if available
  businessIndividual: string;
  customerId: number;
  customerNo: number;
  role: number;
  employementDetails: EmploymentDetails[];
  financialDetails: any; // Could be defined with more details if available
  personalDetails: PersonalDetails;
  referenceDetails: any; // Could be defined with more details if available
  partyType:any;
}

export interface IndividualData {
  isConfirmed: boolean,
  business: any; // Could be defined with more details if available
  individual: Individual;
  contractId: number;
}
