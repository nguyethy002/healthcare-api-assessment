const { VALIDATION } = require('../constants');

class Validators {
  static isValidBloodPressure(bloodPressure) {
    if (!bloodPressure || typeof bloodPressure !== 'string') {
      return false;
    }

    const bpParts = bloodPressure.split(VALIDATION.BLOOD_PRESSURE_FORMAT);
    if (bpParts.length !== 2) {
      return false;
    }

    const systolic = parseInt(bpParts[0]);
    const diastolic = parseInt(bpParts[1]);

    return !isNaN(systolic) && !isNaN(diastolic);
  }

  static isValidTemperature(temperature) {
    if (temperature === null || temperature === undefined || temperature === '') {
      return false;
    }

    const temp = parseFloat(temperature);
    return !isNaN(temp);
  }

  static isValidAge(age) {
    if (age === null || age === undefined || age === '') {
      return false;
    }

    const ageNum = parseInt(age);
    return !isNaN(ageNum);
  }

  static isValidPatient(patient) {
    if (!patient || typeof patient !== 'object') {
      return false;
    }

    return VALIDATION.REQUIRED_FIELDS.every(field => 
      patient.hasOwnProperty(field) && patient[field] !== null && patient[field] !== undefined
    );
  }

  static parseBloodPressure(bloodPressure) {
    if (!this.isValidBloodPressure(bloodPressure)) {
      return null;
    }

    const bpParts = bloodPressure.split(VALIDATION.BLOOD_PRESSURE_FORMAT);
    return {
      systolic: parseInt(bpParts[0]),
      diastolic: parseInt(bpParts[1])
    };
  }
}

module.exports = Validators; 