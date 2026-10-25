# MASTER PROJECT SPECIFICATION
# Professional Website Audit, Brand Analysis, 3–5 Premium Design Concepts, Interactive Gallery and Persistent Progress Recovery

## 1. YOUR ROLE

Act as a professional multidisciplinary team consisting of:

- Senior UI/UX Designer
- Creative Director / Art Director
- Senior Frontend Developer
- Brand Identity Designer
- Conversion Rate Optimization (CRO) Specialist
- Responsive Design Specialist
- Accessibility Specialist
- Frontend QA Engineer

Your task is to analyze the existing website project, understand the company's business and brand identity, evaluate the new printed catalog or its screenshots, and develop 3–5 fundamentally different, premium-quality website design concepts.

You must work directly with the existing project files.

The expected result is a working implementation, not merely a written report, design recommendation, or collection of static mockups.

Create a polished presentation gallery where the user can compare the concepts and open each complete website.

The project may require multiple working sessions. You must implement a reliable file-based checkpoint and recovery system so work can resume after a computer shutdown, connection failure, terminal closure, agent restart, or context limit.

All essential project requirements and progress information must be recoverable from files stored in the project directory.

---

# 2. PRIMARY OBJECTIVES

The final website concepts must be:

- Premium and sophisticated
- Visually engaging and memorable
- Modern and professionally executed
- Business-oriented
- Trustworthy and credible
- Appropriate for the company's actual industry
- Attractive to its target audience
- Commercially persuasive
- Easy to navigate
- Responsive across devices
- Technically maintainable

The goal is not to recolor the existing website or produce several variations of the same template.

The goal is to explore genuinely different creative directions that could realistically be presented to a business owner for selection.

The completed project must include:

1. A professional audit of the existing website.
2. An analysis of the new printed catalog or catalog screenshots.
3. An inventory of available photographs, logos, icons, fonts, and other assets.
4. Three to five distinct website design concepts.
5. A working gallery for comparing and opening the concepts.
6. Complete, functional website previews.
7. Responsive implementations.
8. Browser testing and visual refinement wherever possible.
9. A comparison scorecard and a reasoned recommendation.
10. Persistent progress files and a reliable recovery procedure.
11. Clear instructions for running and continuing the project.

---

# 3. CRITICAL RULE: PERSISTENT PROGRESS AND RECOVERY

This is a potentially long-running project.

The computer may shut down, the internet connection may fail, the agent may terminate, the terminal may close, or the available context may run out.

You must not rely exclusively on chat history, temporary agent memory, terminal output, or conversation context.

**All essential project state must be saved to files on disk.**

A new agent session must be able to reconstruct the project's current state and continue without requiring the user to explain the entire task again.

Progress tracking is a mandatory part of the project, not an optional documentation task.

## 3.1. Create the project control files immediately

Before substantial implementation, create the following files in the project root.

### `AGENT_TASK.md`

Contains the complete original project specification.

Preserve the requirements in this document.

If this specification is supplied as the initial task, save its complete contents to this file before starting substantial implementation.

If the file already exists, inspect it before modifying it. Do not overwrite existing project instructions without checking their purpose.

### `PROGRESS.md`

The authoritative summary of the current project state.

It must contain:

- Project root and identification
- Technology stack
- Current project stage
- Current subtask
- Last verified checkpoint
- Completed work
- Work in progress
- Files created
- Files modified
- Build and test status
- Known issues
- Blockers
- Unresolved questions
- Next exact actions
- Instructions for resuming work
- Last checkpoint timestamp, including timezone when available

Distinguish completed and verified work from attempted or partially completed work.

### `TASK_CHECKLIST.md`

A detailed checklist covering all stages of the project.

Use the following status labels:

- `[TODO]`
- `[IN PROGRESS]`
- `[BLOCKED]`
- `[DONE]`

Organize the checklist into:

1. Project discovery
2. Catalog and screenshot analysis
3. Asset inventory
4. Existing website audit
5. Business strategy
6. Creative direction
7. Skills inspection
8. Concept gallery
9. Concept A implementation
10. Concept B implementation
11. Concept C implementation
12. Concept D implementation, if required
13. Concept E implementation, if required
14. Responsive design
15. Interactions
16. Accessibility
17. Browser testing
18. Visual refinement
19. Final comparison
20. Documentation and handoff

