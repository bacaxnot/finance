---
description: Update or add standards documentation following our maintenance framework
arguments:
  - name: instructions
    description: What to document or update
    required: true
---

I need to update our standards documentation. Here's what needs to be done:

{{instructions}}

Please follow our documentation maintenance framework:

## Process

1. **Search First**
   - Check if this concept already exists in docs/standards/
   - Use grep/glob to find existing mentions
   - If found, update in place rather than duplicate

2. **Find the Right Home**
   - Philosophy (why) → `code-philosophy.md`
   - Conventions (naming) → `code-conventions.md`
   - Design Patterns → specific design doc (aggregates, errors, repositories, use-cases)
   - If unclear, tell me where you think it belongs and why

3. **Keep It Focused**
   - One concept per section
   - One clear example (two max if showing contrast)
   - Link to related concepts, don't duplicate explanations
   - Aim for <50 lines per section

4. **Check for Issues**
   - Am I duplicating content from another doc?
   - Does this blur the doc's focus?
   - Is one section growing much longer than others?
   - Would someone naturally look here for this?

## Your Task

1. Tell me which file(s) need to be updated and why
2. Show me what changes you'll make (quote the sections you'll modify)
3. Make the updates following our principles:
   - One concept, one place
   - Link, don't repeat
   - Minimal, focused examples
   - Friendly, clear language

If you're unsure about placement, explain your reasoning and ask me to confirm before making changes.
