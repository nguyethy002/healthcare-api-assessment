const RiskScorer = require('./risk-scorer');
const Logger = require('./utils/logger');

class PatientAnalyzer {
  constructor() {
    this.riskScorer = new RiskScorer();
  }

  analyzePatients(patients) {
    Logger.info(`Analyzing ${patients.length} patients...`);

    const analysis = this._processPatients(patients);
    const results = this._createResults(analysis, patients.length);

    Logger.summary('Analysis Results', {
      'Total patients': results.summary.totalPatients,
      'High-risk patients': results.summary.highRiskCount,
      'Fever patients': results.summary.feverCount,
      'Data quality issues': results.summary.dataQualityIssuesCount
    });

    return results;
  }

  debugPatient(patient) {
    const analysis = this._analyzeSinglePatient(patient);

    Logger.debug(`\nDebug Analysis for Patient ${patient.patient_id}:`);
    Logger.debug(`- Blood Pressure: ${patient.blood_pressure} (Risk: ${analysis.bpRisk})`);
    Logger.debug(`- Temperature: ${patient.temperature} (Risk: ${analysis.tempRisk})`);
    Logger.debug(`- Age: ${patient.age} (Risk: ${analysis.ageRisk})`);
    Logger.debug(`- Total Risk Score: ${analysis.totalRisk}`);
    Logger.debug(`- Has Fever: ${analysis.hasFever}`);
    Logger.debug(`- Data Quality Issues: ${analysis.hasDataQualityIssues}`);
    Logger.debug(`- Is High Risk: ${analysis.isHighRisk}`);
  }

  showSampleAnalysis(patients, sampleSize = 5) {
    Logger.debug(`\nSample Analysis (first ${sampleSize} patients):`);
    patients.slice(0, sampleSize).forEach(patient => {
      this.debugPatient(patient);
    });
  }

  // Private helper methods
  _analyzeSinglePatient(patient) {
    const bpRisk = this.riskScorer.calculateBloodPressureRisk(patient.blood_pressure);
    const tempRisk = this.riskScorer.calculateTemperatureRisk(patient.temperature);
    const ageRisk = this.riskScorer.calculateAgeRisk(patient.age);
    const totalRisk = bpRisk + tempRisk + ageRisk;

    return {
      bpRisk,
      tempRisk,
      ageRisk,
      totalRisk,
      hasFever: this.riskScorer.hasFever(patient),
      hasDataQualityIssues: this.riskScorer.hasDataQualityIssues(patient),
      isHighRisk: totalRisk >= 4
    };
  }

  _processPatients(patients) {
    const analysis = {
      highRiskPatients: [],
      feverPatients: [],
      dataQualityIssues: []
    };

    // Single pass through patients for better performance
    patients.forEach(patient => {
      const patientAnalysis = this._analyzeSinglePatient(patient);
      
      if (patientAnalysis.isHighRisk) {
        analysis.highRiskPatients.push(patient.patient_id);
      }

      if (patientAnalysis.hasFever) {
        analysis.feverPatients.push(patient.patient_id);
      }

      if (patientAnalysis.hasDataQualityIssues) {
        analysis.dataQualityIssues.push(patient.patient_id);
      }
    });

    // Sort arrays for consistent output
    analysis.highRiskPatients.sort();
    analysis.feverPatients.sort();
    analysis.dataQualityIssues.sort();

    return analysis;
  }

  _createResults(analysis, totalPatients) {
    return {
      highRiskPatients: analysis.highRiskPatients,
      feverPatients: analysis.feverPatients,
      dataQualityIssues: analysis.dataQualityIssues,
      summary: {
        totalPatients,
        highRiskCount: analysis.highRiskPatients.length,
        feverCount: analysis.feverPatients.length,
        dataQualityIssuesCount: analysis.dataQualityIssues.length
      }
    };
  }
}

module.exports = PatientAnalyzer; 