Mark a task `[DONE]` only after its completion has been verified to the extent possible.

### `DECISIONS.md`

Record important design and technical decisions, including:

- Framework and routing strategy
- Design concept names and philosophies
- Color palettes
- Typography
- Selected assets
- Component architecture
- CSS isolation
- Responsive strategy
- Deployment considerations
- Important trade-offs
- Rejected approaches and reasons
- User-approved decisions

Do not repeatedly reconsider established decisions unless new evidence justifies doing so.

### `SESSION_LOG.md`

Maintain a concise chronological record of significant work.

Each entry should include:

- Date and time
- Stage completed
- Files created or modified
- Commands executed when relevant
- Test results
- Errors encountered
- Important decisions
- Next planned action

Avoid excessively verbose logging. Record information that will help a future session resume efficiently.

## 3.2. Checkpoint frequency

Save checkpoints:

- After initial project inspection
- After locating and analyzing the catalog
- After analyzing `style-images`
- After completing the asset inventory
- After completing the existing website audit
- After defining the design concepts
- After implementing the gallery
- After completing each individual concept
- After major architectural changes
- After significant build or testing milestones
- Before potentially destructive operations
- Whenever an error or blocker occurs
- Before the agent ends a session
- Before the context limit is reached, when detectable
- Before final delivery

Do not wait until the entire project is finished to save progress.

## 3.3. Checkpoint procedure

At each major checkpoint:

1. Save all completed code changes to disk.
2. Inspect the actual project state.
3. Update `TASK_CHECKLIST.md`.
4. Update `PROGRESS.md`.
5. Append a concise entry to `SESSION_LOG.md`.
6. Update `DECISIONS.md` if a meaningful decision has been made.
7. Verify that the checkpoint files have been written successfully.
8. Continue with the next task.

Where practical, use safe file replacement when updating checkpoint documents so an interrupted write does not destroy the previous valid checkpoint.

Do not claim that a file was saved unless the write was successful.

Keep the project runnable whenever practical.

If an operation is interrupted, inspect its actual results before repeating it.

## 3.4. Recovering from an interruption

At the beginning of every new session, first:

1. Read `AGENT_TASK.md`.
2. Read `PROGRESS.md`.
3. Read `TASK_CHECKLIST.md`.
4. Read `DECISIONS.md`.
5. Read the latest relevant entries in `SESSION_LOG.md`.
6. Inspect Git status and the current branch, if Git is available.
7. Inspect the actual project files.
8. Verify the recorded state against the files on disk.
9. Identify incomplete or interrupted operations.
10. Reconcile discrepancies between documentation and implementation.
11. Resume from the last verified checkpoint.

Do not restart the project from the beginning.

Do not repeat completed work unnecessarily.

Do not discard uncommitted changes.

The actual project files are the source of truth for implemented work. The progress documents describe the intended state and next actions, but they must be verified against the real project.

If a checkpoint is missing or corrupted, reconstruct the state using the remaining files and Git history where available. Then create a new checkpoint.

## 3.5. Graceful stopping

If the user asks to stop, the context is nearly exhausted, or the session is about to end:

1. Stop starting new major tasks.
2. Finish or safely leave the current operation in a recoverable state.
3. Save completed changes.
4. Update all relevant progress files.
5. Record incomplete operations.
6. Record the exact next action.
7. Record any required commands.
8. Report the current state to the user.

Do not sacrifice a valid checkpoint in an attempt to finish more work.

If the computer shuts down unexpectedly, resume from the last successfully saved checkpoint.

## 3.6. Important limitation

Persistent progress files do not keep a local agent running after the computer shuts down or its execution environment stops.

They preserve the state needed to continue when the agent is started again.

Do not promise continuous background execution unless an actual supported mechanism has been configured and verified.

---

# 4. PROJECT DISCOVERY

Before changing the website, inspect the existing project thoroughly.

Identify:

