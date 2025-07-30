const { RISK_THRESHOLDS } = require('./constants');
const Validators = require('./utils/validators');

class RiskScorer {
  calculateBloodPressureRisk(bloodPressure) {
    if (!Validators.isValidBloodPressure(bloodPressure)) {
      return 0;
    }

    const bp = Validators.parseBloodPressure(bloodPressure);
    const { systolic, diastolic } = bp;

    // Determine risk stage based on the higher risk category
    const systolicRisk = this._calculateSystolicRisk(systolic);
    const diastolicRisk = this._calculateDiastolicRisk(diastolic);

    return Math.max(systolicRisk, diastolicRisk);
  }

  calculateTemperatureRisk(temperature) {
    if (!Validators.isValidTemperature(temperature)) {
      return 0;
    }

    const temp = parseFloat(temperature);
    const { TEMPERATURE, RISK_SCORES } = RISK_THRESHOLDS;

    if (temp <= TEMPERATURE.NORMAL_MAX) return RISK_SCORES.TEMPERATURE.NORMAL;
    if (temp >= TEMPERATURE.LOW_FEVER_MIN && temp <= TEMPERATURE.LOW_FEVER_MAX) return RISK_SCORES.TEMPERATURE.LOW_FEVER;
    if (temp >= TEMPERATURE.HIGH_FEVER_MIN) return RISK_SCORES.TEMPERATURE.HIGH_FEVER;

    return RISK_SCORES.TEMPERATURE.NORMAL;
  }

  calculateAgeRisk(age) {
    if (!Validators.isValidAge(age)) {
      return 0;
    }

    const ageNum = parseInt(age);
    const { AGE, RISK_SCORES } = RISK_THRESHOLDS;

    if (ageNum <= AGE.UNDER_40_MAX) return RISK_SCORES.AGE.UNDER_40;
    if (ageNum >= AGE.FORTY_TO_65_MIN && ageNum <= AGE.FORTY_TO_65_MAX) return RISK_SCORES.AGE.FORTY_TO_65;
    if (ageNum >= AGE.OVER_65_MIN) return RISK_SCORES.AGE.OVER_65;

    return RISK_SCORES.AGE.UNDER_40;
  }

  calculateTotalRisk(patient) {
    const bpRisk = this.calculateBloodPressureRisk(patient.blood_pressure);
    const tempRisk = this.calculateTemperatureRisk(patient.temperature);
    const ageRisk = this.calculateAgeRisk(patient.age);

    return bpRisk + tempRisk + ageRisk;
  }

  hasDataQualityIssues(patient) {
    return !Validators.isValidBloodPressure(patient.blood_pressure) ||
           !Validators.isValidTemperature(patient.temperature) ||
           !Validators.isValidAge(patient.age);
  }

  hasFever(patient) {
    if (!Validators.isValidTemperature(patient.temperature)) {
      return false;
    }
    const temp = parseFloat(patient.temperature);
    return temp >= RISK_THRESHOLDS.TEMPERATURE.FEVER_THRESHOLD;
  }

  isHighRisk(patient) {
    const totalRisk = this.calculateTotalRisk(patient);
    return totalRisk >= RISK_THRESHOLDS.RISK_SCORES.HIGH_RISK_THRESHOLD;
  }

  // Private helper methods
  _calculateSystolicRisk(systolic) {
    const { BLOOD_PRESSURE, RISK_SCORES } = RISK_THRESHOLDS;

    if (systolic < BLOOD_PRESSURE.NORMAL_SYSTOLIC) return RISK_SCORES.BLOOD_PRESSURE.NORMAL;
    if (systolic >= BLOOD_PRESSURE.ELEVATED_SYSTOLIC_MIN && systolic <= BLOOD_PRESSURE.ELEVATED_SYSTOLIC_MAX) return RISK_SCORES.BLOOD_PRESSURE.ELEVATED;
    if (systolic >= BLOOD_PRESSURE.STAGE1_SYSTOLIC_MIN && systolic <= BLOOD_PRESSURE.STAGE1_SYSTOLIC_MAX) return RISK_SCORES.BLOOD_PRESSURE.STAGE1;
    if (systolic >= BLOOD_PRESSURE.STAGE2_SYSTOLIC_MIN) return RISK_SCORES.BLOOD_PRESSURE.STAGE2;

    return RISK_SCORES.BLOOD_PRESSURE.NORMAL;
  }

  _calculateDiastolicRisk(diastolic) {
    const { BLOOD_PRESSURE, RISK_SCORES } = RISK_THRESHOLDS;

    if (diastolic < BLOOD_PRESSURE.NORMAL_DIASTOLIC) return RISK_SCORES.BLOOD_PRESSURE.NORMAL;
    if (diastolic >= BLOOD_PRESSURE.STAGE1_DIASTOLIC_MIN && diastolic <= BLOOD_PRESSURE.STAGE1_DIASTOLIC_MAX) return RISK_SCORES.BLOOD_PRESSURE.STAGE1;
    if (diastolic >= BLOOD_PRESSURE.STAGE2_DIASTOLIC_MIN) return RISK_SCORES.BLOOD_PRESSURE.STAGE2;

    return RISK_SCORES.BLOOD_PRESSURE.NORMAL;
  }
}

module.exports = RiskScorer; 