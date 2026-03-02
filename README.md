# HackYourFuture Mentoring Content

A collection of JavaScript exercises and refactoring challenges designed for HackYourFuture mentoring sessions. This repository contains practical coding exercises focused on fundamental JavaScript concepts including functions, strings, data structures, and loops.

## 📚 Overview

This repository serves as a mentoring resource for teaching and practicing core JavaScript programming concepts through hands-on exercises. Each week's content includes refactoring challenges and pair programming exercises that emphasize clean code principles and best practices.

## 🗂️ Repository Structure

```
HackYourFuture-Mentoring-Content/
├── Week 3 - Functions and strings/
│   ├── 1. Refactoring Messy Code/
│   │   ├── productCatalog.js
│   │   └── productCatalog.spec.js
│   └── 2. Pair Exercise/
│       └── userProfileUtil.js
├── Week 4 - Data Structures and Loops/
│   ├── 1. Refactoring Repetitive Array Code/
│   │   └── students.js
│   └── 2. Pair Exercise/
│       └── inventoryManagementSystem.js
├── package.json
└── vitest.config.js
```

## 📖 Weekly Content

### Week 3: Functions and Strings

#### 1. Refactoring Messy Code
**File:** `productCatalog.js`

Learn to identify and refactor repetitive code by:
- Extracting common logic into reusable functions
- Applying the DRY (Don't Repeat Yourself) principle
- Understanding function composition and reusability

**Topics Covered:**
- Function extraction and parameterization
- String manipulation and formatting
- Code deduplication techniques

#### 2. Pair Exercise
**File:** `userProfileUtil.js`

Build utility functions for user profile management:
- Create pure functions with single responsibilities
- Use arrow functions and template literals
- Work with string transformations

**Requirements:**
- Pure functions
- Arrow functions
- Template literals
- One function = one job principle

**Functions to build:**
- Full name formatter (capitalised)
- Username generator
- Email builder
- Age calculator
- User profile object creator

### Week 4: Data Structures and Loops

#### 1. Refactoring Repetitive Array Code
**File:** `students.js`

Practice refactoring repetitive array operations:
- Extract common patterns into reusable functions
- Use object destructuring
- Implement status determination logic

**Topics Covered:**
- Loop optimization
- Function composition
- Array iteration patterns

#### 2. Pair Exercise
**File:** `inventoryManagementSystem.js`

Build a complete inventory management system using array methods:

**Functions to Implement:**

1. **`getInStockProducts(products)`**
   - Returns array of in-stock products
   - Uses: `filter()`

2. **`getProductNames(products)`**
   - Returns product names in uppercase
   - Uses: `map()`

3. **`findProductByName(products, name)`**
   - Finds product by name (case-insensitive)
   - Uses: `find()`

4. **`getTotalInventoryValue(products)`**
   - Calculates total inventory value
   - Uses: `reduce()`

5. **`getExpensiveProducts(products, minPrice)`**
   - Returns sorted expensive products
   - Uses: `filter()` and `sort()`

6. **`getLowStockAlert(products, threshold)`**
   - Returns low-stock product names
   - Uses: `filter()` and `map()`

**Requirements:**
- Use specified array methods
- Pure functions (no mutation)
- Template literals where appropriate

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/allhandsondeck/HackYourFuture-Mentoring-Content.git
```

2. Navigate to the project directory:
```bash
cd HackYourFuture-Mentoring-Content
```

3. Install dependencies:
```bash
npm install
```

## 🧪 Running Tests

This project uses [Vitest](https://vitest.dev/) for testing.

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- "Week 3 - Functions and strings/1. Refactoring Messy Code/productCatalog.spec.js"
```

## 🎯 Learning Objectives

By working through these exercises, students will learn to:

- **Write Clean Code**: Apply DRY principles and extract reusable functions
- **Master Functions**: Understand pure functions, arrow functions, and function composition
- **Work with Strings**: Use template literals and string manipulation methods
- **Array Methods**: Master `filter()`, `map()`, `find()`, `reduce()`, and `sort()`
- **Data Structures**: Work with arrays and objects effectively
- **Destructuring**: Use object and array destructuring
- **Best Practices**: Follow JavaScript conventions and coding standards

## 💡 How to Use This Repository

### For Mentors

1. **Review the exercises** before the mentoring session
2. **Run the existing code** to see the problems that need solving
3. **Guide students** through identifying code smells and refactoring opportunities
4. **Use the tests** to verify solutions
5. **Encourage pair programming** for collaborative learning

### For Students

1. **Read the exercise requirements** carefully
2. **Analyze the existing code** to understand what needs improvement
3. **Identify patterns** and repetition
4. **Refactor incrementally** - make small changes and test frequently
5. **Run tests** to verify your solutions
6. **Discuss with your pair** or mentor if you get stuck

## 🛠️ Tech Stack

- **Language**: JavaScript (ES6+)
- **Testing Framework**: Vitest
- **Module System**: ES Modules
- **Node Version**: Compatible with Node.js 14+

## 📝 Coding Standards

All exercises emphasize:
- **Pure Functions**: Functions without side effects
- **Single Responsibility**: Each function does one thing well
- **Meaningful Names**: Clear, descriptive variable and function names
- **Template Literals**: Modern string formatting
- **ES6+ Syntax**: Arrow functions, destructuring, const/let
- **No Mutation**: Preserve original data structures

## 🤝 Contributing

Contributions are welcome! If you'd like to add new exercises or improve existing ones:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-exercise`)
3. Make your changes
4. Add tests for new exercises
5. Commit your changes (`git commit -m 'Add new exercise'`)
6. Push to the branch (`git push origin feature/new-exercise`)
7. Open a Pull Request

### Guidelines for New Exercises

- Follow the existing structure (Week folders, numbered exercises)
- Include clear requirements and learning objectives
- Provide test files for refactoring exercises
- Use comments to explain requirements in pair exercises
- Ensure exercises build on previous concepts

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🔗 Resources

- [HackYourFuture](https://www.hackyourfuture.net/)
- [JavaScript MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Vitest Documentation](https://vitest.dev/)
- [Array Methods Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## 📧 Support

For questions or support, please open an issue in this repository or reach out to your HackYourFuture mentor.

---

**Happy Coding! 🚀**