- Project structure
- Framework and technology stack
- Entry points
- Existing routes
- Pages and components
- Stylesheets
- JavaScript and TypeScript files
- Package manager
- Build scripts
- Dependencies
- Existing assets
- Documentation
- Environment assumptions
- Deployment requirements
- Git status and branch
- Existing uncommitted changes

Read relevant instructions in files such as `AGENTS.md`, `README.md`, or other project-specific documentation.

Use the existing technology stack whenever reasonable.

Do not rewrite the application or migrate frameworks without a compelling technical reason.

Preserve useful business functionality and existing user changes.

Create an initial checkpoint when discovery is complete.

---

# 5. CATALOG DISCOVERY — DOCUMENT OR SCREENSHOTS

The new printed catalog may be available as a PDF, another document, image files, or only screenshots.

You must support all these scenarios.

## Scenario A — A complete catalog document exists

Search the project for:

- PDF
- JPG or JPEG
- PNG
- WebP
- Other image formats
- Documents containing the catalog pages

Inspect the complete document where practical.

Do not analyze only its first page.

If the document contains scanned pages or embedded images, inspect the page visuals as well as any extractable text.

## Scenario B — Only catalog screenshots exist

If no usable complete catalog is found, inspect the project directory:

`style-images`

This folder contains screenshots of the printed catalog.

Treat the screenshots as the primary visual reference for the catalog's design.

Inspect all relevant images in the folder.

Identify:

- Filenames
- Dimensions
- Image formats
- Visible catalog pages or sections
- Repeated or overlapping screenshots
- Missing sections or incomplete visual information

If screenshots overlap, use the visible overlaps to understand the intended page layout.

Do not assume that each screenshot represents a complete page.

Use visual inspection tools where available.

Do not rely exclusively on OCR or extracted text.

If a screenshot cannot be opened or interpreted, document the limitation and analyze the remaining accessible images.

Record the actual filenames used as references in the catalog analysis.

## Scenario C — Both documents and screenshots exist

Inspect both sources.

Determine whether they represent the same catalog version.

If the visual details conflict, document the differences.

Prefer a source explicitly identified as the latest version. If the latest version cannot be established, flag the uncertainty.

## Scenario D — No usable catalog reference exists

If neither a usable document nor relevant screenshots are available:

1. Report which locations and file types were inspected.
2. Explain which material is missing.
3. Ask the user to provide the catalog or screenshots.
4. Do not pretend to have analyzed an unavailable source.

You may continue the existing website audit and asset inventory, but do not invent a catalog design identity.

Save a checkpoint after completing the catalog discovery and analysis.

---

# 6. CATALOG VISUAL ANALYSIS

Analyze the catalog as a complete visual communication system.

Evaluate:

## Color system

- Dominant colors
- Secondary colors
- Accent colors
- Backgrounds
- Text colors
- Contrast
- Color proportions
- Light and dark surfaces
- Color combinations

Where practical, estimate representative HEX values.

Treat sampled colors as approximations when screenshots contain compression, lighting, or color shifts.

Distinguish intentional brand colors from colors found only in photographs.

## Typography

- Font families, if identifiable
- Serif and sans-serif combinations
- Headline styles
- Body typography
- Font weights
- Letter spacing
- Line height
- Heading hierarchy
- Numeric and technical typography

If exact fonts cannot be identified, recommend suitable alternatives without claiming certainty.

## Layout and composition

- Grid
- Alignment
- Margins
- White space
- Text-to-image ratios
- Symmetry and asymmetry
- Page density
- Image cropping
- Graphic dividers
- Decorative shapes
- Section rhythm

## Brand identity

- Logo treatment
- Brand recognition
- Visual tone
- Premium perception
- Professional credibility
- Distinctive graphic elements
- Consistency across pages

## Business communication

Determine which brand characteristics are supported by the actual material.

Possible characteristics include luxury, reliability, technical precision, innovation, exclusivity, established expertise, or creativity.

Do not assume any characteristic without evidence.

## Deliverables

Document:

1. The catalog's strongest visual characteristics.
2. Its apparent brand positioning.
3. Recommended colors and typography.
4. Graphic elements suitable for the website.
5. Elements that should remain exclusive to print.
6. Potential conflicts with existing assets.
7. Opportunities for improving the online brand experience.
8. Uncertainties caused by incomplete references.

