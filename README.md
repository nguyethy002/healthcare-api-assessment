# Healthcare API Assessment

A comprehensive patient risk scoring system that analyzes healthcare data from the DemoMed Healthcare API.

> **⚠️ Assessment Project**: This is a coding demonstration created for evaluation purposes. Not intended for production use in healthcare environments.

## Project Overview

This project implements a robust risk scoring system for healthcare patients based on:
- **Blood pressure readings** (0-4 points)
- **Temperature measurements** (0-2 points)  
- **Age demographics** (0-2 points)

The system processes patient data, calculates risk scores, and generates alert lists for high-risk patients, fever patients, and data quality issues.

### How It Works

1. **API Integration**: Connects to DemoMed Healthcare API with robust error handling
2. **Data Collection**: Fetches all patient data through pagination with retry logic
3. **Risk Assessment**: Analyzes each patient using comprehensive scoring algorithms
4. **Alert Generation**: Creates sorted lists of high-risk, fever, and data quality issues
5. **Result Preparation**: Formats data for submission to assessment API

### Key Capabilities

- **Handles Real-World API Challenges**: Rate limiting, intermittent failures, inconsistent responses
- **Accurate Risk Scoring**: Implements precise healthcare risk assessment algorithms
- **Data Quality Validation**: Identifies and flags invalid/missing patient data
- **Efficient Processing**: Single-pass analysis with optimized performance
- **Secure Configuration**: Environment-based configuration with validation

## Risk Scoring Logic

### Blood Pressure Risk (0-4 points)
- **Normal** (Systolic <120 AND Diastolic <80): 1 point
- **Elevated** (Systolic 120-129 AND Diastolic <80): 2 points
- **Stage 1** (Systolic 130-139 OR Diastolic 80-89): 3 points
- **Stage 2** (Systolic ≥140 OR Diastolic ≥90): 4 points
- **Invalid/Missing Data**: 0 points

### Temperature Risk (0-2 points)
- **Normal** (≤99.5°F): 0 points
- **Low Fever** (99.6-100.9°F): 1 point
- **High Fever** (≥101.0°F): 2 points
- **Invalid/Missing Data**: 0 points

### Age Risk (0-2 points)
- **Under 40** (<40 years): 1 point
- **40-65** (40-65 years, inclusive): 1 point
- **Over 65** (>65 years): 2 points
- **Invalid/Missing Data**: 0 points

### Total Risk Score
**Total Risk = (BP Score) + (Temp Score) + (Age Score)**

## Alert Categories

1. **High-Risk Patients**: Total risk score ≥ 4
2. **Fever Patients**: Temperature ≥ 99.6°F
3. **Data Quality Issues**: Patients with invalid/missing data

## Project Structure

```
├── index.js              # Main application entry point
├── api-client.js         # API client with retry logic
├── risk-scorer.js        # Risk scoring algorithms
├── patient-analyzer.js   # Patient analysis engine
├── config.js             # Configuration settings
├── constants.js          # Centralized constants and thresholds
├── utils/
│   ├── logger.js         # Centralized logging utility
│   └── validators.js     # Input validation utilities
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in git)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
# Create .env file
touch .env
```

Add your configuration:
```env
# Healthcare API Assessment Environment Variables
# REQUIRED: Your API authentication key
API_KEY=ak_5a6bbe4ad3f7c2658d00a4a5b5db20adfa43da017a03652f

# Optional: Override defaults if needed
BASE_URL=https://assessment.ksensetech.com/api
DEFAULT_LIMIT=5
MAX_LIMIT=20
```

### 3. Run the Assessment
```bash
npm start
```

## Usage

The application will:
1. **Fetch all patient data** from the API (with pagination)
2. **Analyze each patient** using the risk scoring algorithms
3. **Generate alert lists** for high-risk, fever, and data quality issues
4. **Display results** and prepare for submission

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_KEY` | ✅ Yes | - | Your API authentication key |
| `BASE_URL` | ❌ No | `https://assessment.ksensetech.com/api` | Base URL for the healthcare API |
| `DEFAULT_LIMIT` | ❌ No | `5` | Default number of patients per page |
| `MAX_LIMIT` | ❌ No | `20` | Maximum number of patients per page |

### Security Notes
- The `.env` file is automatically ignored by git
- **API_KEY is required** - the application will fail if not provided
- Never commit your actual API keys to version control
- The application validates required environment variables on startup

## API Behavior & Handling

### Real-World API Challenges

The DemoMed Healthcare API simulates real-world conditions that require robust handling:

