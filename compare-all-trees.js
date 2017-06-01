/**
 * Created by oliviercappelle on 25/05/17.
 */
function getData() {
    jQuery.get('../data/ape.tree', function (data) {
        var file = data.split('\n');
        var trees = [];
        var patternSpicie = /\d+:\d+.?\d*/g;
        var patternState = /STATE_\d+/i;
        var patternLine = /^.+?(\d+:\d+.?\d*)+.+?$/g; //not right - only matches 50 cases

        file.forEach(function (element) {
            if (element.toLowerCase().startsWith("tree STATE_".toLowerCase())) {
                console.log('found');
                var spicies = element.match(patternSpicie);
                var sum = 0.0;
                spicies.forEach(function (element) {
                    sum += parseFloat(element.split(':')[1]);
                });
                var state = element.match(patternState)[0]; //already take first element because that's what is needed
                trees.push({
                    'key': state,
                    'value': sum
                });
            }
        });

        console.log(trees);
        makeChart(trees);
    });
}

function makeChart(data) {
    var tool_tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
            return "<strong>" + d.key + "</strong> <span style='color:red'>" + d.value + "</span>";
        });

    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    svg.call(tool_tip);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Phylogenetic diversity");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);
}

getData();