Save the analysis in an appropriate project document and record the checkpoint.

---

# 7. EXISTING ASSET INVENTORY

Search the entire project for:

- Company logos
- Alternative logo versions
- Product photographs
- Company and team photography
- Service-related images
- Background images
- SVG illustrations
- Icons
- PNG, JPG, JPEG, WebP, AVIF, and other image formats
- Fonts
- Graphic patterns
- Existing brand references

Record:

- File path
- Asset type
- Likely purpose
- Suitable concepts
- Quality or resolution concerns
- Recommended adaptation

Distinguish original assets from catalog screenshots and unrelated project images.

## Asset rules

Existing logos, photographs, and icons may have colors that differ from the catalog.

This does not automatically make them unsuitable.

Evaluate how they can be integrated into each concept through appropriate background colors, monochrome logo variants, SVG recoloring, contrast adjustments, image treatment, or complementary accent colors.

Do not modify original files destructively.

Create separate derivatives when necessary.

Do not recolor photographs aggressively if it damages realism or product accuracy.

Do not replace an existing company logo with an invented logo.

Do not replace relevant real photography with unrelated stock imagery simply because it is easier to use.

Save the asset inventory and update the checkpoint.

---

# 8. PROFESSIONAL WEBSITE AUDIT

Evaluate the existing website from four perspectives.

## 8.1. Visual quality

Assess:

- Hierarchy
- Typography
- Spacing
- Color balance
- Photography
- Consistency
- Modernity
- Originality
- Readability
- Brand identity
- Premium perception

Identify strengths as well as weaknesses.

## 8.2. User experience

Assess:

- Navigation
- Information architecture
- User journeys
- Content discoverability
- Interaction feedback
- Mobile usability
- Forms
- Calls to action
- Accessibility

## 8.3. Business effectiveness

Evaluate whether the website clearly communicates:

- What the company offers
- Who its customers are
- Which problems it solves
- Why customers should choose it
- What differentiates it
- Why it deserves trust
- What the visitor should do next

Identify opportunities to improve the value proposition, commercial messaging, trust signals, content structure, and conversion paths.

Do not invent testimonials, client logos, certifications, statistics, awards, or business achievements.

Use actual available business information.

## 8.4. Technical quality

Assess:

- Code organization
- Component reuse
- CSS architecture
- Responsive behavior
- Semantic HTML
- Accessibility
- Performance risks
- Image optimization
- Technical debt
- Broken links
- Console errors
- Existing functionality
- Build compatibility
- Deployment compatibility

Produce a concise, useful audit report.

Use the findings to guide the new concepts.

---

# 9. BUSINESS AND CREATIVE STRATEGY

Determine the company's business objectives from the existing project.

Identify:

- Primary audience
- Secondary audience, if relevant
- Main products or services
- Core value proposition
- Desired brand perception
- Primary conversion goal
- Secondary conversion goals
- Important trust signals
- Key differentiators
- Essential existing functionality

Adapt the design to the actual business.

Do not assume that every company needs the same landing page structure.

For technical and industrial businesses, emphasize expertise, credibility, service quality, specifications, and reliability where appropriate.

For premium consumer-facing businesses, emphasize visual storytelling, product presentation, emotional appeal, and exclusivity where appropriate.

For B2B businesses, emphasize the offer, commercial benefits, expertise, case studies, and clear contact paths where appropriate.

If critical information is unavailable, document the uncertainty and proceed with the strongest evidence-supported interpretation.

---

# 10. DEVELOP 3–5 FUNDAMENTALLY DIFFERENT CONCEPTS

Develop five concepts whenever five meaningful directions are supported by the available information.

If not, create three or four strong alternatives rather than superficial variations.

The concepts must differ in layout, composition, typography, visual hierarchy, color strategy, imagery, and storytelling.

Changing only the accent color does not constitute a distinct concept.

Use these directions as inspiration and adapt them to the company.

## Concept A — Modern Corporate Premium

- Sophisticated color palette
- Strong typography
- Structured layout
- Professional photography
- Clear business messaging
- Restrained decoration
- Refined interactions
- Strong trust signals

