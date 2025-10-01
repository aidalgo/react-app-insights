# Quick Reference - Template Variables

## Template File Location
`azure/workbook-template.json.tftpl`

## Available Variables

### Dashboard Customization
```hcl
dashboard_title       = "Your Dashboard Title"
dashboard_description = "Your dashboard description"
time_range_days       = 30
```

## Quick Commands

```bash
# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply changes
terraform apply

# Apply with custom variables
terraform apply \
  -var="dashboard_title=Production Dashboard" \
  -var="time_range_days=90"

# Use environment-specific config
terraform apply -var-file="prod.tfvars"
```

## Adding New Variables

1. Add to `variables.tf`:
```hcl
variable "your_variable" {
  description = "Description"
  type        = string
  default     = "default_value"
}
```

2. Pass to template in `main.tf`:
```hcl
data_json = templatefile("${path.module}/workbook-template.json.tftpl", {
  dashboard_title       = var.dashboard_title
  dashboard_description = var.dashboard_description
  time_range_days       = var.time_range_days
  time_range_ms         = var.time_range_days * 24 * 60 * 60 * 1000
  your_variable         = var.your_variable  # Add here
})
```

3. Use in template `workbook-template.json.tftpl`:
```json
{
  "query": "customEvents | where name == '${your_variable}'"
}
```

## Common Customizations

### Change Dashboard Title
```hcl
dashboard_title = "🚀 My Custom Dashboard"
```

### Adjust Time Range
```hcl
time_range_days = 60  # Query 60 days of data
```

### Custom Description
```hcl
dashboard_description = "Custom monitoring for production environment"
```

## File Structure

```
azure/
├── main.tf                          # Main config, uses templatefile()
├── workbook-template.json.tftpl     # Template with ${variables}
├── variables.tf                     # Variable definitions
├── terraform.tfvars                 # Default values
├── WORKBOOK_TEMPLATE.md            # Full documentation
└── terraform.tfvars.example        # Configuration examples
```

## Documentation Files

- `WORKBOOK_TEMPLATE.md` - Complete guide
- `terraform.tfvars.example` - Example configurations
- `REFACTORING_SUMMARY.md` - Change summary
- `QUICK_REFERENCE.md` - This file
