# OECE.tech Subsites

This folder contains symlinks to subsite projects for unified development.

## Structure

```
subsites/
├── me -> ../../oece-me    # Personal card (me.oece.tech)
└── README.md
```

## Development

### Start personal card dev server:
```bash
cd me && npm run dev
# Or from oece-tech root:
npm run dev:me
```

### All subsites at once:
```bash
npm run dev:all
```

## Deployment

Each subsite is deployed to its own Firebase Hosting target:
- `me.oece.tech` → Firebase target: `me`

```bash
# Deploy personal card
cd me && npm run build && firebase deploy --only hosting:me
```
