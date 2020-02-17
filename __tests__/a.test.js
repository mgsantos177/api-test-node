function soma(a, b) {
  return a + b;
}

test('if', () => {
  const result = soma(4, 5);

  expect(result).toBe(9);

  console.log("aaaaaaaaaaaaaaa" + JSON.stringify(process.env.NODE_ENV));
});
