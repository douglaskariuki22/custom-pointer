window.addEventListener("load", paint)

function paint() {
    var tT = 20 //ms
    var mousePos

    const dimensions = containerDimensions()

    const svg = d3.select("#wrapper")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

    svg.call(handleChange, dimensions, tT, mousePos)
}

function handleChange(container, dimensions, tT, mousePos) {
    let intervalId = null

    var pointer = drawPointer(container)
    
    container.append("rect")
        // .attr("cursor", "none")
        .attr("x", 50).attr("y", 50)
        .attr( "width", dimensions.boundedWidth)
        .attr("height", dimensions.boundedHeight)
        .attr("visibility", "hidden")
        .attr("pointer-events", "all")
        .on( "mouseenter", mouseEnter)
        .on( "mousemove", mouseMove)
        .on( "mouseleave", mouseLeave)


    const inputDiv = d3.select(".io")
    const input = inputDiv.select("input")
    const timeT = inputDiv.select(".tT")
    
    input
        .on("change", function(d) {
            const value = d.target.value
            tT = value
            timeT.html(`${tT} ms`)
        })

    function mouseEnter() {
        var pt = d3.pointer(event);
        mousePos = pt
        pointer.attr("visibility", "visible");

        if (!intervalId) {
            intervalId = setInterval(
                () => pointer
                        .transition().duration(tT)
                        .ease(t => t)
                        .attr("cx", mousePos[0])
                        .attr("cy", mousePos[1]), 
                tT
            )
        }
    }
    
    function mouseMove() {
        var pt = d3.pointer(event);
        mousePos = pt;
    }
    
    function mouseLeave() {
        pointer.attr("visibility", "hidden");
        
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
}

function drawPointer(container, type="circle") {
    return container.append(type).attr("r", 10)
        .attr("fill", "black").attr("stroke", "black")
        .attr("stroke-width", 5).attr("stroke-opacity", 0.1)
        .attr("visibility", "hidden");
}

function getDimensions() {
    let dimensions = {
        width: window.innerWidth * 0.8,
        height: window.innerWidth * 0.8,
        margin: {
            top: 90,
            right: 90,
            bottom: 50,
            left: 50,
        },
    }

    return {
        ...dimensions,
        boundedWidth: dimensions.width - dimensions.margin.left - dimensions.margin.right,
        boundedHeight: dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    }
}

function containerDimensions() {
    const dimensions = getDimensions()
    return dimensions
}