The result should feel established, reliable, professional, and premium.

## Concept B — Bold Editorial Luxury

- Expressive headlines
- Editorial composition
- Asymmetric layouts
- High-impact photography
- Strong contrast
- Carefully controlled white space
- Distinctive art direction

The result should feel exclusive, confident, and memorable.

## Concept C — Contemporary Digital Innovation

- Modern compositions
- Sophisticated layering
- Interactive elements
- Refined transitions
- Carefully controlled accents
- Strong service presentation
- Forward-looking visual identity

Avoid generic technology-startup aesthetics unless appropriate.

## Concept D — Minimalist Architectural Precision

- Exceptional attention to alignment
- Restrained typography
- Strong proportions
- Minimal decoration
- Integrated photography
- Purposeful use of white space
- Subtle interactions

The result should feel calm, expensive, precise, and deliberate.

## Concept E — Expressive Brand Experience

- Strong visual storytelling
- Distinctive photography
- Unexpected but usable compositions
- Memorable transitions
- Interactive product or service presentations
- Recognizable visual signature
- Carefully art-directed motion

The result should feel lively and engaging without losing professionalism.

Replace any direction if a different concept is better suited to the actual business.

At least one concept should explore a close digital adaptation of the printed catalog.

The other concepts should explore distinct premium alternatives.

## Requirements for every concept

Each concept must include:

- A complete homepage
- A distinctive hero
- Clear navigation
- A strong value proposition
- A primary call to action
- Real business content
- Appropriate existing assets
- A coherent color system
- A coherent typography system
- Multiple fully designed sections
- A professional footer
- Responsive layouts
- Functional navigation
- Working interactive elements
- Hover, focus, active, and touch states

Do not stop after implementing a hero section.

Preserve important existing website functionality.

Save a checkpoint after the creative directions have been finalized.

---

# 11. IMPLEMENT THE DESIGN CONCEPT GALLERY

Create a separate gallery page within the existing project.

Suggested route:

`/design-concepts/`

Adapt it to the actual framework and routing architecture.

The gallery must function as a professional presentation tool.

## Gallery requirements

Include:

- A clear title
- A short introduction
- A visual preview of every concept
- Concept name
- Design philosophy
- Color palette
- Typography direction
- Commercial positioning
- Main advantages
- Potential limitations
- An action to open the full website

Use consistent preview proportions and polished presentation.

Prefer screenshots of the actual implemented websites.

If browser screenshots are unavailable, create carefully designed previews from the actual concept layouts and assets.

Do not substitute unrelated stock imagery or generic placeholder thumbnails.

## Concept routes

Provide independent routes for every concept, for example:

- `/design-concepts/concept-a/`
- `/design-concepts/concept-b/`
- `/design-concepts/concept-c/`
- `/design-concepts/concept-d/`
- `/design-concepts/concept-e/`

Adapt these examples to the existing project.

Clicking a preview must open the corresponding complete website.

Provide a visible way to return to the gallery.

Make every concept directly accessible through its own route.

Ensure compatibility with the existing deployment environment, including static hosting if applicable.

Where practical, allow quick navigation between alternatives.

Save a checkpoint after the gallery has been implemented and verified.

---

# 12. FRONTEND ARCHITECTURE

Use the existing technology stack whenever reasonable.

Do not migrate frameworks without a compelling technical reason.

If the project uses React, use appropriate reusable components and routing.

If it uses plain HTML, CSS, and JavaScript, preserve that approach unless the existing architecture clearly requires something else.

Isolate the styling of each concept using suitable components, CSS modules, scoped styles, or equivalent techniques.

Create an appropriate design system for each concept, including:

- Color tokens
- Typography
- Spacing
- Layout widths
- Grid
- Border radii
- Shadows
- Buttons
- Forms
- Navigation
- Cards
- Section backgrounds
- Motion rules

Use CSS custom properties or the framework's equivalent.

Avoid:

- Global CSS collisions
- Unnecessary `!important`
- Duplicate styles
- Unnecessary dependencies
- Unmaintainable selectors
- Destructive changes to existing files

Keep the original website accessible wherever practical.

After each major implementation stage, inspect the changed files and run the appropriate validation command.

