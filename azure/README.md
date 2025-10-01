# React App Insights Workbook - Terraform Configuration

This directory contains Terraform configuration to deploy an Application Insights Workbook for monitoring your React application using a **template file approach** for better maintainability.

## File Structure

- **`main.tf`** - Main Terraform configuration with the react_dashboard workbook resource
- **`workbook-template.json.tftpl`** - Template file for React App Insights dashboard
- **`workbook-user-activity.tf`** - User Activity workbook resource definition
- **`workbook-user-activity-template.json.tftpl`** - Template file for User Activity dashboard
- **`variables.tf`** - Variable definitions for both workbooks
- **`terraform.tfvars`** - Default variable values
- **`outputs.tf`** - Output definitions
- **`WORKBOOK_TEMPLATE.md`** - Detailed documentation on the template approach



## Prerequisites## Usage



1. **Terraform installed** (>= 1.0)### Deploying the Workbook

2. **Azure CLI** installed and authenticated (`az login`)

3. **Existing Application Insights resource** in Azure```bash

# Navigate to the azure directory

## Quick Startcd azure



1. **Initialize Terraform:**# Deploy using Azure CLI

   ```bashaz deployment group create \

   terraform init  --resource-group <your-resource-group> \

   ```  --template-file workbook-template.json \

  --parameters @workbook-parameters.json

2. **Review the plan:**```

   ```bash

   terraform plan### Updating the Gallery Template

   ```

You have two options for updating the workbook dashboard:

3. **Deploy the workbook:**

   ```bash#### Option 1: Edit the Standalone File (Recommended)

   terraform apply

   ```1. Edit the `gallery-template.json` file with your changes

2. Run the update script to sync changes:

## Configuration   ```bash

   ./update-gallery-template.sh

### Default Values (terraform.tfvars)   ```

```hcl3. Deploy the updated template

resource_group_name       = "rg-apm-air"

application_insights_name = "ai-air-demo"#### Option 2: Edit Parameters Directly

workbook_display_name     = "React App Insights Dashboard"

```1. Edit the `galleryTemplate.value` object in `workbook-parameters.json`

2. Deploy the updated template

### Custom Deployment

To deploy with different values, either:## Benefits of This Structure



1. **Edit `terraform.tfvars`** file, or- **Easier Maintenance**: Edit the gallery template in a dedicated JSON file

2. **Pass variables on command line:**- **Better Version Control**: Clear separation of template structure and dashboard definition

   ```bash- **Improved Readability**: No more escaped JSON strings in ARM templates

   terraform apply \- **Automated Sync**: Script to keep files synchronized

     -var="resource_group_name=my-rg" \

     -var="application_insights_name=my-ai" \## Gallery Template Content

     -var="workbook_display_name=My Dashboard"

   ```The `gallery-template.json` contains the Application Insights workbook dashboard definition with:



## Workbook Features- **Navigation & Menu Tracking**: Monitor user interaction with navigation elements

- **Contact Form Analytics**: Track form submissions and validation errors

The deployed workbook includes comprehensive monitoring for React applications:- **Performance Metrics**: Page load times and browser timing breakdowns

- **Error Monitoring**: Exception tracking and debugging information

- 📱 **Navigation & Menu Tracking**- **User Behavior Analytics**: Session analytics and user engagement metrics

- 📝 **Contact Form Analytics** 

- ⚡ **Performance Metrics**## Deployment Notes

- ❌ **Error Monitoring & Debugging**

- 👤 **User Behavior Analytics**- The workbook will be created with the display name specified in `workbookDisplayName` parameter

- The workbook will be associated with the Application Insights resource specified in `workbookSourceId`

## Outputs- All KQL queries in the dashboard will execute against the linked Application Insights instance



After deployment, you'll get:## Troubleshooting

- Workbook ID and name

- Application Insights resource detailsIf deployment fails:



## Cleanup1. Verify the `workbookSourceId` parameter points to a valid Application Insights resource

2. Ensure you have sufficient permissions to create workbooks in the target resource group

To remove the workbook:3. Check that the gallery template JSON is valid using a JSON validator

```bash

terraform destroyFor API version issues, the workbook template uses API version `2022-04-01` which supports the latest workbook features.
```

## Comparison with ARM Templates

### Before (ARM Template)
```bash
az deployment group create \
  --resource-group rg-apm-air \
  --template-file workbook-template.json \
  --parameters @workbook-parameters.json
```

### After (Terraform)
```bash
terraform apply
```

## Benefits of Terraform Approach

- ✅ **Cleaner syntax** - HCL vs JSON
- ✅ **Better parameterization** - Variables and data sources  
- ✅ **State management** - Track what's deployed
- ✅ **IDE support** - Better tooling and validation
- ✅ **Easier maintenance** - More readable and modular