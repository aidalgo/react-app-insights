#!/bin/bash

# Azure Workbook Deployment Script
# Deploys the custom Application Insights workbook template

set -e  # Exit on any error

# Default values
RESOURCE_GROUP=""
APP_INSIGHTS_NAME=""
WORKBOOK_NAME="React App Insights Dashboard"
SUBSCRIPTION_ID=""

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
    echo "Deploys Azure Workbook template for Application Insights"
    echo ""
    echo "Options:"
    echo "  -g, --resource-group NAME    Resource group name (required)"
    echo "  -a, --app-insights NAME      Application Insights name (required)"
    echo "  -w, --workbook-name NAME     Workbook display name (default: React App Insights Dashboard)"
    echo "  -s, --subscription ID        Azure subscription ID (optional)"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -g myResourceGroup -a myAppInsights"
    echo "  $0 --resource-group myRG --app-insights myAI --workbook-name \"Custom Dashboard\""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -g|--resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        -a|--app-insights)
            APP_INSIGHTS_NAME="$2"
            shift 2
            ;;
        -w|--workbook-name)
            WORKBOOK_NAME="$2"
            shift 2
            ;;
        -s|--subscription)
            SUBSCRIPTION_ID="$2"
            shift 2
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

# Validate required parameters
if [[ -z "$RESOURCE_GROUP" ]]; then
    print_error "Resource group name is required"
    show_help
    exit 1
fi

if [[ -z "$APP_INSIGHTS_NAME" ]]; then
    print_error "Application Insights name is required"
    show_help
    exit 1
fi

print_header "Azure Workbook Deployment"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first:"
    echo "  https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure. Please run 'az login' first"
    exit 1
fi

# Set subscription if provided
if [[ -n "$SUBSCRIPTION_ID" ]]; then
    print_status "Setting subscription to $SUBSCRIPTION_ID"
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Get current subscription info
CURRENT_SUBSCRIPTION=$(az account show --query "name" -o tsv)
CURRENT_SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)
print_status "Using subscription: $CURRENT_SUBSCRIPTION ($CURRENT_SUBSCRIPTION_ID)"

# Check if resource group exists
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    print_error "Resource group '$RESOURCE_GROUP' does not exist"
    exit 1
fi

# Check if Application Insights resource exists
if ! az monitor app-insights component show --app "$APP_INSIGHTS_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    print_error "Application Insights resource '$APP_INSIGHTS_NAME' does not exist in resource group '$RESOURCE_GROUP'"
    exit 1
fi

# Get Application Insights resource ID
APP_INSIGHTS_RESOURCE_ID="/subscriptions/$CURRENT_SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$APP_INSIGHTS_NAME"
print_status "Application Insights Resource ID: $APP_INSIGHTS_RESOURCE_ID"

# Check if azure directory exists
if [[ ! -d "azure" ]]; then
    print_error "Azure directory not found. Make sure you're running this from the project root."
    exit 1
fi

# Check if template files exist
if [[ ! -f "azure/workbook-template.json" ]]; then
    print_error "Workbook template file 'azure/workbook-template.json' not found"
    exit 1
fi

if [[ ! -f "azure/workbook-parameters.json" ]]; then
    print_error "Workbook parameters file 'azure/workbook-parameters.json' not found"
    exit 1
fi

# Update gallery template if update script exists
if [[ -f "azure/update-gallery-template.sh" ]]; then
    print_status "Updating gallery template from standalone file"
    cd azure
    chmod +x update-gallery-template.sh
    ./update-gallery-template.sh
    cd ..
fi

# Deploy the workbook
print_status "Deploying Azure Workbook: $WORKBOOK_NAME"
DEPLOYMENT_NAME="workbook-deployment-$(date +%s)"

az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DEPLOYMENT_NAME" \
    --template-file "azure/workbook-template.json" \
    --parameters @azure/workbook-parameters.json \
    --parameters workbookDisplayName="$WORKBOOK_NAME" \
    --parameters workbookSourceId="$APP_INSIGHTS_RESOURCE_ID"

if [[ $? -eq 0 ]]; then
    print_header "Deployment Complete!"
    echo ""
    print_status "✅ Workbook Name: $WORKBOOK_NAME"
    print_status "✅ Resource Group: $RESOURCE_GROUP"
    print_status "✅ Application Insights: $APP_INSIGHTS_NAME"
    echo ""
    print_status "📊 Access your workbook:"
    echo "  1. Go to Azure Portal: https://portal.azure.com"
    echo "  2. Navigate to: Application Insights > $APP_INSIGHTS_NAME"
    echo "  3. Click on 'Workbooks' in the left menu"
    echo "  4. Find your workbook: '$WORKBOOK_NAME'"
    echo ""
    print_status "💡 Tips:"
    echo "  - It may take a few minutes for data to appear in the workbook"
    echo "  - Use your React app to generate telemetry data"
    echo "  - Customize the workbook by clicking 'Edit' in Azure Portal"
    echo ""
    
    # Save deployment info
    cat > azure-workbook-deployment.json << EOF
{
  "workbookName": "$WORKBOOK_NAME",
  "resourceGroup": "$RESOURCE_GROUP",
  "appInsightsName": "$APP_INSIGHTS_NAME",
  "appInsightsResourceId": "$APP_INSIGHTS_RESOURCE_ID",
  "subscriptionId": "$CURRENT_SUBSCRIPTION_ID",
  "deploymentName": "$DEPLOYMENT_NAME",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
    
else
    print_error "Failed to deploy workbook"
    exit 1
fi