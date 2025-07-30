const HealthcareAPIClient = require('./api-client');
const PatientAnalyzer = require('./patient-analyzer');
const Logger = require('./utils/logger');
const { COMMON } = require('./constants');

class HealthcareAssessment {
  constructor() {
    this.apiClient = new HealthcareAPIClient();
    this.analyzer = new PatientAnalyzer();
  }

  async run() {
    try {
      Logger.info('Starting Healthcare API Assessment...\n');

      // Step 1: Fetch all patients
      Logger.step(1, 'Fetching patient data');
      const patients = await this.apiClient.getAllPatients();
      Logger.success(`Successfully fetched ${patients.length} patients\n`);

      // Step 2: Analyze patients and generate alert lists
      Logger.step(2, 'Analyzing patient data');
      const analysis = this.analyzer.analyzePatients(patients);
      Logger.success('Analysis complete\n');

      // Step 3: Show sample analysis for debugging
      Logger.step(3, 'Sample analysis for verification');
      this.analyzer.showSampleAnalysis(patients, COMMON.SAMPLE_SIZE);
      Logger.info('');

      // Step 4: Prepare submission data
      Logger.step(4, 'Preparing submission data');
      const submissionData = this._prepareSubmissionData(analysis);

      this._displayResults(submissionData);
      Logger.success('\nAssessment ready for submission!');
      Logger.info('To submit, call: await this.apiClient.submitAssessment(...)');

      return submissionData;

    } catch (error) {
      Logger.error(`Error during assessment: ${error.message}`);
      throw error;
    }
  }

  async submitAssessment(submissionData) {
    try {
      Logger.info('Submitting assessment...');
      const result = await this.apiClient.submitAssessment(
        submissionData.high_risk_patients,
        submissionData.fever_patients,
        submissionData.data_quality_issues
      );
      
      Logger.success('Submission successful!');
      Logger.info(`Results: ${JSON.stringify(result, null, 2)}`);
      
      return result;
    } catch (error) {
      Logger.error(`Submission failed: ${error.message}`);
      throw error;
    }
  }

  // Private helper methods
  _prepareSubmissionData(analysis) {
    return {
      high_risk_patients: analysis.highRiskPatients,
      fever_patients: analysis.feverPatients,
      data_quality_issues: analysis.dataQualityIssues
    };
  }

  _displayResults(submissionData) {
    Logger.summary('Submission Summary', {
      'High-risk patients': submissionData.high_risk_patients.length,
      'Fever patients': submissionData.fever_patients.length,
      'Data quality issues': submissionData.data_quality_issues.length
    });

    Logger.results('high-risk', submissionData.high_risk_patients);
    Logger.results('fever', submissionData.fever_patients);
    Logger.results('data-quality', submissionData.data_quality_issues);
  }
}

// Run the assessment
async function main() {
  const assessment = new HealthcareAssessment();
  const results = await assessment.run();
  
  // Uncomment the line below to actually submit the assessment
  await assessment.submitAssessment(results);
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = HealthcareAssessment; 