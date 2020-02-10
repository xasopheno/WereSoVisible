export default `{ f: 285, l: 1, g: 1, p: 0 }

overtones = {
  O[
    (9/4, 10, 1/20, 1/2),
    (9/4, 0, 1/20, -1/2),
    (2/1, 10, 1/20, 1/2),
    (2/1, 0, 1/20, -1/2),
    (1/1, 2, 1, 1),
    (1/1, 0, 1, -1),
    (11/8, 0, 1/4, 0),
    (1/2, 0, 1, -1),
    (1/2, -5, 1, 1),
  ]
}

thing1 = {
  Seq [
    Tm 1, Tm 9/8, Tm 5/7, Tm 7/5,
  ]
  | ModulateBy [
      Seq [Tm 1/2 | Length 4, Tm 1 | Length 3] | Repeat 2
  ]
  
}

main = {
  overtones
  | thing1
  | Seq [Tm 3/2, Tm 1 | Reverse, Tm 4/3 | Reverse, Tm 9/8]
  | Seq [Tm 1, Tm 9/8 | Reverse, Tm 6/5 | Reverse, Tm 4/3]
  | Seq [Tm 1, Tm 9/8 | Reverse, Tm 7/8 | Reverse, Tm 1]
  | Length 1/7
  | Seq [
    Tm 1, Tm 24/25 
  ] 
}`;
