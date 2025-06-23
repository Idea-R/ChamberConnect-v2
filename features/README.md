# Vertical Slice Architecture - Chamber Management

## Philosophy: Feature-First Organization for AI Collaboration

This project uses **Vertical Slice Architecture** to organize code by **features** rather than technical layers. This approach is optimized for:

- **AI pair programming** - complete features in focused files
- **Team collaboration** - clear feature boundaries
- **Maintainability** - related code lives together
- **Scalability** - features can be developed independently

## File Size Guidelines for Vertical Slices

### ✅ **Recommended Sizes**

- **Feature Slices**: 400-800 lines *(complete feature functionality)*
- **UI Components**: 200-400 lines *(focused component with state)*
- **Service/Store Files**: 300-600 lines *(domain-specific logic)*
- **Utility Files**: 100-300 lines *(single responsibility)*

### 🎯 **Quality over Quantity**
The goal is **cohesion within each slice**, not arbitrary line limits. A 700-line feature file is better than splitting related logic across multiple files.

## Structure

```
features/
├── chamber-management/           # Complete chamber admin feature
│   ├── components/              # Feature-specific components
│   ├── screens/                # Feature screens
│   ├── services/               # Feature business logic
│   ├── types/                  # Feature type definitions
│   └── index.ts               # Feature export barrel
├── member-management/           # Complete member management feature
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── index.ts
└── shared/                     # Cross-feature utilities
    ├── components/             # Reusable UI components
    ├── services/              # Shared business logic
    ├── types/                 # Shared type definitions
    └── utils/                 # Common utilities
```

## Implementation Guidelines

### 1. **Complete Vertical Slices**
Each feature folder contains everything needed for that feature:
- UI components
- Business logic
- State management
- Type definitions
- Tests

### 2. **Minimal Cross-Feature Dependencies**
Features should be as independent as possible:
- Shared code goes in `/shared`
- Features communicate through well-defined interfaces
- Avoid circular dependencies

### 3. **AI-Optimized File Organization**
- **Related code together** - easier for AI to understand context
- **Clear file naming** - purpose obvious from filename
- **Single responsibility** - each file has one main job
- **Documentation** - clear README and comments

### 4. **Mobile-First Considerations**
- Performance-optimized imports
- Lazy loading for large features
- Platform-specific code clearly separated
- Offline-first data patterns

## Benefits for AI Collaboration

1. **Context Awareness**: AI can understand complete features at once
2. **Reduced Context Switching**: Related code is co-located
3. **Clear Boundaries**: Features have well-defined interfaces
4. **Easier Refactoring**: Changes are contained within slices
5. **Better Testing**: Complete features can be tested in isolation

## Migration from Layer-Based to Vertical Slices

We're migrating from:
```
src/
├── components/
├── screens/
├── services/
└── types/
```

To:
```
features/
├── chamber-management/
├── member-management/
└── shared/
```

This allows AI to work with complete feature sets rather than scattered technical layers. 