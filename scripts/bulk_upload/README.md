# Bulk Upload System for CanonSafe™

Reusable character data ingestion system for client demos.

## Structure

```
bulk_upload/
├── README.md                   # This file
├── config.py                   # Configuration and settings
├── data_extractor.py           # Web scraping and data extraction
├── data_validator.py           # Validation and conflict detection
├── api_client.py               # CanonSafe API integration
├── test_generator.py           # Automatic test case generation
├── bulk_uploader.py            # Main orchestration script
└── brands/                     # Brand-specific configurations
    ├── peppa_pig_config.py
    ├── transformers_config.py
    └── ...
```

## Usage

```bash
# Activate virtual environment
source ../../venv/bin/activate

# Run bulk upload for Peppa Pig
python bulk_uploader.py --brand peppa_pig --env local

# With data quality review
python bulk_uploader.py --brand peppa_pig --review-mode

# Dry run (no API calls)
python bulk_uploader.py --brand peppa_pig --dry-run
```

## Configuration

Edit `brands/peppa_pig_config.py` to customize:
- Source URLs
- Organization/franchise names
- Demo account credentials
- Data extraction rules

## Features

- ✅ Web scraping with rate limiting
- ✅ Data quality scoring
- ✅ Conflict detection
- ✅ API integration
- ✅ Test case generation
- ✅ Progress tracking
- ✅ Error handling and retry logic
- ✅ Dry-run mode
