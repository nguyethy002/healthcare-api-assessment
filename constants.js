// Risk scoring constants
const RISK_THRESHOLDS = {
  BLOOD_PRESSURE: {
    NORMAL_SYSTOLIC: 120,
    NORMAL_DIASTOLIC: 80,
    ELEVATED_SYSTOLIC_MIN: 120,
    ELEVATED_SYSTOLIC_MAX: 129,
    STAGE1_SYSTOLIC_MIN: 130,
    STAGE1_SYSTOLIC_MAX: 139,
    STAGE1_DIASTOLIC_MIN: 80,
    STAGE1_DIASTOLIC_MAX: 89,
    STAGE2_SYSTOLIC_MIN: 140,
    STAGE2_DIASTOLIC_MIN: 90
  },
  TEMPERATURE: {
    NORMAL_MAX: 99.5,
    LOW_FEVER_MIN: 99.6,
    LOW_FEVER_MAX: 100.9,
    HIGH_FEVER_MIN: 101.0,
    FEVER_THRESHOLD: 99.6
  },
  AGE: {
    UNDER_40_MAX: 39,
    FORTY_TO_65_MIN: 40,
    FORTY_TO_65_MAX: 65,
    OVER_65_MIN: 66
  },
  RISK_SCORES: {
    HIGH_RISK_THRESHOLD: 4,
    BLOOD_PRESSURE: {
      NORMAL: 1,
      ELEVATED: 2,
      STAGE1: 3,
      STAGE2: 4
    },
    TEMPERATURE: {
      NORMAL: 0,
      LOW_FEVER: 1,
      HIGH_FEVER: 2
    },
    AGE: {
      UNDER_40: 1,
      FORTY_TO_65: 1,
      OVER_65: 2
    }
  }
};

// Common constants
const COMMON = {
  DELAY_MS: 100,
  EXPONENTIAL_BASE: 2,
  SAMPLE_SIZE: 3
};

// API constants
const API_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT_DELAY: 100,
  REQUEST_TIMEOUT: 10000,
  ENDPOINTS: {
    PATIENTS: '/patients',
    SUBMIT_ASSESSMENT: '/submit-assessment'
  }
};

// Validation constants
const VALIDATION = {
  BLOOD_PRESSURE_FORMAT: '/',
  REQUIRED_FIELDS: ['patient_id', 'blood_pressure', 'temperature', 'age']
};

module.exports = {
  RISK_THRESHOLDS,
  API_CONFIG,
  VALIDATION,
  COMMON
}; 