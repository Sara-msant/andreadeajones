# Home Featured Item Guide

This folder controls the featured item shown on the Home page.

## Files in this folder

- `meta.json`: settings for the featured item (text, image, link target)
- image files (example: `a-overview.png`): used by `cover` in `meta.json`

## What each `meta.json` field does

```json
{
  "slug": "low-stool",
  "title": "YoMartins. Explore",
  "cover": "a-overview.png",
  "alt": "YoMartins object overview"
}
```

- `title`
  : Text shown in the main Home button.
  Important: this is the full text shown in the button.
  The arrow is added by the UI automatically.

- `cover`
  : Image file name used for the big featured image on Home.
  The file must exist in this same folder and match exactly (including extension).

- `slug`
  : Controls where the main Home button links.
  If `slug` is set, button goes to that object detail page.
  If `slug` is missing or empty, button goes to the main Objects page.

- `alt`
  : Accessibility description for the featured image.
  Used by screen readers and for better accessibility.

## Common edits

1. Change button text

- Edit `title`.

2. Change featured image

- Add or replace an image file in this folder.
- Set `cover` to that exact file name.

3. Change button destination

- Set `slug` to an existing object slug (example: `stool`) to open that object page.
- Remove `slug` to send users to the Objects list page.

## Quick safety checklist

- `cover` file exists in this folder.
- File name in `cover` matches exactly.
- If using `slug`, it matches an existing object slug.
- Save `meta.json` and refresh the Home page.
