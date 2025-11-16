terraform {
  required_version = ">= 1.0"
  
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.12.0"
    }
  }
}

provider "cloudflare" {
  # Authentication via environment variables:
  # CLOUDFLARE_API_TOKEN (recommended)
  # OR
  # CLOUDFLARE_API_KEY and CLOUDFLARE_EMAIL (legacy)
}