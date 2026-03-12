---
description: Guideline on how to handle responsive full width hero or background images.
---
# Responsive Hero and Background Images

When dealing with full-page Hero sections or section background images, the best approach for maintaining responsiveness is to provide and utilize **two different image formats**: one for Desktop and another for Mobile.

## Why use two formats?

* **Desktop (Landscape / Horizontal):** Computer displays are typically wide (usually 16:9 format).
* **Mobile (Portrait / Vertical):** Mobile screens are tall and narrow (usually 9:16 format).

Using a single Desktop image for Mobile causes CSS (`background-size: cover`) to inevitably crop the sides of the image. This often cuts out the main focal point of the art (e.g. a face, a product, detailed typography contours). 

## Implementation Guidelines

### 1. HTML Image (`<img>` tag)
If the image renders as an HTML element, rely on the `<picture>` tag to swap sources natively based on user device width:

```html
<picture>
  <!-- Loaded on Mobile -->
  <source media="(max-width: 768px)" srcset="hero-bg-mobile.webp">
  
  <!-- Loaded on Desktop (Default fallback) -->
  <img src="hero-bg-desktop.webp" alt="Image description" class="object-cover w-full h-full">
</picture>
```

### 2. CSS/Tailwind Background (`background-image`)
If the image should render as the background of a generic element (e.g. a `<div>` or a `<section>`), use responsive utility classes (like Tailwind's `md:` or `lg:` modifiers):

```html
<!-- Mobile background by default, swapping to Desktop background from the "md" breakpoint onwards -->
<div class="bg-[url('/hero-mobile.webp')] md:bg-[url('/hero-desktop.webp')] bg-cover bg-center">
    ... content goes here ...
</div>
```

## Formats Checklist

Always ensure the design team or Image Generator generates these specific cuts when detail is critical:
- **Desktop:** `1920x1080` (Horizontal Cut)
- **Mobile:** `1080x1920` (Vertical Cut)

*Note: For simple abstract backgrounds (like a repeating noise texture or a uniform gradient), offering a single Desktop version is usually enough as lateral cropping won't damage the user experience.*
