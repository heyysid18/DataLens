# Git Commit Strategy (v2 Upgrade)

This document outlines the strict commit strategy used for the DataLens v2 Upgrade. We follow the **Conventional Commits** specification.

## Commit Message Format

```text
<type>(<optional scope>): <description>

[optional body]
```

## Types Used

- **`feat`**: A new feature (e.g., adding dark mode, search bar, pagination)
- **`fix`**: A bug fix (e.g., fixing route protection logic, layout shifting)
- **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, Tailwind class injection)
- **`refactor`**: A code change that neither fixes a bug nor adds a feature (e.g., extracting logic into `useDebounce`)
- **`chore`**: Changes to the build process or auxiliary tools and libraries (e.g., installing new dependencies)
- **`docs`**: Documentation only changes (e.g., updating `README.md`)

## v2 Upgrade Commit History Map
When pushing this v2 architecture upgrade to GitHub, these commits represent the sequence of development:

1. `chore(deps): install framer-motion and react-hot-toast`
   - Added core motion and notification dependencies to `package.json`.

2. `feat(theme): implement global Context based Dark Mode`
   - Created `ThemeContext.jsx` and updated `index.css` with dark variants.
   - Injected Theme toggle in `Navbar.jsx`.

3. `feat(list): add debounced search, sort, and pagination`
   - Replaced static list map with useMemo driven `filteredAndSortedData`.
   - Added custom `useDebounce` hook.

4. `style(ui): apply dark mode classes across all page views`
   - Refactored `DetailsPage`, `ChartPage`, `MapPage`, and `LoginPage` syntax to support `dark:` tailwind prefix accurately.

5. `feat(animations): integrate framer-motion page transitions`
   - Added `<motion.div>` page enter/exit layouts and table row stagger animations.

6. `feat(ux): implement react-hot-toast global notifications`
   - Wrapped App in `<Toaster />`.
   - Setup `toast.success` and `toast.error` for API fetch states and Login flow.

7. `docs: generate v2 DataLens README and commit strategy map`
