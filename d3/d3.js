const margins = { top: 20, left: 50, bottom: 50, right: 20 },
  width = 700,
  height = 500;

//scales
const x = d3.scaleTime().range([0, width - margins.left - margins.right]);
const y0 = d3.scaleLinear().range([height - margins.bottom - margins.top, 0]);
const y1 = d3.scaleLinear().range([height - margins.bottom - margins.top, 0]);
//parse date
const parseTime = d3.timeParse("%d-%b-%y");
// to compute the path for a line
const line = d3
  .line()
  // .curve(d3.curveBundle)
  .x((d) => x(parseTime(d.date)))
  .y((d) => y0(+d.close));

const line2 = d3
  .line()
  .x((d) => x(parseTime(d.date)))
  .y((d) => y1(+d.open));

//define SVG
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", width + margins.left + margins.right)
  .attr("height", height + margins.top + margins.bottom);

// label at the bottom
svg
  .append("g")
  .attr(
    "transform",
    `translate(${(width - margins.left - margins.right) / 2}, ${
      height + margins.top + margins.bottom
    })`
  )
  .append("text")
  .text("Date")
  .attr("text-anchor", "middle");

// label at the left
svg
  .append("g")
  .attr(
    "transform",
    `translate(${margins.right}, ${
      (height + margins.top + margins.bottom) / 2
    })`
  )
  .append("text")
  .attr("transform", "rotate(-90)")
  .text("Value");

//title
svg
  .append("g")
  .append("text")
  .attr("text-anchor", "middle")
  .text("Value vs Date Graph")
  .attr("x", (width - margins.left - margins.right) / 2)
  .attr("y", margins.top)
  .style("font-size", "24px")
  .style("text-shadow", "1px 1px 5px rgba(0,0,0,0.4)");

// GETTING DATA FROM FILE
d3.csv("../data/data2.csv").then((data) => {
  //add domains to scales
  x.domain(d3.extent(data, (d) => parseTime(d.date)));

  y0.domain([0, d3.max(data, (d) => +d.close)]);
  y1.domain([0, d3.max(data, (d) => +d.open)]);

  // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(x).ticks(5);
  }
  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y0).ticks(5);
  }

  //join data
  svg
    .append("g")
    .attr(
      "transform",
      `translate(${margins.left}, ${margins.top + margins.bottom})`
    )
    .append("path")
    .data([data])
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke-width", "2px")
    .attr("stroke", 3)
    .attr("stroke", "lightblue");

  svg
    .append("g")
    .attr(
      "transform",
      `translate(${margins.left}, ${margins.top + margins.bottom})`
    )
    .append("path")
    .data([data])
    .attr("d", line2(data))
    .attr("fill", "none")
    .attr("stroke-width", "2px")
    .attr("stroke", 3)
    .attr("stroke", "crimson");

  svg
    .append("text")
    .attr(
      "transform",
      `translate(${width - margins.left + 40}, ${
        y1(data[0].open) + margins.bottom + margins.top
      })`
    )
    .attr("text-anchor", "start")
    .style("fill", "crimson")
    .text("Open");

  svg
    .append("text")
    .attr(
      "transform",
      `translate(${width - margins.left + 40}, ${
        y0(data[0].close) + margins.bottom + margins.top
      })`
    )
    .attr("text-anchor", "start")
    .style("fill", "lightblue")
    .text("Close");

  // drawing circles
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr(
      "transform",
      `translate(${margins.left}, ${margins.top + margins.bottom})`
    )
    .attr("cx", (d) => x(parseTime(d.date)))
    .attr("cy", (d) => y0(+d.close))
    .attr("r", 3)
    .attr("stroke-width", 1)
    .attr("stroke", "lightsteelblue")
    .attr("fill", "none");

  //adding grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${height})`)
    .call(
      make_x_gridlines()
        .tickSize(-height + margins.left + margins.right)
        .tickFormat("")
    );

  svg
    .append("g")
    .attr("class", "grid")
    .attr(
      "transform",
      `translate(${margins.right + margins.left / 2 + 5}, ${
        margins.bottom - 5
      })`
    )
    .call(
      make_y_gridlines()
        .tickSize(-width + margins.top + margins.bottom)
        .tickFormat("")
    );

  //axes
  //defining axes
  svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(10)
        .tickSize(5)
        .tickFormat(d3.timeFormat("%B %d %Y"))
    )
    .selectAll("text")
    .attr("transform", "rotate(-45) translate(-8, 0)")
    .attr("text-anchor", "end");

  svg
    .append("g")
    .call(d3.axisLeft(y0))
    .attr(
      "transform",
      `translate(${margins.left}, ${margins.top + margins.bottom})`
    )
    .selectAll("text")
    .style("fill", "lightblue");

  svg
    .append("g")
    .call(d3.axisRight(y1))
    .attr(
      "transform",
      `translate(${width - margins.right}, ${margins.top + margins.bottom})`
    )
    .selectAll("text")
    .style("fill", "crimson");
});
