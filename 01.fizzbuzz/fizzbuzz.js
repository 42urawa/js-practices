[...Array(20).keys()]
  .map((i) => ++i)
  .forEach((currentValue) => {
    if (currentValue % (3 * 5) === 0) {
      console.log("FizzBuzz");
    } else if (currentValue % 3 === 0) {
      console.log("Fizz");
    } else if (currentValue % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(currentValue);
    }
  });
