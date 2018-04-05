export const getBaseWebUrl = () => {
  return window.location.origin;
};


let colors_in_memory = new Map();

let colors = [
  '#dd947f',
  '#99dda3',
  '#d8dd02',
  '#a8d3dd',
  '#ddabd1',
  '#ddc722',
  '#4eef35',
  '#d8dd02',
  '#1dddaf',
  '#089ddd',
];

export const getColorForString = (word) => {
  if (!colors_in_memory.get(word)) {
    colors_in_memory.set(word, colors[Math.floor(Math.random() * colors.length)]);
  }
  return colors_in_memory.get(word);
};
