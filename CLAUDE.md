# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Development Commands

- **Start development server**: `ng serve` or `npm start` (runs on http://localhost:4200)
- **Build project**: `ng build` (production build) or `ng build --configuration development`
- **Run tests**: `ng test` (Karma/Jasmine test runner)
- **Watch build**: `ng build --watch --configuration development`
- **SSR server**: `npm run serve:ssr:orca-sonhos-front` (after build)

## Architecture Overview

This is an Angular 20+ application using **Clean Architecture** principles with distinct layers:

### Core Layers

1. **Models Layer** (`src/models/`): Domain entities with business logic

   - Each model has its own folder (account, budget, category, transaction, etc.)
   - Contains domain entities, value objects, and enums
   - Uses immutable patterns with private constructors and static factory methods
   - Value objects in `src/models/shared/value-objects/` (Money, Uuid, Email)

2. **Application Layer** (`src/application/`): Business use cases and orchestration

   - **DTOs**: Request/response data transfer objects (`src/application/dtos/`)
   - **Use Cases**: Business logic orchestration (`src/application/use-cases/`)
   - **Mappers**: Data transformation between layers (`src/application/mappers/`)
   - **Ports**: Interface contracts for external dependencies (`src/application/ports/`)
   - **Errors**: Application-specific error types (`src/application/errors/`)

3. **Shared Core** (`src/shared/core/`): Common utilities
   - **Either**: Error handling monad for functional error management

### Key Patterns

- **Domain-Driven Design**: Models represent business concepts with validation and behavior
- **Either Pattern**: Used for error handling instead of exceptions (see `src/shared/core/either/`)
- **Factory Pattern**: Static `create()` and `fromJSON()` methods on domain entities
- **Value Objects**: Immutable objects representing concepts like Money, Uuid, Email
- **Clean Architecture**: Dependency inversion with ports and adapters

### Angular Configuration

- **Standalone Components**: Uses Angular standalone architecture (no NgModules)
- **SCSS Styling**: Configured with Angular Material
- **SSR Ready**: Server-side rendering configured
- **TypeScript**: Strict type checking enabled
- **Testing**: Karma + Jasmine setup

## Code Conventions

Follow existing patterns in the codebase:

- Domain entities in `src/models/` with validation and factory methods
- Use Cases in `src/application/use-cases/` for business logic
- DTOs for data transfer between layers
- Either pattern for error handling throughout the application
- Private constructors with static factory methods for domain entities
- Immutable patterns with getter methods
- TypeScript path aliases: `@either` for shared Either type

## Project Structure Notes

- **Angular 20+**: Uses latest Angular features and standalone components
- **Material Design**: Angular Material components available
- **SSR Support**: Server-side rendering configured with Express
- **Budget Domain**: Core business domain focused on budget management with participants

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Use angular-cli MCP to best practices of Angular projects
