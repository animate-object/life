const grid = ({ width, height }) => ({
  dimensions: { width, height },
  area: width * height,
  data: new Array(width * height).fill("0").join(""),
  gen: 0,
});

const point = (x, y) => ({ x, y });

const toIndex = (grid, { x, y }) => {
  return y * grid.dimensions.width + x;
};

const fromIndex = (grid, idx) => {
  const y = Math.floor(idx / grid.dimensions.width);
  const x = idx % grid.dimensions.width;
  return { x, y };
};

const isValidIdx = (grid, idx) => {
  return idx >= 0 && idx < grid.area;
};

const isValidPoint = ({ dimensions }, { x, y }) =>
  x >= 0 && x < dimensions.width && y >= 0 && y < dimensions.height;
const allNeighbors = ({ x, y }) => [
  { x: x - 1, y },
  { x: x + 1, y },
  { x, y: y - 1 },
  { x, y: y + 1 },
  { x: x - 1, y: y - 1 },
  { x: x + 1, y: y - 1 },
  { x: x - 1, y: y + 1 },
  { x: x + 1, y: y + 1 },
];

const neighbors = (grid, point) =>
  allNeighbors(point).map((neighbor) =>
    isValidPoint(grid, neighbor) ? grid.data[toIndex(grid, neighbor)] : "0"
  );

const countLivingNeighbors = (grid, point) => {
  const ns = neighbors(grid, point);

  return ns.reduce((count, neighbor) => count + (neighbor === "1" ? 1 : 0), 0);
};

const drawGrid = (grid, sideLength, mountNode) => {
  const table = document.createElement("table");
  table.style.height = `${sideLength * grid.dimensions.height}px`;
  table.style.width = `${sideLength * grid.dimensions.width}px`;
  for (let y = 0; y < grid.dimensions.height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < grid.dimensions.width; x++) {
      const cell = document.createElement("td");

      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  mountNode.appendChild(table);
};

const tick = (grid) => {
  let newData = "";
  for (let i = 0; i < grid.area; i++) {
    const pt = fromIndex(grid, i);
    const livingNeighbors = countLivingNeighbors(grid, pt);
    let newValue;

    if (livingNeighbors === 3) {
      newValue = "1";
    } else if (livingNeighbors === 2) {
      newValue = grid.data[i];
    } else {
      newValue = "0";
    }

    newData += newValue;
  }

  grid.data = newData;
  grid.gen += 1;
};

const clear = (grid) => {
  grid.data = Array(grid.area).fill("0").join("");
  grid.gen = 0;
};

const setGridStyles = (grid, rootNode) => {
  const cells = rootNode.getElementsByTagName("td");
  for (let idx = 0; idx < cells.length; idx++) {
    setNodeStyle(cells[idx], grid, idx);
  }
};

const setNodeStyle = (cell, grid, idx) => {
  if (grid.data[idx] === "1") {
    cell.classList.add("live");
  } else {
    cell.classList.remove("live");
  }
};

const addAllClickListeners = (gridRef, rootNode) => {
  const cells = rootNode.getElementsByTagName("td");
  for (let idx = 0; idx < cells.length; idx++) {
    cells[idx].onclick = () => {
      gridRef.data = replaceAtIndex(
        gridRef.data,
        idx,
        gridRef.data[idx] === "0" ? "1" : "0"
      );
      setNodeStyle(cells[idx], gridRef, idx);
    };
  }
};

const replaceAtIndex = (str, idx, char) =>
  str.substr(0, idx) + char + str.substr(idx + 1);
