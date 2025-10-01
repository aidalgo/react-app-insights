# Workbook Templates - Complete Guide

## Overview

Both Application Insights Workbooks now use **template files** with variable substitution for maximum flexibility and maintainability.

### Workbooks Included

1. **React App Insights Dashboard** (`react_dashboard`)
   - Navigation & menu tracking
   - Contact form analytics
   - Performance metrics
   - Error monitoring
   - User behavior analytics

2. **User Activity Dashboard** (`user_activity`)
   - Active users metrics (30 min, 1 hour, today)
   - Daily login activity
   - User engagement breakdown
   - Authentication patterns

## Template Files

### React Dashboard
- **Template:** `workbook-template.json.tftpl`
- **Resource:** `azurerm_application_insights_workbook.react_dashboard` in `main.tf`
- **Variables:** 3 variables for basic customization

### User Activity Dashboard
- **Template:** `workbook-user-activity-template.json.tftpl`
- **Resource:** `azurerm_application_insights_workbook.user_activity` in `workbook-user-activity.tf`
- **Variables:** 11 variables for detailed time window customization

## Available Variables

### React Dashboard Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `dashboard_title` | string | "React App Insights Dashboard" | Dashboard header title |
| `dashboard_description` | string | "Comprehensive monitoring..." | Header description |
| `time_range_days` | number | 30 | Days for environment filter |

### User Activity Dashboard Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `user_activity_title` | string | "User Activity Dashboard" | Dashboard title |
| `user_activity_description` | string | "Monitor active users..." | Dashboard description |
| `active_users_short_window` | string | "30m" | Short time window (KQL format) |
| `active_users_short_label` | string | "30 min" | Short window display label |
| `active_users_short_minutes` | number | 30 | Short window in minutes |
| `active_users_medium_window` | string | "1h" | Medium time window |
| `active_users_medium_label` | string | "Hour" | Medium window display label |
| `active_users_medium_hours` | number | 1 | Medium window in hours |
| `active_users_long_window` | string | "1d" | Long time window |
| `active_users_long_label` | string | "Today" | Long window display label |
| `active_users_long_hours` | number | 24 | Long window in hours |
| `login_activity_days` | number | 30 | Days for login analytics |
| `engagement_days` | number | 30 | Days for engagement data |

## Usage Examples

### Basic Deployment

Deploy both workbooks with default values:

```bash
terraform apply
```

### Customize React Dashboard

```hcl
# terraform.tfvars
dashboard_title       = "🚀 Production Monitoring"
dashboard_description = "Real-time production metrics and alerts"
time_range_days       = 90
```

### Customize User Activity Windows

```hcl
# terraform.tfvars
# Change "Last 30 min" to "Last 15 min"
active_users_short_window  = "15m"
active_users_short_label   = "15 min"
active_users_short_minutes = 15

# Change "Hour" to "Last 2 Hours"
active_users_medium_window = "2h"
active_users_medium_label  = "2 Hours"
active_users_medium_hours  = 2

# Extend login activity to 60 days
login_activity_days = 60
```

### Environment-Specific Configurations

**Development:**
```hcl
# dev.tfvars
dashboard_title             = "🔧 DEV - React Dashboard"
user_activity_title         = "🔧 DEV - User Activity"
time_range_days             = 7
login_activity_days         = 7
active_users_short_minutes  = 15
```

**Production:**
```hcl
# prod.tfvars
dashboard_title             = "📊 PROD - React Dashboard"
user_activity_title         = "📊 PROD - User Activity"
time_range_days             = 90
login_activity_days         = 90
active_users_short_minutes  = 30
```

Deploy with:
```bash
terraform apply -var-file="prod.tfvars"
```

## Template Syntax

Both templates use Terraform template syntax for variable substitution:

### Simple Variable
```json
{
  "json": "# ${dashboard_title}"
}
```

### Variable in KQL Query
```json
{
  "query": "customEvents | where timestamp > ago(${login_activity_days}d)"
}
```

### Calculated Values
In the `.tf` file:
```hcl
data_json = templatefile("${path.module}/workbook-template.json.tftpl", {
  time_range_ms = var.time_range_days * 24 * 60 * 60 * 1000
})
```

## Modifying Templates

### Add New Variable to React Dashboard

1. **Define variable** in `variables.tf`:
```hcl
variable "custom_metric_name" {
  description = "Custom metric to track"
  type        = string
  default     = "CustomEvent"
}
```

2. **Pass to template** in `main.tf`:
```hcl
data_json = templatefile("${path.module}/workbook-template.json.tftpl", {
  dashboard_title       = var.dashboard_title
  dashboard_description = var.dashboard_description
  time_range_days       = var.time_range_days
  time_range_ms         = var.time_range_days * 24 * 60 * 60 * 1000
  custom_metric_name    = var.custom_metric_name  # Add here
})
```

3. **Use in template** `workbook-template.json.tftpl`:
```json
{
  "query": "customEvents | where name == '${custom_metric_name}'"
}
```

### Modify Existing Queries

Simply edit the template file (`workbook-template.json.tftpl` or `workbook-user-activity-template.json.tftpl`) and run `terraform apply`.

## Best Practices

### Variable Naming
- Use descriptive names that indicate purpose
- Follow consistent naming patterns
- Separate words with underscores

### Time Windows
- Provide both KQL format (`30m`, `1h`, `1d`) and numeric values
- Include display labels for user-facing text
- Calculate milliseconds in the `.tf` file, not in variables

### Documentation
- Comment complex calculations in `.tf` files
- Update variable descriptions when changing behavior
- Document expected formats (e.g., "KQL time format like 30m, 1h")

### Testing
1. Always run `terraform plan` before `terraform apply`
2. Validate JSON syntax in templates
3. Test KQL queries in Azure Portal before adding to template
4. Use `terraform fmt` to format files

## Troubleshooting

### Template Rendering Errors

**Error:** Variable not found
```
No declaration found for "var.my_variable"
```

**Solution:** Ensure variable is defined in `variables.tf` and passed in `templatefile()` call.

### Invalid JSON

**Error:** Template produces invalid JSON
```
Error parsing data_json: invalid character...
```

**Solution:** 
- Validate template JSON structure
- Check for missing commas or brackets
- Use a JSON validator on the template

### KQL Query Errors

**Error:** Queries fail in workbook

**Solution:**
- Test queries in Azure Portal's Log Analytics
- Ensure variable substitution produces valid KQL
- Check time formats match expected patterns

## File Structure

```
azure/
├── main.tf                                   # React dashboard resource
├── workbook-template.json.tftpl              # React dashboard template
├── workbook-user-activity.tf                 # User activity resource  
├── workbook-user-activity-template.json.tftpl # User activity template
├── variables.tf                              # All variable definitions
├── terraform.tfvars                          # Default values
├── terraform.tfvars.example                  # Example configurations
└── WORKBOOK_TEMPLATES.md                    # This file
```

## Quick Commands

```bash
# Validate configuration
terraform validate

# Format files
terraform fmt

# Preview changes
terraform plan

# Apply changes
terraform apply

# Apply with custom variables
terraform apply -var="dashboard_title=Custom Title"

# Use environment file
terraform apply -var-file="prod.tfvars"

# Destroy resources
terraform destroy
```

## Additional Resources

- **`QUICK_REFERENCE.md`** - Quick reference card
- **`terraform.tfvars.example`** - Example configurations
- **`README.md`** - Project overview
- [Azure Workbooks Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview)
- [KQL Reference](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/)