#### **Rate Limiting (429 Errors)**
- **Challenge**: API may return 429 errors if requests are made too quickly
- **Solution**: Built-in delays between requests (100ms) to prevent rate limiting
- **Implementation**: Automatic delay after each page fetch in `api-client.js`

#### **Intermittent Failures (500/503 Errors)**
- **Challenge**: ~8% chance of 500/503 errors requiring retry logic
- **Solution**: Exponential backoff retry mechanism with 3 attempts
- **Implementation**: `makeRequest()` method with exponential backoff (2^attempt * 1000ms)

#### **Pagination Handling**
- **Challenge**: Returns 5 patients per page by default (~10 pages, ~50 patients total)
- **Solution**: Automatic pagination with configurable limits (max 20 per page)
- **Implementation**: `getAllPatients()` method with automatic page detection

#### **Inconsistent Response Formats**
- **Challenge**: API occasionally returns data in different formats or with missing fields
- **Solution**: Flexible response parsing that handles both `data` and `patients` formats
- **Implementation**: `_parseResponse()` method with format detection

### API Features

- **Authentication**: Uses API key for all requests
- **Retry Logic**: Handles intermittent 500/503 errors with exponential backoff
- **Rate Limiting**: Built-in delays to avoid 429 errors
- **Pagination**: Automatically fetches all pages of patient data
- **Error Handling**: Graceful degradation for invalid data
- **Response Flexibility**: Handles inconsistent API response formats

## Example Output

```
INFO: Starting Healthcare API Assessment...

Step 1: Fetching patient data...
SUCCESS: Successfully fetched 47 patients

Step 2: Analyzing patient data...
SUCCESS: Analysis complete

Submission Summary:
- High-risk patients: 31
- Fever patients: 9
- Data quality issues: 8

high-risk: ['DEMO001', 'DEMO002', 'DEMO006', ...]
fever: ['DEMO005', 'DEMO008', 'DEMO009', ...]
data-quality: ['DEMO004', 'DEMO005', 'DEMO007', ...]
```

## Sample Analysis

The application provides detailed analysis for verification:

```
Debug Analysis for Patient DEMO001:
- Blood Pressure: 120/80 (Risk: 3)
- Temperature: 98.6 (Risk: 0)
- Age: 45 (Risk: 1)
- Total Risk Score: 4
- Has Fever: false
- Data Quality Issues: false
- Is High Risk: true
```

## Submission

The system is ready to submit results to the assessment API. The submission data includes:

```javascript
{
  "high_risk_patients": ["DEMO001", "DEMO002", "DEMO006", ...],
  "fever_patients": ["DEMO005", "DEMO008", "DEMO009", ...],
  "data_quality_issues": ["DEMO004", "DEMO005", "DEMO007", ...]
}
```

**To submit**: Uncomment the submission line in `index.js` (line 89)

## Testing

To run the application and verify results:
```bash
npm start
```

## Notes

- **Submission is disabled by default** for safety
- **All patient IDs are sorted** for consistent output
- **Detailed debugging information** is available for verification
- **Environment variables** are used for secure configuration
- **Comprehensive error handling** for real-world API challenges

## Key Features

- ✅ **Real-world API integration** with authentication and retry logic
- ✅ **Robust error handling** for intermittent failures and rate limiting
- ✅ **Accurate risk scoring** algorithms for healthcare data
- ✅ **Data quality validation** with proper error detection
- ✅ **Clean, maintainable code** with comprehensive documentation
- ✅ **Secure configuration** using environment variables
- ✅ **Centralized logging** with consistent formatting
- ✅ **Input validation** utilities for data integrity
- ✅ **Constants management** for easy configuration
- ✅ **Optimized performance** with single-pass data processing
- ✅ **Modular architecture** with clear separation of concerns

## Code Quality Improvements

### Architecture
- **Separation of Concerns**: Each module has a single responsibility
- **Dependency Injection**: Components are loosely coupled
- **Error Boundaries**: Comprehensive error handling at each layer
- **Input Validation**: Robust data validation with clear error messages

### Performance
- **Single-Pass Processing**: Efficient patient analysis with one iteration
- **Cached Calculations**: Risk scores calculated once and reused
- **Optimized Logging**: Structured logging with minimal overhead
- **Memory Efficient**: No unnecessary object creation

### Maintainability
- **Constants Centralization**: All magic numbers and thresholds in one place
- **Consistent Logging**: Unified logging interface across the application
- **Clear Naming**: Descriptive method and variable names
- **Comprehensive Documentation**: Inline comments and clear structure

The implementation successfully demonstrates real-world API integration skills, robust error handling, and accurate data processing for healthcare risk assessment. 