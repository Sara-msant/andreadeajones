# Objects Content Guide

This folder controls what appears on the Objects page and each Object detail page.

## Folder structure

- meta.json
  : Global list of objects and shared settings (slug, title, order, sections, etc.)

- one folder per object (example: stool)
  : Contains images and language files for that object

Example:

- meta.json
- stool/
- stool/meta-en.json
- stool/meta-fr.json
- stool/meta-pt.json
- stool/cover.png
- stool/a-overview.png
- stool/b-separated-blocks.png
- etc.

## What meta.json does

File: meta.json at the root of this folder.

It defines each object card and how object detail sections are assembled.

Each object entry usually includes:

- folder
  : Name of the object folder (must match an existing folder)

- order
  : Display order on the Objects page

- slug
  : URL id for the object page
  Example: /object/stool

- title
  : Object title shown in the UI

- dimensions, weight
  : Optional specs used by the app

- sections
  : Ordered list of section blocks for the detail page
  Each section item has an id and either:
- image (image filename), or
- youtube (video URL or video id)

## How one object is built (example: stool)

1. Add object in root meta.json

- Create/update an object entry where folder is stool.
- Define slug, title, order, and sections.

2. Add media files in stool folder

- Add the images referenced by sections.
- Include a cover image.

3. Add localized text files

- stool/meta-en.json
- stool/meta-fr.json
- stool/meta-pt.json

These files contain section text/caption by section id.

Important: section ids in stool/meta-\*.json must match the ids in root meta.json.

## Example object entry (root meta.json)

```json
{
  "folder": "stool",
  "order": 1,
  "slug": "stool",
  "title": "YoMartins",
  "dimensions": "W 37 x D 37 x H 45 cm",
  "weight": "9.0 Kg",
  "sections": [
    { "id": "overview", "image": "a-overview.png" },
    { "id": "deconstruction", "youtube": "https://www.youtube.com/embed/9nXoVh8j2s0" },
    { "id": "separated_blocks", "image": "b-separated-blocks.png" }
  ]
}
```

## Example localized section file (stool/meta-en.json)

```json
{
  "sections": {
    "overview": {
      "caption": ["YOMARTINS STOOL 2026."],
      "text": "YOMARTINS is a cork stool..."
    },
    "deconstruction": {
      "caption": ["DECONSTRUCTION."],
      "text": "Composed of three solid cork elements..."
    }
  }
}
```

## How cover image is chosen

The cover image is shown as the thumbnail/card image on the Objects listing page.

- Preferred behavior
  : If an image file in the object folder starts with `cover` but not `cover-hover` (for example `cover.png`, `cover.jpg`, `cover-v2.png`), the app uses that as the object cover.

- Explicit cover override
  : You can set `cover` in `src/assets/objects/meta.json` to point to a specific filename in the object folder.

- Hover behavior
  : If an image file starts with `cover-hover` (for example `cover-hover.png` or `cover-hover.jpg`), the Objects listing page crossfades to that image on hover.

- Explicit hover override
  : You can also set `hoverCover` in `src/assets/objects/meta.json` to point to a specific filename in the object folder.

- Hover fallback behavior
  : If no matching hover image exists, the card keeps showing the normal cover and no hover crossfade is applied.

- Fallback behavior
  : If no matching cover file exists, the app uses the first image in filename sort order.

- Practical recommendation
  : Always include a `cover` file so the card image is predictable.

## Notes and common pitfalls

- If folder name in root meta.json does not exist, that object will not load correctly.
- If section ids do not match between root meta.json and meta-\*.json, text may be missing.
- If an image filename is wrong, that section image will not appear.
- The cover and hover images are not configured in sections; `cover-hover*` is reserved for the hover state, while other `cover*` files are treated as normal covers unless `cover` / `hoverCover` is set in root meta.json.

## Quick checklist before testing

1. Root meta.json has the object entry with correct folder and slug.
2. Object folder contains referenced image files.
3. meta-en.json, meta-fr.json, meta-pt.json exist for that object.
4. Section ids match across files.
5. Refresh Objects page and open the object detail page.
