# Azure Workbook Template Structure

This directory contains the Azure Application Insights workbook deployment files with a modular structure for better maintainability.

## File Structure

- **`workbook-template.json`** - Main ARM template for deploying the workbook
- **`workbook-parameters.json`** - Parameters file with configuration values and gallery template content
- **`gallery-template.json`** - Standalone gallery template definition (for easier editing)
- **`update-gallery-template.sh`** - Script to sync changes from gallery-template.json to parameters file

## Usage

### Deploying the Workbook

```bash
# Navigate to the azure directory
cd azure

# Deploy using Azure CLI
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file workbook-template.json \
  --parameters @workbook-parameters.json
```

### Updating the Gallery Template

You have two options for updating the workbook dashboard:

#### Option 1: Edit the Standalone File (Recommended)

1. Edit the `gallery-template.json` file with your changes
2. Run the update script to sync changes:
   ```bash
   ./update-gallery-template.sh
   ```
3. Deploy the updated template

#### Option 2: Edit Parameters Directly

1. Edit the `galleryTemplate.value` object in `workbook-parameters.json`
2. Deploy the updated template

## Benefits of This Structure

- **Easier Maintenance**: Edit the gallery template in a dedicated JSON file
- **Better Version Control**: Clear separation of template structure and dashboard definition
- **Improved Readability**: No more escaped JSON strings in ARM templates
- **Automated Sync**: Script to keep files synchronized

## Gallery Template Content

The `gallery-template.json` contains the Application Insights workbook dashboard definition with:

- **Navigation & Menu Tracking**: Monitor user interaction with navigation elements
- **Contact Form Analytics**: Track form submissions and validation errors
- **Performance Metrics**: Page load times and browser timing breakdowns
- **Error Monitoring**: Exception tracking and debugging information
- **User Behavior Analytics**: Session analytics and user engagement metrics

## Deployment Notes

- The workbook will be created with the display name specified in `workbookDisplayName` parameter
- The workbook will be associated with the Application Insights resource specified in `workbookSourceId`
- All KQL queries in the dashboard will execute against the linked Application Insights instance

## Troubleshooting

If deployment fails:

1. Verify the `workbookSourceId` parameter points to a valid Application Insights resource
2. Ensure you have sufficient permissions to create workbooks in the target resource group
3. Check that the gallery template JSON is valid using a JSON validator

For API version issues, the workbook template uses API version `2022-04-01` which supports the latest workbook features.