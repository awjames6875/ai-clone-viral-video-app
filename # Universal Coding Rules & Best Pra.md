# Universal Coding Rules & Best Practices

## 1. The "0.1%" Elite Standards
*   **Strong Typing:** Always use strict types (e.g., TypeScript). Avoid `any` at all costs.
*   **Zero Warnings:** The console, linter, and compiler must be completely empty. Treat warnings as errors.
*   **Automated Safety:** Never commit code without running tests and linting first.
*   **Clean Architecture:** Separate your logic (how it works) from your UI (how it looks).

## 2. When to Refactor (Clean Up)
*   **The Rule of Three:** If you copy-paste code 3 times, turn it into a single function.
*   **The "Squint" Test:** If you have to squint or scroll to understand a function, it is too long. Break it up.
*   **Bug Magnets:** If you fix a bug in a file and it breaks something else, that file is too complex. Rewrite it.
*   **Hard to Read:** If you can't explain the code to a 5-year-old, rewrite it to be simpler.

## 3. Efficiency & Resource Saving (Save Credits)
*   **Plan First:** Write a plan in English before writing code. Deleting code costs time and energy.
*   **Don't Reinvent:** Check if a library or built-in function already exists before writing a new one.
*   **Test Small:** Test individual functions before running the whole app to catch bugs cheaply.
*   **Keep it Simple:** The simplest solution is usually the most efficient.

## 4. Beginner Safety Net
*   **Clear Naming:** Use names like `userAddress` instead of `ua`.
*   **One Job:** A function should do one thing only (e.g# Universal Coding Rules & Best Practices

## 1. The "0.1%" Elite Standards
*   **Strong Typing:** Always use strict types (e.g., TypeScript). Avoid `any` at all costs.
*   **Zero Warnings:** The console, linter, and compiler must be completely empty. Treat warnings as errors.
*   **Automated Safety:** Never commit code without running tests and linting first.
*   **Clean Architecture:** Separate your logic (how it works) from your UI (how it looks).

## 2. When to Refactor (Clean Up)
*   **The Rule of Three:** If you copy-paste code 3 times, turn it into a single function.
*   **The "Squint" Test:** If you have to squint or scroll to understand a function, it is too long. Break it up.
*   **Bug Magnets:** If you fix a bug in a file and it breaks something else, that file is too complex. Rewrite it.
*   **Hard to Read:** If you can't explain the code to a 5-year-old, rewrite it to be simpler.

## 3. Efficiency & Resource Saving (Save Credits)
*   **Plan First:** Write a plan in English before writing code. Deleting code costs time and energy.
*   **Don't Reinvent:** Check if a library or built-in function already exists before writing a new one.
*   **Test Small:** Test individual functions before running the whole app to catch bugs cheaply.
*   **Keep it Simple:** The simplest solution is usually the most efficient.

## 4. Beginner Safety Net
*   **Clear Naming:** Use names like `userAddress` instead of `ua`.
*   **One Job:** A function should do one thing only (e.g