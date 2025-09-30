#!/bin/bash

# Configuration Setup Script for React Application Insights Sample
# This script helps configure the sample with an existing Application Insights resource

set -e  # Exit on any error

# Default values
CONNECTION_STRING=""
RESOURCE_GROUP=""
APP_INSIGHTS_NAME=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to show usage
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Configures the React sample app with an existing Application Insights resource"
    echo ""
    echo "Options:"
    echo "  -c, --connection-string STR  Application Insights connection string"
    echo "  -g, --resource-group NAME    Resource group name (for workbook deployment)"
    echo "  -a, --app-insights NAME      Application Insights name (for workbook deployment)"
    echo "  -i, --interactive            Interactive mode to get connection string"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --interactive"
    echo "  $0 -c \"InstrumentationKey=xxx...\" -g myRG -a myAI"
}

# Function for interactive mode
interactive_setup() {
    print_header "Interactive Application Insights Setup"
    echo ""
    
    print_status "Prerequisites:"
    echo "  ✅ You have an existing Azure Application Insights resource"
    echo "  ✅ You have access to the Azure Portal"
    echo ""
    
    print_status "Steps to get your connection string:"
    echo "  1. Go to Azure Portal: https://portal.azure.com"
    echo "  2. Navigate to your Application Insights resource"
    echo "  3. Go to Overview tab"
    echo "  4. Copy the 'Connection String'"
    echo ""
    
    read -p "Enter your Application Insights connection string: " CONNECTION_STRING
    
    if [[ -z "$CONNECTION_STRING" ]]; then
        print_error "Connection string is required"
        exit 1
    fi
    
    echo ""
    print_status "Optional: For Azure Workbook deployment"
    read -p "Enter Resource Group name (optional): " RESOURCE_GROUP
    read -p "Enter Application Insights name (optional): " APP_INSIGHTS_NAME
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--connection-string)
            CONNECTION_STRING="$2"
            shift 2
            ;;
        -g|--resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        -a|--app-insights)
            APP_INSIGHTS_NAME="$2"
            shift 2
            ;;
        -i|--interactive)
            interactive_setup
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# If no connection string and not interactive mode, show help
if [[ -z "$CONNECTION_STRING" ]]; then
    print_error "Connection string is required. Use --interactive mode or --connection-string option"
    show_help
    exit 1
fi

print_header "React Application Insights Configuration"

# Validate connection string format
if [[ ! "$CONNECTION_STRING" =~ InstrumentationKey= ]]; then
    print_error "Invalid connection string format. Should contain 'InstrumentationKey='"
    exit 1
fi

# Create .env.local file
print_status "Creating .env.local file with connection string"
cat > .env.local << EOF
# Environment Configuration
VITE_ENVIRONMENT=development

# Azure Application Insights Configuration
VITE_APPINSIGHTS_CONNECTION_STRING=${CONNECTION_STRING}

# Application Version
VITE_APP_VERSION=1.0.0
EOF

# Create configuration summary file
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat > app-insights-config.json << EOF
{
  "connectionString": "${CONNECTION_STRING}",
  "resourceGroup": "${RESOURCE_GROUP:-"not-provided"}",
  "appInsightsName": "${APP_INSIGHTS_NAME:-"not-provided"}",
  "configuredAt": "$TIMESTAMP"
}
EOF

print_header "Configuration Complete!"
echo ""
print_status "✅ Environment file created: .env.local"
print_status "✅ Connection string configured"
echo ""
print_status "📋 Next Steps:"
echo "  1. Run 'npm run dev' to start the application"
echo "  2. Visit http://localhost:5173 to test the integration"
echo "  3. Check browser console for Application Insights initialization"

if [[ -n "$RESOURCE_GROUP" && -n "$APP_INSIGHTS_NAME" ]]; then
    echo "  4. Deploy the Azure Workbook: ./azure/deploy-workbook.sh -g $RESOURCE_GROUP -a $APP_INSIGHTS_NAME"
fi

echo ""
print_status "� Tips:"
echo "  - Open Developer Tools to see telemetry being sent"
echo "  - Use the demo components to test custom event tracking"
echo "  - Check Azure Portal > Application Insights > Live Metrics for real-time data"