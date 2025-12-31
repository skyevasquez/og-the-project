# Plan: Create PR for UI Improvements and Social Integration

## Summary
Create a pull request with the following changes:
- Fix Hero section layout issues (height, overflow, text clipping)
- Add Threads social icon to footer
- Add React Grab dev tools

## Changes to Commit
1. **components/Hero.tsx** - Fixed layout issues:
   - Increased hero height: `h-[70vh] md:h-[85vh] lg:h-[90vh]`
   - Changed `overflow-hidden` to `overflow-x-hidden`
   - Increased bottom padding: `pb-12 md:pb-24 lg:pb-32`
   - Scaled down font size: `text-4xl md:text-6xl lg:text-7xl`
   - Increased line height: `leading-[1.1]`

2. **components/Footer.tsx** - Added Threads social icon:
   - New link to `https://www.threads.com/@og_theproject`
   - Uses "@" symbol with matching styling

3. **index.html** - Added React Grab dev script

4. **package.json & package-lock.json** - Added dev dependencies

## Execution Steps
1. Stage and commit all changes (excluding conductor.json)
2. Push to origin
3. Create PR with gh cli

## Files to Modify
- components/Hero.tsx
- components/Footer.tsx
- index.html
- package.json
- package-lock.json
