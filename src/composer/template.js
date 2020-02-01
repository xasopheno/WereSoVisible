const template = `{ f: 285, l: 1, g: 1, p: 0 }

overtones = {
  O[
    (1/1, 2, 1, 1),
    (1/1, 0, 1, -1),
  ]
}

thing1 = {
  Seq [
    Tm 1, Tm 9/8, Tm 5/4
  ]
}

main = {
  overtones
  | thing1
}
`;

export default template;

