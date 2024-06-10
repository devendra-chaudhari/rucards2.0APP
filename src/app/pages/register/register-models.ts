// Interface for PAN Card data
export interface PanCardData {
    pan_no: string;
    name: string;
    aadhaar_seeding: string;
    category: string;
    valid: boolean;
}


export interface SplitAddress {
    country: string;
    dist: string;
    house: string;
    landmark: string;
    pincode: string;
    po: string;
    state: string;
    street: string;
    subdist: string;
    vtc: string;
}

export interface AadhaarCard {
    address: string;
    care_of: string;
    dob: string;
    email: string;
    gender: string;
    message: string;
    name: string;
    photo_link: string;
    ref_id: string;
    split_address: SplitAddress;
    status: string;
    year_of_birth: string;
}



// Interface for Aadhaar Card data
export interface AadhaarCardData {
    data: AadhaarCard;
    message: string;
    success: boolean;

}

// Interface for Retailer data
export interface RetailerData {
    name: string;
    father_name: string;
    mobile_no: string;
    email: string;
    pan_no: string;
    aadhaar_no: string;
    dob: string;
    gender: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    role: string;
    address: string;
    otp: string;
    ref_id: string;
}
