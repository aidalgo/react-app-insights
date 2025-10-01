variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-apm-air"
}

variable "application_insights_name" {
  description = "Name of the Application Insights resource"
  type        = string
  default     = "ai-air-demo"
}

variable "workbook_display_name" {
  description = "Display name for the workbook"
  type        = string
  default     = "React App Insights Dashboard"
}

variable "dashboard_title" {
  description = "Title shown in the workbook dashboard header"
  type        = string
  default     = "React App Insights Dashboard"
}

variable "dashboard_description" {
  description = "Description shown in the workbook dashboard header"
  type        = string
  default     = "Comprehensive monitoring dashboard for your React application with Application Insights integration."
}

variable "time_range_days" {
  description = "Default time range in days for environment parameter query"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "react-app-insights"
  }
}