Record the results in the progress files.

---

# 13. VISUAL QUALITY

Prioritize:

- Strong composition
- Excellent typography
- Deliberate spacing
- High-quality imagery
- Balanced color relationships
- Clear hierarchy
- Consistent alignment
- Distinctive art direction
- Refined interactions
- Mobile usability

Avoid:

- Generic AI-generated aesthetics
- Identical templates with different colors
- Repetitive card grids
- Excessive rounded rectangles
- Unnecessary floating elements
- Random gradients
- Excessive glassmorphism
- Gratuitous animation
- Decorative icons without purpose
- Poor image cropping
- Inconsistent typography
- Weak contrast
- Fake business statistics
- Generic filler content

Every visual element must contribute to brand identity, usability, storytelling, or commercial effectiveness.

---

# 14. ANIMATIONS AND INTERACTIONS

Where appropriate, implement:

- Smooth navigation transitions
- Subtle reveal animations
- Refined hover effects
- Button feedback
- Image transitions
- Interactive tabs
- Accordions
- Useful carousels
- Subtle background movement
- Scroll-based effects
- Responsive touch interactions

Animation styles should reflect each concept's identity.

Respect `prefers-reduced-motion`.

Do not make essential content or functionality dependent on animation.

Avoid hover-only interactions on mobile.

Prioritize performance and usability.

---

# 15. RESPONSIVE DESIGN

Test representative viewport widths:

- Mobile: approximately 375–430 px
- Tablet: approximately 768 px
- Laptop: approximately 1366 px
- Desktop: approximately 1440–1920 px

Verify:

- No unintended horizontal overflow
- No broken layouts
- No overlapping content
- Appropriate typography scaling
- Readable text
- Proper image cropping
- Functional mobile navigation
- Adequate touch targets
- Visible keyboard focus
- Correct spacing
- Usable forms and buttons

Adapt the composition to each screen size instead of simply shrinking the desktop layout.

Test the gallery as well as the individual concepts.

---

# 16. ACCESSIBILITY

Implement appropriate accessibility practices:

- Semantic HTML
- Logical heading hierarchy
- Meaningful alternative text
- Keyboard-accessible navigation
- Visible focus indicators
- Sufficient contrast
- Appropriate form labels
- Accessible error states
- Reduced-motion support

Target WCAG 2.2 AA practices where applicable.

Do not claim formal compliance without appropriate verification.

---

# 17. FRONTEND SKILLS AND TOOLING

Before implementation, inspect the skills and capabilities actually available to the agent.

Look for skills related to:

- Frontend Design
- UI/UX Design
- Web Design
- Responsive Design
- Advanced CSS
- React, if applicable
- Design systems
- Browser Automation
- Playwright
- Visual Regression Testing
- Accessibility
- Frontend Performance

Use the agent's native skill-discovery mechanism and inspect the actual instructions of relevant installed skills.

Apply those instructions during implementation.

Do not claim that a skill was used unless it was actually used.

## Missing skills

If relevant skills are missing, report:

- Which skills are available
- Which are missing
- Exact skill names or packages, where known
- Official installation instructions or documentation
- Why each recommendation is useful
- Any required permissions or dependencies

Verify package names and installation commands against authoritative documentation where possible.

Do not invent skill names or commands.

Do not install untrusted skills without reviewing their source and purpose.

If installation requires user approval, ask first.

If no suitable skills are available, continue using the strongest native capabilities and document the limitation.

Do not abandon the project solely because a recommended skill is unavailable.

---

# 18. BROWSER TESTING AND VISUAL QA

Use Playwright or another installed browser automation tool whenever possible.

For each concept:

1. Start the development server.
2. Open the concept in a browser.
3. Inspect desktop rendering.
4. Inspect mobile rendering.
5. Inspect tablet rendering.
6. Verify image and font loading.
7. Test navigation.
8. Test primary calls to action.
9. Test important interactions.
10. Check horizontal overflow.
11. Check console errors.
12. Check failed network requests when supported.
13. Capture screenshots where possible.
14. Review the screenshots critically.
15. Fix visible issues.
16. Repeat relevant tests.

Test the gallery separately.

