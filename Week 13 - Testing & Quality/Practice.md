# Let's get practical

> 💭 Practice exercises are optional and do not need to be submitted

## Exercise 1 - Testing a temperature converter

Write a function `celsiusToFahrenheit(celsius)` that converts a Celsius temperature to Fahrenheit, rounded to one decimal place. Then write thorough unit tests for it.

```tsx
celsiusToFahrenheit(0); // returns 32
celsiusToFahrenheit(100); // returns 212
celsiusToFahrenheit(37); // returns 98.6
```

Write at least four tests: the happy path, a negative number, a value that needs rounding, and zero.

> 💡 Hint: `Math.round(value * 10) / 10` rounds a number to one decimal place.

## Exercise 2 - TDD practice: password strength checker

Before you use TDD on the real assignment, practise the red-green-refactor cycle on something small and self-contained.

Write `getPasswordStrength(password)`, which returns `"weak"`, `"medium"`, or `"strong"`, using these rules:

- Under 6 characters is always `"weak"`
- 6 or more characters, but only lowercase letters, is `"medium"`
- 8 or more characters mixing upper and lower case, a number, and a symbol is `"strong"`

```tsx
getPasswordStrength("abc"); // "weak"
getPasswordStrength("abcdefgh"); // "medium"
getPasswordStrength("Abcd3fg!"); // "strong"
```

Write a failing test for each rule before you write any implementation.

**Questions to consider:**

- What was different about writing the test before the implementation?
- Did writing the tests first reveal a rule you hadn't fully thought through?
- How would you test this function differently if it updated the DOM directly instead of returning a string?

> ⚠️ Resist the urge to write `getPasswordStrength` first. Write one failing test, watch it fail, then write just enough code to make it pass.

## Exercise 3 - An accessible, tested Button component

Given this component:

```tsx
type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function Button({ label, onClick, disabled }: Props) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

Write tests that:

- Query the button using `getByRole`, never a class name or test id
- Confirm `onClick` fires when a user clicks it, using `userEvent`
- Confirm `onClick` does **not** fire when `disabled` is `true`
- Pass an axe accessibility check with no violations

> 💡 If you would like to practice more then remember that you can ask AI to generate more exercises for you!
