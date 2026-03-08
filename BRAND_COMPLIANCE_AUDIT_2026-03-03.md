# Lifewood Brand Compliance Audit (2026-03-03)

Reference used: `C:\Users\twinky\Downloads\Llifewood brand style guide 3 (3).pdf`

## Style Guide Rules Extracted

- Official palette:
  - `#046241` Castleton Green
  - `#133020` Dark Serpent
  - `#FFB347` Saffaron (accent use)
  - `#FFC370` Earth Yellow
  - `#F5EEDB` Paper
  - `#FFFFFF` White
- Typography:
  - Manrope for western pages
  - Display/Headline/Body hierarchy with 2:1 scaling guideline
  - Left or center alignment only
- Logo usage:
  - No stretch, tilt, recolor, shadow, outline
  - Preserve lockup and clear space
- Layout guidance:
  - White/Paper as dominant backgrounds
  - Rounded boxes for images/diagrams/screenshots
  - Keep clean and structured visual tone

## Audit Findings (Codebase)

- Found large number of non-approved color literals across `src/styles/App.css` and multiple page components.
- Found mixed off-brand accent shades (for example several orange variants not in the approved palette).
- Found mixed white/off-white background tones outside `#FFFFFF` and `#F5EEDB`.
- Found logo-related CSS effects (filters/transforms) in multiple places.
- Typography already mostly Manrope, but not uniformly enforced at global level.

## Automatic Corrections Applied

1. Added centralized compliance stylesheet:
   - `src/styles/brand-compliance.css`
2. Enforced global Manrope typography across UI text elements.
3. Enforced approved palette tokens and accent behavior (Saffaron/Earth Yellow on action controls).
4. Normalized major brand surfaces (hero/footer/legal headers) to approved green gradient family.
5. Normalized legal page bodies/cards to Paper/White backgrounds and consistent border/rounding.
6. Added logo safety rules to remove stretch/tilt/recolor/shadow/outline effects on Lifewood logos.
7. Ensured alignment policy by enforcing left/center usage on key content wrappers.
8. Updated section identity system to use approved palette only:
   - `src/styles/section-system.css`
9. Loaded compliance layer globally:
   - `src/main.jsx`

## Notes

- This implementation is modular and non-functional (styling only).
- Routing and application behavior were not changed.
- Existing content structure was preserved.