Verify that each preview opens the correct website and that returning to the gallery works.

Verify direct navigation to each concept route.

If static deployment is required, inspect the routing and asset-path assumptions.

Do not claim that browser testing or screenshot verification was completed unless it actually was.

If browser automation is unavailable, perform the strongest alternative checks and document what remains unverified.

Save checkpoints after substantial testing cycles.

---

# 19. BUSINESS-ORIENTED COMPARISON

Evaluate every concept using a consistent 10-point scale.

Assess:

1. Visual quality
2. Premium perception
3. Originality
4. Brand fit
5. Alignment with the printed catalog
6. Business effectiveness
7. Clarity of the offer
8. Trust and credibility
9. UX and usability
10. Responsive potential
11. Conversion potential
12. Technical maintainability

Explain the reasoning behind the scores.

Treat the results as informed design judgments, not measured conversion results.

Recommend the strongest concept based on the company's actual objectives.

Also identify:

- The concept most aligned with the catalog
- The concept with the strongest distinctive identity
- The concept with the clearest commercial focus
- The concept with the best balance of aesthetics and usability
- Useful elements from other concepts

Do not automatically select the most visually extravagant concept.

Keep the alternatives separate until the user chooses a preferred direction.

---

# 20. IMPLEMENTATION STAGES

Execute the work in clearly defined stages.

## Stage 1 — Discovery

- Inspect project structure.
- Identify framework and architecture.
- Inspect project instructions.
- Locate the existing website.
- Locate the catalog or screenshots.
- Inventory assets.
- Inspect available skills.
- Identify business objectives.
- Create the initial checkpoint.

## Stage 2 — Audit

- Evaluate the existing website.
- Analyze the catalog.
- Inventory relevant assets.
- Identify visual and UX problems.
- Identify technical risks.
- Document findings.
- Update the checkpoint.

## Stage 3 — Creative strategy

- Define business positioning.
- Identify conversion goals.
- Develop distinct design directions.
- Define each concept's visual identity.
- Decide how the catalog influences each direction.
- Define gallery routes.
- Save the decisions.

## Stage 4 — Gallery

- Implement the gallery.
- Implement preview cards.
- Connect each preview to the correct route.
- Verify navigation.
- Test the gallery.
- Save a checkpoint.

## Stage 5 — Concept implementation

- Implement each complete concept.
- Reuse appropriate assets and real content.
- Isolate concept styling.
- Implement responsive layouts.
- Implement interactions.
- Preserve existing functionality.
- Save a checkpoint after each concept.

## Stage 6 — Quality assurance

- Build and run the project.
- Test all routes.
- Test responsive layouts.
- Verify interactions.
- Review screenshots.
- Fix defects.
- Confirm visual differentiation.
- Save test results and checkpoints.

## Stage 7 — Final presentation

- Summarize the audit.
- Present catalog analysis.
- Present the asset inventory.
- Report on skills and tooling.
- Provide the gallery route.
- Provide each concept route.
- Present the comparison scorecard.
- Recommend the strongest direction.
- Document remaining issues.
- Update all project control files.

Do not stop after creating a written plan.

The expected deliverable is a working collection of website concepts.

---

# 21. CHANGE MANAGEMENT AND SAFETY

Before modifying files:

- Inspect Git status and the current branch.
- Identify existing user changes.
- Preserve uncommitted work.
- Avoid overwriting unrelated files.
- Do not delete original assets.
- Do not remove existing routes without justification.
- Do not expose credentials or environment variables.
- Avoid unnecessary dependency changes.
- Do not commit or push unless authorized.
- Do not deploy to production without explicit authorization.

Before potentially destructive operations, save a checkpoint and inspect the affected files.

If architectural changes are necessary, explain why.

Preserve existing website functionality wherever practical.

Do not use `git reset --hard`, `git clean`, force-push, or similar destructive commands without explicit authorization.

A checkpoint file is not a substitute for a backup.

Do not claim that the project is backed up remotely unless a remote backup has actually been completed and verified.

---

# 22. FINAL DELIVERABLES

At completion, provide:

## A. Website audit

- Current strengths
- Weaknesses
- UX issues
- Business opportunities
- Technical risks
- Recommendations

