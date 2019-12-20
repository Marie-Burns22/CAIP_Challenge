var practice = function () {
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 20, bottom: 50, left: 70 };

    let series = [];
    
    const render = movies => {
        const color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(["#64AEFF", "#AED5FF"]);
        
        const stack = d3.stack()
            .keys(["viewCount", "likeCount"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        
        series = stack(movies);
        console.log(movies)
        console.log(series);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
            .rangeRound([height - margin.bottom, margin.top]);

        const xScale = d3.scaleBand()
            .domain(movies.map(m => m.title))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());
        
        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove());

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
                .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")  
                .attr("x", (d, i) => xScale(d.data.title))
                .attr("y", d => yScale(d[1]))
                .attr("height", d => yScale(d[0]) - yScale(d[1]))
                .attr("width", xScale.bandwidth()); 

        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);
    };
    
    d3.json("/page.json").then(data => {
        const movies = [];

        data.forEach(d => {
            let movie = {};
            movie["title"] = d["snippet"]["title"];
            movie["viewCount"] = +d["statistics"]["viewCount"];
            movie["likeCount"] = +d["statistics"]["likeCount"];
            movies.push(movie);
        });
        render(movies);
    });

};

$(document).ready(function () {
    practice();
});

