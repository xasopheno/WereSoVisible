const template = `{ f: 220, l: 1, g: 1, p: 0 }

overtones = {
  O[
    (1/1, 2, 1, 1),
    (1/1, 0, 1, -1),
  ]
}

thing = {
	overtones |
	Sequence [
		AsIs,
		Tm 9/8,
    Tm 5/4,
	] 
}

main = {
	thing
}
`;

export default template;
