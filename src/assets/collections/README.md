# Collections Content Guide

This folder controls what appears on the Collections page.

Goal: make it easy to add or edit collections and collection objects without changing app code.

## Folder structure

- meta.json
  : Global list of collections (folder, title, order)

- one folder per collection (example: yomartins)
  : Contains collection-level files and one folder per object-in-collection

Inside each collection folder:

- meta.json
  : Collection structure (which object folders are included, placeholder cards)

- locales/
  : Collection-level translated text folder
- locales/meta-en.json
- locales/meta-fr.json
- locales/meta-pt.json
  : Collection-level translated text files (description and placeholder text)

- one folder per object-in-collection (example: object01)
  : Contains object mapping and translated card text

Inside each object folder:

- meta.json
  : Object data (slug, order, optional title/dimensions/weight, section image/video config)

- locales/
  : Object-level translated text folder
- locales/meta-en.json
- locales/meta-fr.json
- locales/meta-pt.json
  : Card title and card summary for that object card

Example:

- meta.json
- yomartins/
- yomartins/meta.json
- yomartins/locales/meta-en.json
- yomartins/locales/meta-fr.json
- yomartins/locales/meta-pt.json
- yomartins/object01/
- yomartins/object01/meta.json
- yomartins/object01/locales/meta-en.json
- yomartins/object01/locales/meta-fr.json
- yomartins/object01/locales/meta-pt.json

## How data flows

1. Root collections list

- src/assets/collections/meta.json tells the app which collections exist and in what order.

2. Collection structure

- src/assets/collections/<collection>/meta.json tells the app:
- which object folders to show
- which placeholder cards to show

3. Collection translations

- src/assets/collections/<collection>/locales/meta-<lang>.json provides:
- collection description
- placeholder card title/summary text

4. Object-in-collection mapping

- src/assets/collections/<collection>/<object-folder>/meta.json maps a card to an object using slug.

5. Object card translations

- src/assets/collections/<collection>/<object-folder>/locales/meta-<lang>.json provides cardTitle + summary text.

Important:

- slug is the URL key for this object inside the collection route.
- If slug is empty or duplicated within a collection, routing will break.

## URL behavior

- Collections page:
  /collections

- Collection object detail page:
  /collections/<collection-slug>/<object-slug>

Where:

- collection-slug comes from collection folder name
- object-slug comes from object folder meta.json field slug

## Add a new collection (step by step)

1. Add collection entry in src/assets/collections/meta.json

Example:

```json
{
  "folder": "new-collection",
  "title": "New Collection",
  "order": 3
}
```

2. Create folder src/assets/collections/new-collection

3. Add src/assets/collections/new-collection/meta.json

Example:

```json
{
  "objects": [
    { "folder": "object01", "order": 1 },
    { "folder": "object02", "order": 2 }
  ],
  "placeholders": [{ "id": "moreObjects", "variant": "outline", "order": 3 }]
}
```

4. Add translated collection files

- src/assets/collections/new-collection/locales/meta-en.json
- src/assets/collections/new-collection/locales/meta-fr.json
- src/assets/collections/new-collection/locales/meta-pt.json

Example meta-en.json:

```json
{
  "description": "A short collection description.",
  "placeholders": {
    "moreObjects": {
      "title": "More objects",
      "summary": "Coming soon"
    }
  }
}
```

5. Create one folder per object card

Example object01:

- src/assets/collections/new-collection/object01/meta.json
- src/assets/collections/new-collection/object01/locales/meta-en.json
- src/assets/collections/new-collection/object01/locales/meta-fr.json
- src/assets/collections/new-collection/object01/locales/meta-pt.json

meta.json example:

```json
{
  "slug": "new-object-01",
  "id": "object01",
  "order": 1
}
```

meta-en.json example:

```json
{
  "cardTitle": "Object 01",
  "summary": "Prototype seat in cork"
}
```

Repeat for object02, object03, etc.

## Placeholder variants

In a collection meta.json placeholder entry, variant currently supports:

- solid
  : bright filled block card

- outline
  : outlined block card

Example:

```json
{ "id": "object02", "variant": "solid", "order": 2 }
```

Placeholder title/summary text is defined in collection locale files using the same id.

## Common fields reference

Collection root entry (src/assets/collections/meta.json):

- folder: collection folder name
- title: collection heading on page
- order: display order of collections

Collection structure entry (src/assets/collections/<collection>/meta.json):

- objects: list of object folders and optional order
- placeholders: list of placeholder cards

Collection object mapping (src/assets/collections/<collection>/<object-folder>/meta.json):

- slug: object slug used by this collection card and URL
- id: stable text key id
- order: object order in collection

Collection object locale file (locales/meta-en/fr/pt.json):

- cardTitle: card title text
- summary: card subtitle text

## Global collections intro text

The two intro lines shown at top of Collections page come from app locale files, not this folder:

- src/locales/en.json
- src/locales/fr.json
- src/locales/pt.json

Keys:

- collections.introLine1
- collections.introLine2

## Notes and common pitfalls

- Folder names are part of runtime keys. Keep names lowercase and consistent.
- If an object folder is listed in collection meta.json but missing on disk, that card will not appear.
- If object locale sections are missing text, those sections will not appear on the detail page.
- If meta-fr.json or meta-pt.json is missing for an object or collection, app falls back to English when available.
- Placeholders need matching text ids in collection locale files, or title/summary may be blank.

## Quick checklist before testing

1. Root collections meta includes your collection.
2. Collection folder has meta.json + locales/meta-en/fr/pt.json.
3. Collection meta.json lists existing object folders.
4. Each object folder has meta.json + locales/meta-en/fr/pt.json.
5. slug is set and unique for each object in the collection.
6. Open /collections and verify cards and order.
7. Open at least one detail page under /collections/<collection>/<object>.
