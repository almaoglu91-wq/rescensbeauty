# rescens · rhode-style shopify sections

Standalone Shopify-Sections im Rhode-Stil (cremig-beige Palette, lowercase Typo, asymmetrische Grids) — für deine **rescens Produktseite**. Jede Section ist eine eigene `.liquid`-Datei mit eigenem Schema, Blöcken und Theme-Editor-Presets. Du kannst sie einzeln hinzufügen, neu sortieren, ausblenden oder löschen, ohne dass andere Sections kaputtgehen.

## Was ist drin

```
assets/
  rescens.css          # alle Styles (gescopet unter .rescens-scope)
  rescens.js           # Bundle-Select, Before/After-Slider, Bottom-Sheet, Gallery

snippets/
  rescens-assets.liquid  # lädt CSS + Font + JS

sections/
  rescens-announcement.liquid   # Top-Banner + Live-Ticker
  rescens-product-hero.liquid   # Gallery + Bundles + Sub-Toggle + Preis + CTA + Trust + Live-Notif + Derm
  rescens-stats.liquid          # „die zahlen aus 8 wochen"
  rescens-founder.liquid        # Founder Story (warm bg)
  rescens-domino.liquid         # „warum peptide statt hormone" (dark bg)
  rescens-comparison.liquid     # Vergleichstabelle rescens vs. andere
  rescens-timeline.liquid       # „im zeitverlauf" (vertikal)
  rescens-before-after.liquid   # interaktiver Vorher/Nachher-Slider
  rescens-how.liquid            # „drei schritte. zehn sekunden."
  rescens-ingredients.liquid    # „vier peptide. ein komplex." + INCI-Akkordeon
  rescens-ugc.liquid            # horizontaler UGC-Scroller
  rescens-stack-offer.liquid    # „mehr als ein serum" Stack-Wert (dark bg)
  rescens-guarantee.liquid      # 60 Tage Garantie
  rescens-faq.liquid            # „in case you are wondering..." + FAQ-Akkordeon
  rescens-why.liquid            # „warum alle darüber reden" (peach bg)
  rescens-reviews.liquid        # Reviews mit Summary + Filter + Cards
  rescens-trust-badges.liquid   # 6er-Grid Trust-Badges (warm bg)
  rescens-cross-sell.liquid     # „häufig gemeinsam gekauft"-Karte
  rescens-compliance.liquid     # Studien-Compliance-Footer
  rescens-big-logo.liquid       # XXL „rescens"-Wortmarke
  rescens-sticky-cta.liquid     # Fixierte Bottom-Bar + Bottom-Sheet (Variantenwahl)
```

## Installation

### Option A — Über Shopify Admin (empfohlen)

1. Lade dein Theme als ZIP herunter (`Themes → ⋯ → Edit code`).
2. Im Code-Editor links **+ Add a new asset** → die beiden Dateien aus `assets/` hochladen.
3. **+ Add a new snippet** → `rescens-assets` mit dem Inhalt aus `snippets/rescens-assets.liquid` anlegen.
4. **+ Add a new section** → für jede `.liquid`-Datei aus `sections/` eine Section anlegen, Namen 1:1 übernehmen (z. B. `rescens-product-hero`), Inhalt einfügen.
5. **Online Store → Themes → Customize**.
6. Auf der Produktseite (oder einer beliebigen Page) → **Add section** → Kategorie **„rescens"** → die gewünschten Sections hinzufügen.

### Option B — Per Shopify CLI

```bash
shopify theme pull --store=<your-store>.myshopify.com --live=false
# kopiere die files in das ausgechecktem theme:
cp -R assets/rescens.* path/to/theme/assets/
cp snippets/rescens-assets.liquid path/to/theme/snippets/
cp sections/rescens-*.liquid path/to/theme/sections/
shopify theme push --store=<your-store>.myshopify.com --unpublished
```

## Reihenfolge (matched das mockup)

Empfohlene Reihenfolge auf der Produktseite — kannst du im Theme-Editor jederzeit per Drag&Drop ändern:

1. `rescens · announcement bar`
2. `rescens · product hero`
3. `rescens · stats`
4. `rescens · founder story`
5. `rescens · domino`
6. `rescens · comparison`
7. `rescens · timeline`
8. `rescens · before/after`
9. `rescens · how it works`
10. `rescens · ingredients`
11. `rescens · ugc carousel`
12. `rescens · stack offer`
13. `rescens · guarantee`
14. `rescens · faq`
15. `rescens · why everyone talks`
16. `rescens · reviews`
17. `rescens · trust badges`
18. `rescens · cross-sell card`
19. `rescens · compliance footer`
20. `rescens · big logo`
21. `rescens · sticky cta` (immer am Ende — fixed-position)

## Section verstecken (ohne Löschen)

Im Theme-Editor: Section anklicken → 👁️-Symbol oben rechts → die Section wird auf der Frontend ausgeblendet, bleibt aber in der Konfiguration erhalten. So kannst du jede Section testweise deaktivieren.

## Design-Anpassung

Farben und Variablen sind in `assets/rescens.css` ganz oben definiert (CSS-Variablen unter `.rescens-scope { ... }`). Anpassen z. B. so:

```css
.rescens-scope {
  --rs-bg: #F2ECE2;      /* hintergrund cream */
  --rs-peach: #EBA88C;   /* accent (rhode-ish) */
  --rs-ink: #1F1D1A;     /* primary text */
}
```

Alle Styles sind unter `.rescens-scope` gescopet, kollidieren also nicht mit deinem bestehenden Theme.

## Bundles & Variantenwahl

Im **`rescens · product hero`** kannst du pro Bundle-Block eine Shopify Variant ID hinterlegen (`Variant ID` im Block-Setting). Der Submit geht an `/cart/add` mit dem `id`-Feld der gewählten Variante.

Die Variant ID findest du im Shopify-Admin unter dem Produkt → Variante anklicken → URL: `.../variants/<VARIANT_ID>`.

## JS-Verhalten im Theme Editor

`rescens.js` re-initialisiert sich automatisch bei `shopify:section:load` / `shopify:section:select`, sodass die interaktiven Elemente (Bundles, Slider, Bottom-Sheet) auch im Live-Editor funktionieren.

## Bekannte Grenzen

- **Bilder**: alle Sections verwenden `image_picker`-Settings. Solange du keine Bilder hochlädst, sind die Bildflächen leer/cremfarben. Lade deine Produktbilder, UGC-Stills, Founder-Foto, Vorher/Nachher etc. über die Section-Settings hoch.
- **Bundles & Cart**: die Bundle-Logik im Hero ist clientseitig (radio-style). Für das tatsächliche Hinzufügen zum Warenkorb braucht jeder Bundle-Block eine gültige `variant_id`.
- **Sticky CTA** belegt unten ~76 px viewport — die Section setzt automatisch `padding-bottom` auf `<body>`.
