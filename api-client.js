const axios = require('axios');
const config = require('./config');
const { API_CONFIG, COMMON } = require('./constants');
const Logger = require('./utils/logger');

class HealthcareAPIClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.BASE_URL,
      headers: {
        'x-api-key': config.API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: API_CONFIG.REQUEST_TIMEOUT
    });
  }

  async makeRequest(endpoint, params = {}, maxRetries = API_CONFIG.RETRY_ATTEMPTS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.progress(`Attempt ${attempt}: Making request to ${endpoint}`);
        const response = await this.client.get(endpoint, { params });
        return response.data;
      } catch (error) {
        Logger.warning(`Attempt ${attempt} failed: ${error.response?.status || error.message}`);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        const waitTime = Math.pow(COMMON.EXPONENTIAL_BASE, attempt) * 1000;
        Logger.progress(`Waiting ${waitTime}ms before retry...`);
        await this._delay(waitTime);
      }
    }
  }

  async getPatients(page = 1, limit = config.DEFAULT_LIMIT) {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PATIENTS, { page, limit });
  }

  async getAllPatients() {
    const allPatients = [];
    let currentPage = 1;
    let hasNext = true;

    Logger.info('Starting to fetch all patients...');

    while (hasNext) {
      try {
        const response = await this.getPatients(currentPage, config.MAX_LIMIT);
        const { patientsArray, hasNextPage } = this._parseResponse(response, currentPage);
        
        allPatients.push(...patientsArray);
        hasNext = hasNextPage;
        currentPage++;
        
        Logger.success(`Fetched page ${currentPage - 1}: ${patientsArray.length} patients`);
        
        await this._delay(COMMON.DELAY_MS);
        
      } catch (error) {
        Logger.error(`Error fetching page ${currentPage}: ${error.message}`);
        throw error;
      }
    }

    Logger.success(`Total patients fetched: ${allPatients.length}`);
    return allPatients;
  }

  async submitAssessment(highRiskPatients, feverPatients, dataQualityIssues) {
    const payload = {
      high_risk_patients: highRiskPatients,
      fever_patients: feverPatients,
      data_quality_issues: dataQualityIssues
    };

    Logger.debug(`Submitting payload: ${JSON.stringify(payload, null, 2)}`);

    try {
      const response = await this.client.post(API_CONFIG.ENDPOINTS.SUBMIT_ASSESSMENT, payload);
      return response.data;
    } catch (error) {
      Logger.error(`Error submitting assessment: ${error.response?.data || error.message}`);
      if (error.response?.data) {
        Logger.debug(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      throw error;
    }
  }

  // Private helper methods
  _parseResponse(response, currentPage) {
    let patientsArray = null;
    let hasNextPage = false;
    
    if (response.data && Array.isArray(response.data)) {
      patientsArray = response.data;
      hasNextPage = response.pagination?.hasNext || false;
    } else if (response.patients && Array.isArray(response.patients)) {
      patientsArray = response.patients;
      hasNextPage = response.current_page < Math.ceil(response.total_records / response.per_page);
    }
    
    if (!patientsArray) {
      throw new Error(`Invalid response format on page ${currentPage}`);
    }
    
    return { patientsArray, hasNextPage };
  }

  async _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = HealthcareAPIClient; 