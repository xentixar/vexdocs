---
title: "SEO Best Practices - Vexdocs"
description: "Learn how to implement SEO best practices in your documentation with Vexdocs. Complete guide with examples and tips."
keywords: "SEO, documentation, meta tags, search optimization, vexdocs"
author: "Vexdocs Team"
canonical: "https://docs.example.com/v2.0/seo-example"
og_title: "SEO Best Practices for Documentation"
og_description: "Master SEO for your documentation site with Vexdocs. Boost your search rankings and user discovery."
og_image: "https://docs.example.com/images/seo-guide.png"
twitter_card: "summary_large_image"
twitter_title: "SEO Best Practices Guide"
twitter_description: "Learn SEO for documentation sites"
twitter_image: "https://docs.example.com/images/seo-guide-twitter.png"
---

# SEO Best Practices for Documentation

This page demonstrates how to use SEO frontmatter in your markdown files to optimize your documentation for search engines.

## What is SEO?

Search Engine Optimization (SEO) is the practice of increasing the quantity and quality of traffic to your website through organic search engine results.

## Frontmatter SEO Fields

Vexdocs supports the following SEO fields in your markdown frontmatter:

### Basic SEO
- `title` or `seo_title`: Page title for search engines
- `description` or `seo_description`: Meta description (recommended 150-160 characters)
- `keywords` or `seo_keywords`: Meta keywords (comma-separated)
- `author`: Content author
- `canonical`: Canonical URL for the page

### Open Graph (Facebook/LinkedIn)
- `og_title`: Open Graph title
- `og_description`: Open Graph description
- `og_image`: Open Graph image URL

### Twitter Cards
- `twitter_card`: Twitter card type (`summary`, `summary_large_image`, etc.)
- `twitter_title`: Twitter card title
- `twitter_description`: Twitter card description
- `twitter_image`: Twitter card image URL

## Example Frontmatter

```yaml
---
title: "Your Page Title - Site Name"
description: "A compelling description that appears in search results"
keywords: "keyword1, keyword2, keyword3"
author: "Your Name"
canonical: "https://yoursite.com/page-url"
og_title: "Social Media Title"
og_description: "Description for social media shares"
og_image: "https://yoursite.com/image.png"
twitter_card: "summary_large_image"
twitter_title: "Twitter-specific title"
twitter_description: "Twitter-specific description"
twitter_image: "https://yoursite.com/twitter-image.png"
---
```

## Best Practices

1. **Keep titles under 60 characters** for optimal display in search results
2. **Write compelling meta descriptions** between 150-160 characters
3. **Use relevant keywords** but avoid keyword stuffing
4. **Provide unique content** for each page
5. **Include high-quality images** for social media sharing
6. **Use canonical URLs** to avoid duplicate content issues

## Automatic Fallbacks

If you don't provide SEO fields, Vexdocs will automatically:
- Use the first H1 heading as the title
- Extract the first paragraph as the description
- Generate Open Graph and Twitter tags from basic SEO data
- Set the current page URL as canonical

This ensures your documentation always has basic SEO coverage even without explicit frontmatter.
