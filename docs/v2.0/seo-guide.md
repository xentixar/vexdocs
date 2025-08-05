# SEO Documentation

This document explains how to implement Search Engine Optimization (SEO) in your Vexdocs documentation.

## Overview

Vexdocs automatically handles SEO optimization for your documentation with minimal configuration required. You can enhance SEO by adding frontmatter to your markdown files.

## Supported SEO Fields

### Basic Meta Tags

| Field | Description | Example |
|-------|-------------|---------|
| `title` or `seo_title` | Page title | `"API Reference - MyProject"` |
| `description` or `seo_description` | Meta description | `"Complete API reference with examples"` |
| `keywords` or `seo_keywords` | Meta keywords | `"api, reference, documentation"` |
| `author` | Content author | `"John Doe"` |
| `canonical` | Canonical URL | `"https://docs.example.com/api"` |

### Open Graph Tags

| Field | Description | Example |
|-------|-------------|---------|
| `og_title` | Open Graph title | `"API Reference"` |
| `og_description` | Open Graph description | `"Complete API documentation"` |
| `og_image` | Open Graph image | `"https://example.com/og-image.png"` |

### Twitter Card Tags

| Field | Description | Example |
|-------|-------------|---------|
| `twitter_card` | Twitter card type | `"summary"` or `"summary_large_image"` |
| `twitter_title` | Twitter title | `"API Reference"` |
| `twitter_description` | Twitter description | `"Complete API documentation"` |
| `twitter_image` | Twitter image | `"https://example.com/twitter.png"` |

## Example Usage

```yaml
---
title: "API Reference - MyProject Documentation"
description: "Complete API reference with code examples and implementation guides"
keywords: "api, rest, graphql, documentation, examples"
author: "Development Team"
canonical: "https://docs.myproject.com/api/reference"
og_title: "MyProject API Reference"
og_description: "Everything you need to integrate with MyProject API"
og_image: "https://docs.myproject.com/images/api-cover.png"
twitter_card: "summary_large_image"
twitter_title: "MyProject API Docs"
twitter_description: "Complete API reference and guides"
twitter_image: "https://docs.myproject.com/images/api-twitter.png"
---

# API Reference

Your content here...
```

## Automatic Fallbacks

When SEO fields are not provided, Vexdocs automatically:

1. **Title**: Uses the first H1 heading or config title
2. **Description**: Extracts from the first paragraph
3. **Open Graph**: Inherits from basic SEO fields
4. **Twitter**: Inherits from basic SEO fields
5. **Canonical**: Uses current page URL

## Best Practices

### Title Optimization
- Keep under 60 characters
- Include primary keyword
- Be descriptive and unique
- Include brand/site name

### Description Optimization
- 150-160 characters optimal
- Include primary keywords naturally
- Write compelling copy
- Avoid duplicate descriptions

### Keywords
- Use 3-5 relevant keywords
- Separate with commas
- Focus on user intent
- Avoid keyword stuffing

### Images
- Use high-resolution images (1200x630 for OG)
- Include alt text in markdown
- Optimize file sizes
- Use consistent branding

## Testing SEO

To test your SEO implementation:

1. View page source to verify meta tags
2. Use browser dev tools to inspect elements
3. Test with social media sharing tools
4. Validate with SEO audit tools

## Configuration

Global SEO settings can be configured in `docs/config.json`:

```json
{
  "title": "My Documentation",
  "description": "Comprehensive documentation for My Project",
  "seo": {
    "defaultAuthor": "My Company",
    "defaultImage": "https://example.com/default-og.png",
    "twitterSite": "@mycompany",
    "googleAnalytics": "GA-XXXXXXXXX"
  }
}
```

## Advanced Features

### Structured Data
Future versions will support JSON-LD structured data for enhanced search results.

### Analytics Integration
Google Analytics and other tracking tools can be integrated via configuration.

### Sitemap Generation
Automatic sitemap generation is planned for better search engine discovery.
