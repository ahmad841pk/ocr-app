export const extractPakPassportMRZ = (text) => {
    const mrzLine1Regex = /P<[A-Z<]{5,}/;
    const mrzLine2Regex = /[A-Z0-9<]{8,10}[0-9][A-Z]{3}[0-9]{6}[0-9][MF<][0-9]{6}/;

    const lines = text
        .split("\n")
        .map(line => line.trim().replace(/\s/g, ""));

    const mrzLine1 = lines.find(line => mrzLine1Regex.test(line));
    const mrzLine2 = lines.find(line => mrzLine2Regex.test(line));

    if (!mrzLine1 || !mrzLine2) return null;

    const documentCode = mrzLine1.substring(0, 2).replace(/</g, '');
    const issuingCountry = mrzLine1.substring(2, 6).replace(/</g, '');
    const nameSection = mrzLine1.substring(5);
    const [lastNameRaw, firstNameRaw] = nameSection.split('<<');
    const lastName = lastNameRaw?.replace(/</g, '');
    const firstNames = firstNameRaw?.replace(/</g, ' ').trim();

    const passportNumber = mrzLine2.substring(0, 9).replace(/</g, '');
    const passportNumberCheck = mrzLine2[9];
    const nationality = mrzLine2.substring(10, 13);
    const birthDate = mrzLine2.substring(13, 19);
    const birthDateCheck = mrzLine2[19];
    const sex = mrzLine2[20];
    const expiryDate = mrzLine2.substring(21, 27);
    const expiryDateCheck = mrzLine2[27];
    const personalNumber = mrzLine2.substring(28, 42).replace(/</g, '');
    const personalNumberCheck = mrzLine2[42];

    return {
        documentCode,
        issuingCountry,
        lastName,
        firstNames,
        passportNumber,
        passportNumberCheck,
        nationality,
        birthDate,
        birthDateCheck,
        sex,
        expiryDate,
        expiryDateCheck,
        personalNumber,
        personalNumberCheck,
        mrzLine1,
        mrzLine2,
    };
};