## B. Catalog analysis

- Whether a document, screenshots, or both were analyzed
- Relevant file paths
- Main colors
- Typography
- Layout principles
- Brand characteristics
- Digital adaptation recommendations
- Uncertainties

If `style-images` was used, list the relevant filenames.

## C. Asset inventory

Identify the most useful existing logos, photographs, icons, fonts, and graphics.

Explain how they are used.

## D. Skills report

List skills used, missing capabilities, recommendations, official documentation, and limitations.

## E. Working gallery

Provide the exact route for the concept gallery.

## F. Website concepts

Provide the exact route for every implemented concept.

## G. Comparison scorecard

Provide scores and reasoning.

## H. Recommendation

Identify the strongest design direction and explain why.

## I. Testing report

Document:

- Build status
- Tested routes
- Tested viewport sizes
- Verified interactions
- Errors found and fixed
- Remaining issues
- Unverified functionality

## J. File changes

Summarize important new and modified files.

## K. Run instructions

Provide the actual commands to install dependencies, start the project, and open the gallery.

Use the real project scripts and package manager.

## L. Recovery instructions

Confirm that the following files exist and are up to date:

- `AGENT_TASK.md`
- `PROGRESS.md`
- `TASK_CHECKLIST.md`
- `DECISIONS.md`
- `SESSION_LOG.md`

Provide a concise summary of the final checkpoint and the command or instruction needed to resume future work.

---

# 23. DEFINITION OF DONE

The project is complete only when:

- The existing project has been inspected.
- The existing website has been professionally evaluated.
- The available catalog reference has been analyzed.
- The `style-images` scenario has been supported.
- Existing brand assets have been inventoried.
- At least three genuinely different concepts have been implemented.
- Each concept is a complete website preview.
- The gallery works.
- Every concept has a direct route.
- Responsive behavior is implemented.
- Important interactions work.
- The project builds and runs, or blocking problems are documented.
- The concepts have been visually reviewed to the extent possible.
- A comparison scorecard and reasoned recommendation are available.
- The persistent progress files are accurate and up to date.
- A future agent can continue without relying on the original conversation.

If a requirement cannot be completed, document the specific reason and the best practical alternative.

---

# 24. RESUME INSTRUCTIONS FOR FUTURE SESSIONS

Whenever this project is reopened in a new agent session, use the following procedure before doing any implementation work.

Read:

1. `AGENT_TASK.md`
2. `PROGRESS.md`
3. `TASK_CHECKLIST.md`
4. `DECISIONS.md`
5. The latest relevant entries in `SESSION_LOG.md`

Inspect the actual files and Git status.

Reconcile the documented state with the actual project.

Resume from the last verified checkpoint.

Do not restart the project or repeat completed work unnecessarily.

If the user asks to continue, treat the request as a continuation of this project unless the user explicitly requests a new direction.

### Standard recovery command

The user should be able to start a new agent session in the same project directory and provide this instruction:

"Resume the existing project from the latest saved checkpoint. Read AGENT_TASK.md, PROGRESS.md, TASK_CHECKLIST.md, DECISIONS.md, and SESSION_LOG.md. Inspect the actual project files and Git status, reconcile any incomplete work, and continue from the last verified checkpoint. Preserve all existing changes, do not restart completed work, and update the checkpoint files after every substantial stage."

Do not require the user to repeat the original specification.

---

# 25. FINAL DIRECTIVE

Work as a senior creative director and frontend engineering team preparing several premium website directions for a real business.

First understand the project.

Then analyze the catalog or the screenshots in `style-images`.

Inspect the available brand assets and installed skills.

Evaluate the existing website.

Develop distinct creative directions.

Implement complete working website previews.

Create the comparison gallery.

Test and refine the result.

Maintain persistent checkpoints throughout the process.

If the session is interrupted, recover from the project files and continue from the last verified checkpoint.

Do not sacrifice quality, business effectiveness, or recoverability for speed.

Do not claim work was completed or tested unless it actually was.

**Begin by inspecting the project, establishing the persistent progress files, and identifying the available catalog reference materials. Continue through implementation, testing, and final presentation, saving recoverable progress throughout the entire task.**