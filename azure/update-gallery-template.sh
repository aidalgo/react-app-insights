#!/bin/bash

# Script to update workbook parameters with the latest gallery template
# This script reads the gallery-template.json file and updates the workbook-parameters.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GALLERY_TEMPLATE_FILE="$SCRIPT_DIR/gallery-template.json"
PARAMETERS_FILE="$SCRIPT_DIR/workbook-parameters.json"
TEMP_FILE="$SCRIPT_DIR/temp-parameters.json"

echo "🔄 Updating workbook parameters with latest gallery template..."

# Check if gallery template exists
if [ ! -f "$GALLERY_TEMPLATE_FILE" ]; then
    echo "❌ Error: gallery-template.json not found"
    exit 1
fi

# Check if parameters file exists
if [ ! -f "$PARAMETERS_FILE" ]; then
    echo "❌ Error: workbook-parameters.json not found"
    exit 1
fi

# Read the gallery template content
GALLERY_CONTENT=$(cat "$GALLERY_TEMPLATE_FILE")

# Use jq to update the parameters file with the gallery template content
if command -v jq &> /dev/null; then
    jq --argjson galleryTemplate "$GALLERY_CONTENT" \
        '.parameters.galleryTemplate.value = $galleryTemplate' \
        "$PARAMETERS_FILE" > "$TEMP_FILE"
    
    # Replace the original file
    mv "$TEMP_FILE" "$PARAMETERS_FILE"
    
    echo "✅ Successfully updated workbook-parameters.json with latest gallery template"
    echo "📋 You can now deploy using:"
    echo "   az deployment group create --resource-group <your-rg> --template-file workbook-template.json --parameters @workbook-parameters.json"
else
    echo "⚠️  jq is not installed. Please install jq to use this script automatically."
    echo "   You can manually copy the content from gallery-template.json to the galleryTemplate.value in workbook-parameters.json"
fi