# Contributing to ARUS

Thank you for your interest in contributing to ARUS! This document outlines how to contribute effectively.

## Code of Conduct

ARUS follows a simple code of conduct:
- Be respectful and constructive
- Focus on technical merit
- Maintain the project's explicit, performance-focused philosophy

## Development Setup

### Prerequisites
- Node.js >= 18
- TypeScript >= 5.0
- Git

### Setup
```bash
git clone https://github.com/your-org/arus.git
cd arus
npm install
```

### Building
```bash
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
```

### Testing
```bash
# Run benchmarks
cd benchmarks && npm run bench

# Manual testing
node benchmarks/hello-world.js
```

## Contribution Guidelines

### Philosophy Alignment
All contributions must align with ARUS core philosophy:
- **Explicit over implicit**
- **Performance over convenience**
- **Predictability over features**

### Code Standards
- **TypeScript**: Strict mode, no `any`
- **Imports**: `import type` for types, `import` for values
- **Naming**: Descriptive, consistent
- **Comments**: Explain why, not what
- **Performance**: Profile changes, avoid allocations

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`

### Pull Requests
- **Title**: Clear, descriptive
- **Description**: Explain what and why
- **Tests**: Include benchmarks if performance-related
- **Breaking Changes**: Clearly marked
- **Documentation**: Updated as needed

## Areas for Contribution

### High Priority
- **Performance Optimizations**: V8-specific improvements
- **New Adapters**: Additional runtime support
- **Benchmark Expansion**: More comprehensive testing
- **Documentation**: Examples, guides

### Medium Priority
- **Error Handling**: Better error types/utilities
- **Type Safety**: Enhanced generic constraints
- **Developer Tools**: CLI, dev server
- **Ecosystem**: Middleware libraries

### Low Priority
- **Features**: Only if they fit philosophy
- **Breaking Changes**: Carefully considered
- **Major Refactors**: Only for significant gains

## Development Workflow

### 1. Choose Issue
- Check existing issues
- Create issue for new work
- Discuss approach in comments

### 2. Local Development
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# Test thoroughly
# Run benchmarks

# Commit
git add .
git commit -m "feat: add your feature"
```

### 3. Testing
- **Unit Tests**: Add for new utilities
- **Integration Tests**: Handler/pipeline combinations
- **Performance Tests**: Benchmark regressions
- **Type Tests**: Ensure type safety

### 4. Documentation
- Update relevant docs
- Add examples if needed
- Update READMEs

### 5. Submit PR
- Push branch
- Create PR with description
- Wait for review
- Address feedback
- Merge when approved

## Architecture Guidelines

### Core Changes
- **Zero Breaking**: Unless major version
- **Performance First**: Measure impact
- **Type Safety**: Maintain strictness
- **Runtime Agnostic**: No Node.js deps in core

### Adapter Changes
- **Follow Contract**: Request → Context → Pipeline → Response
- **Error Handling**: Consistent serialization
- **Performance**: Minimize overhead
- **Compatibility**: Support target runtime features

### Package Structure
- **Independent**: Each package builds separately
- **Consistent**: Follow existing patterns
- **Documented**: Clear API boundaries

## Performance Considerations

### Measuring Impact
```bash
# Before changes
npm run bench > before.txt

# After changes
npm run bench > after.txt

# Compare
diff before.txt after.txt
```

### Profiling
```bash
# CPU profiling
node --prof benchmarks/hello-world.js

# Memory profiling
node --inspect benchmarks/json-response.js
```

### Benchmarks to Watch
- Latency regression > 5%
- Throughput drop > 10%
- Memory increase > 20%

## Documentation Standards

### README Files
- Clear installation instructions
- Practical examples
- API reference
- Important notes

### Code Comments
- Explain complex logic
- Reference design decisions
- Note performance implications

### Examples
- Working code
- Common patterns
- Error handling

## Release Process

### Versioning
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

### Publishing
```bash
# Update version
npm version minor

# Build all
npm run build

# Publish packages
npm publish --workspace=packages/core
npm publish --workspace=packages/common
# etc.
```

## Getting Help

- **Issues**: For bugs/features
- **Discussions**: For questions/ideas
- **PR Comments**: For implementation feedback

## Recognition

Contributors are recognized in:
- Git history
- Release notes
- Future documentation

Thank you for helping make ARUS better! 🚀