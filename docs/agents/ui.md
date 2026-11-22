# UI rules — mobile-first and responsive design

> Loaded on demand. The always-on rules are in `.github/copilot-instructions.md` (also `AGENTS.md` / `CLAUDE.md`), which says when to read this file.

## 📱 UI/UX Requirements - Mobile-First & Responsive Design

**ALL new UI components MUST be mobile-friendly and responsive. This is mandatory, not optional.**

### Design Principles
- **Mobile-first approach:** Design for small screens first, then scale up
- **Touch-friendly:** All buttons/clickable elements ≥ 44px × 44px (iOS HIG standard)
- **Readable on small screens:** No horizontal scroll; 16px min font size for body text
- **Accessible:** Proper color contrast, keyboard navigation, aria labels

### Implementation Standards

1. **Use Tailwind responsive utilities:** `sm:`, `md:`, `lg:`, `xl:` breakpoints
   ```tsx
   <div className="flex flex-col md:flex-row gap-4 md:gap-6">
     <div className="w-full md:w-1/2">Content</div>
   </div>
   ```

2. **Form pages on mobile:** Use full-screen form pages instead of modals
   - ✅ Navigate to dedicated form pages — user forms use `/users/new/:type` and `/users/edit/:type/:uid`
   - ✅ Use full-page real estate on mobile (no modal overlay)
   - ✅ Include back button to return to list
   - ✅ Wrap form in `PageShell` for consistent layout
   - ✅ Make forms responsive with Tailwind utilities
   - Example pattern:
     ```tsx
     // List page with navigation — type = "member" | "client"
     <button onClick={() => navigate('/users/new/member')}>Add Member</button>
     <button onClick={() => navigate('/users/new/client')}>Add Client</button>
     <button onClick={() => navigate(`/users/edit/member/${uid}`)}>Edit</button>
     
     // UserFormPage reads :type param and renders TeamMemberForm or ClientForm
     // All users (clients, team_member, manager, admin) live at /users
     ```

3. **Forms on mobile:**
   - ✅ Full-width inputs on small screens
   - ✅ Stack form fields vertically
   - ✅ Use dropdown/select on mobile instead of complex multi-select UI
   - ✅ Increase input padding for touch: `px-4 py-3`

4. **Tables on mobile:**
   - ❌ **DO NOT** force table display on small screens (causes horizontal scroll)
   - ✅ Convert to stacked card view on mobile (`md:table` for desktop, block for mobile)
   - ✅ Show key columns first, hide secondary info on small screens

5. **Navigation:**
   - ✅ Collapsible sidebar on mobile
   - ✅ Hamburger menu for navigation
   - ✅ Sticky top bar with back button on small screens

6. **Testing before commit:**
   - Test in Chrome DevTools: `iPhone 12/14`, `Pixel 5`, `iPad Pro` (768px and 1024px widths)
   - Test on actual phone if possible
   - Verify no horizontal scroll on any page
   - Verify all buttons are tappable (≥44px)

### When adding new components:
- Always include breakpoint tests in your commit message
- Reference an existing form page (e.g., `Portal/src/pages/users/UserFormPage.tsx`) as the layout pattern instead of inventing a new one
