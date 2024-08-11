const fs = require('fs');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const sharp = require('sharp');  // Import sharp for image processing
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const rough = require('roughjs');

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateStar(cx, cy, spikes, outerRadius, innerRadius, rotation) {
    const points = [];
    const step = Math.PI / spikes;
    for (let i = 0; i < 2 * spikes; i++) {
        const angle = i * step + rotation;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        points.push([x, y]);
    }
    return points;
}

function generateHexagon(cx, cy, radius, rotation) {
    const points = [];
    const step = Math.PI / 3;  // Hexagon has six sides, each step covers 60 degrees
    for (let i = 0; i < 6; i++) {
        const angle = i * step + rotation;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        points.push([x, y]);
    }
    return points;
}

function generateIrregularShape() {
    const cx = 128; // Center x of the canvas
    const cy = 128; // Center y of the canvas
    const maxRadius = 80; // Maximum radius of curvature
    
    // Randomly generate Bezier control points
    const startX = Math.random() * 256;
    const startY = Math.random() * 256;
    const cp1X = startX + (Math.random() * 2 - 1) * maxRadius; // Control point 1 x
    const cp1Y = startY + (Math.random() * 2 - 1) * maxRadius; // Control point 1 y
    const cp2X = startX + (Math.random() * 2 - 1) * maxRadius; // Control point 2 x
    const cp2Y = startY + (Math.random() * 2 - 1) * maxRadius; // Control point 2 y
    const endX = startX + (Math.random() * 2 - 1) * maxRadius; // End point x
    const endY = startY + (Math.random() * 2 - 1) * maxRadius; // End point y

    // Draw Bezier curve
    const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    return path
}

function createSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '200');
    return svg;
}

function generateRectangleDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        // Define the safe margin based on the canvas size and expected diagonal length
        const canvasSize = 256;
        const maxDimension = 100;  // Maximum size for width or height
        const diagonal = Math.sqrt(2 * maxDimension * maxDimension);  // Maximum diagonal length
        const safeMargin = (canvasSize - diagonal) / 2;  // Maximum distance from center to canvas edge

        // Ensure the rectangle stays within bounds
        const width = Math.random() * (maxDimension - 30) + 30;
        const height = Math.random() * (maxDimension - 30) + 30;
        const x = Math.random() * (canvasSize - 2 * safeMargin - width) + safeMargin;
        const y = Math.random() * (canvasSize - 2 * safeMargin - height) + safeMargin;

        const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

        // Center of the rectangle for rotation
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 3
        const bow = Math.random() * 2
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const rect_i = rc_input.rectangle(x, y, width, height, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgInput.appendChild(rect_i);

            const rect_t = rc_target.rectangle(x, y, width, height, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgTarget.appendChild(rect_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const rect_i = rc_input.rectangle(x, y, width, height, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgInput.appendChild(rect_i);

            const rect_t = rc_target.rectangle(x, y, width, height, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            rect_t.setAttribute('opacity', .5)
            svgTarget.appendChild(rect_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/rectangle/rectangle_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/rectangle/rectangle_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateSquareDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        // Define the safe margin based on the canvas size and expected diagonal length
        const canvasSize = 256;
        const maxDimension = 100;  // Maximum size for width or height
        const diagonal = Math.sqrt(2 * maxDimension * maxDimension);  // Maximum diagonal length
        const safeMargin = (canvasSize - diagonal) / 2;  // Maximum distance from center to canvas edge

        // Ensure the rectangle stays within bounds
        const width = Math.random() * (maxDimension - 30) + 30;
        const height = width;
        const x = Math.random() * (canvasSize - 2 * safeMargin - width) + safeMargin;
        const y = Math.random() * (canvasSize - 2 * safeMargin - height) + safeMargin;

        const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

        // Center of the rectangle for rotation
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 3
        const bow = Math.random() * 2
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const rect_i = rc_input.rectangle(x, y, width, height, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgInput.appendChild(rect_i);

            const rect_t = rc_target.rectangle(x, y, width, height, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgTarget.appendChild(rect_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const rect_i = rc_input.rectangle(x, y, width, height, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            svgInput.appendChild(rect_i);

            const rect_t = rc_target.rectangle(x, y, width, height, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
            rect_t.setAttribute('opacity', .5)
            svgTarget.appendChild(rect_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/square/square_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/square/square_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateCircleDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        // Define the safe margin based on the canvas size and expected diagonal length
        const canvasSize = 256;
        const maxDiameter = 150; // Maximum diameter of the circle
        const safeMargin = (canvasSize - maxDiameter) / 2;

        // Randomly set circle properties
        const radius = Math.random() * (maxDiameter / 2 - 15) + 25; // Random radius from 15 to 50
        const x = Math.random() * (canvasSize - 2 * safeMargin - 2 * radius) + safeMargin + radius;
        const y = Math.random() * (canvasSize - 2 * safeMargin - 2 * radius) + safeMargin + radius;

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 2.5
        const bow = Math.random() * 1.5
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const circle_i = rc_input.circle(x, y, radius, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(circle_i);

            const circle_t = rc_target.circle(x, y, radius, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            svgTarget.appendChild(circle_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const circle_i = rc_input.circle(x, y, radius, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(circle_i);

            const circle_t = rc_target.circle(x, y, radius, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            circle_t.setAttribute('opacity', .5)
            svgTarget.appendChild(circle_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/circle/circle_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/circle/circle_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateEllipseDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        const maxMajorAxis = 120; // Maximum length for the semi-major axis
        const maxMinorAxis = 80; // Maximum length for the semi-minor axis
        const minMinorAxis = 40; // Set a minimum for the semi-minor axis to prevent line-like appearances
        const safeMargin = (256 - maxMajorAxis) / 2; // Adjust safe margin

        const rx = Math.random() * (maxMajorAxis / 2 - 60) + 60;
        const ry = Math.random() * (maxMinorAxis / 2 - minMinorAxis) + minMinorAxis; // Ensure ry is not too small

        const x = safeMargin + rx + (Math.random() * (256 - 2 * (safeMargin + rx)));
        const y = safeMargin + ry + (Math.random() * (256 - 2 * (safeMargin + ry)));

        const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 2.5
        const bow = Math.random() * 1
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const ellipse_i = rc_input.ellipse(x, y, rx, ry, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            ellipse_i.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            svgInput.appendChild(ellipse_i);

            const ellipse_t = rc_target.ellipse(x, y, rx, ry, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            ellipse_t.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            svgTarget.appendChild(ellipse_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const ellipse_i = rc_input.ellipse(x, y, rx, ry, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            ellipse_i.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            svgInput.appendChild(ellipse_i);

            const ellipse_t = rc_target.ellipse(x, y, rx, ry, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            ellipse_t.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
            ellipse_t.setAttribute('opacity', .5)
            svgTarget.appendChild(ellipse_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/ellipse/ellipse_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/ellipse/ellipse_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateLineDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        const numLines = Math.floor(Math.random() * 15) + 1; 

        // Define the safe margin based on the canvas size and expected diagonal length
        for (let j = 0; j < numLines; j++) {
            const x1 = Math.random() * 256;
            const y1 = Math.random() * 256;
            const x2 = Math.random() * 256;
            const y2 = Math.random() * 256;

            const stroke_width = Math.random() * 2 + 1
            const roughy = Math.random() * 5
            const bow = Math.random() * 3

            // Add a white background
            // Ensure the background is white by adding a white rectangle first
            const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
            const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
            svgInput.insertBefore(background_input, svgInput.firstChild);
            svgTarget.insertBefore(background_target, svgTarget.firstChild);

            const line_i = rc_input.line(x1, y1, x2, y2, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(line_i);

            const line_t = rc_target.line(x1, y1, x2, y2, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            svgTarget.appendChild(line_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/line/line_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/line/line_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateStarDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        const spikes = Math.floor(Math.random() * 3) + 5;  // Random spikes from 5 to 7
        const outerRadius = 50;  // Reduced outer radius to ensure a smaller size
        const innerRadius = outerRadius / 2;  // Maintain a proportionate inner radius
        const rotation = Math.random() * 2 * Math.PI;  // Random rotation in radians

        // Calculate safe margins to ensure the star remains within boundaries
        const safeMargin = outerRadius + 20;  // Increased margin for safety
        const cx = Math.random() * (256 - 2 * safeMargin) + safeMargin;
        const cy = Math.random() * (256 - 2 * safeMargin) + safeMargin;

        const starPoints = generateStar(cx, cy, spikes, outerRadius, innerRadius, rotation);

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 3
        const bow = Math.random() * 2
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const star_i = rc_input.polygon(starPoints, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(star_i);

            const star_t = rc_target.polygon(starPoints, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            svgTarget.appendChild(star_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const star_i = rc_input.polygon(starPoints, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(star_i);

            const star_t = rc_target.polygon(starPoints, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            star_t.setAttribute('opacity', .5)
            svgTarget.appendChild(star_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/star/star_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/star/star_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateHexagonDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        const radius = Math.random() * 40 + 15; // Random radius between 15 and 45
        const rotation = Math.random() * 2 * Math.PI; // Random rotation in radians

        // Central position with a safety calculation to ensure it fits within boundaries
        const maxExtent = radius * Math.sqrt(3);  // From center to any vertex
        const safeMargin = maxExtent + 5;  // A bit more than max extent from the center to edge
        const cx = Math.random() * (256 - 2 * safeMargin) + safeMargin;
        const cy = Math.random() * (256 - 2 * safeMargin) + safeMargin;

        const hexPoints = generateHexagon(cx, cy, radius, rotation);

        const stroke_width = Math.random() * 2 + 1
        const roughy = Math.random() * 3
        const bow = Math.random() * 2
        const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        if (fill == 1){
            // Draw the shapes
            const hex_i = rc_input.polygon(hexPoints, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(hex_i);

            const hex_t = rc_target.polygon(hexPoints, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            svgTarget.appendChild(hex_t);
        }
        else {
            fill_color = getRandomColor();
             // Draw the shapes
            const hex_i = rc_input.polygon(hexPoints, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                bowing: bow, 
                disableMultiStroke: true
            })
            svgInput.appendChild(hex_i);

            const hex_t = rc_target.polygon(hexPoints, {
                fill: fill_color,
                fillStyle: 'solid',
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: 0,
                bowing: 0, 
                disableMultiStroke: true
            })
            hex_t.setAttribute('opacity', .5)
            svgTarget.appendChild(hex_t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/hexagon/hexagon_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/hexagon/hexagon_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateIrregularDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        // Add a white background
        // Ensure the background is white by adding a white rectangle first
        const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
        svgInput.insertBefore(background_input, svgInput.firstChild);
        svgTarget.insertBefore(background_target, svgTarget.firstChild);

        const numCurves = Math.floor(Math.random() * 10) + 1; 

        for (let j = 0; j < numCurves; j++) {
            const path = generateIrregularShape();
            const roughy = Math.random() * 3
            const stroke_width = Math.random() * 2 + 1
                // Draw the shapes
            const i = rc_input.path(path, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                disableMultiStroke: true
            })
            svgInput.appendChild(i);

            const t = rc_target.path(path, {
                stroke: 'black', 
                strokeWidth: stroke_width, 
                roughness: roughy,
                disableMultiStroke: true
            })
            svgTarget.appendChild(t);
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/irregular/irregular_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/irregular/irregular_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });
    }
}

function generateMixedDataset(numPairs, dir) {
    for (let i = 0; i < numPairs; i++) {
        const svgInput = createSvg();
        const svgTarget = createSvg();
        const rc_input = rough.svg(svgInput);
        const rc_target = rough.svg(svgTarget);

        let annotationsInput = [];

        const numShapes = Math.floor(Math.random() * 5) + 2; 
        const canvasSize = 256;

        // Define the safe margin based on the canvas size and expected diagonal length
        for (let j = 0; j < numShapes; j++) {
            
            const shape_id = Math.floor(Math.random() * 8) + 1; 

            let x_center, y_center, wid, hei;

            if (shape_id == 1){
                //Rectangle

                // Define the safe margin based on the canvas size and expected diagonal length
                const maxDimension = 100;  // Maximum size for width or height
                const diagonal = Math.sqrt(2 * maxDimension * maxDimension);  // Maximum diagonal length
                const safeMargin = (canvasSize - diagonal) / 2;  // Maximum distance from center to canvas edge

                // Ensure the rectangle stays within bounds
                let width = Math.random() * (maxDimension - 30) + 30;
                let height = Math.random() * (maxDimension - 30) + 30;
                const x = Math.random() * (canvasSize - 2 * safeMargin - width) + safeMargin;
                const y = Math.random() * (canvasSize - 2 * safeMargin - height) + safeMargin;

                x_center = (x + width / 2) / canvasSize;
                y_center = (y + height / 2) / canvasSize;
                wid = width / canvasSize;
                hei = height / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

                // Center of the rectangle for rotation
                const centerX = x + width / 2;
                const centerY = y + height / 2;

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 3
                const bow = Math.random() * 2
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const rect_i = rc_input.rectangle(x, y, width, height, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgInput.appendChild(rect_i);

                    const rect_t = rc_target.rectangle(x, y, width, height, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgTarget.appendChild(rect_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const rect_i = rc_input.rectangle(x, y, width, height, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgInput.appendChild(rect_i);

                    const rect_t = rc_target.rectangle(x, y, width, height, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    rect_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(rect_t);
                }
            }
            else if (shape_id == 2){
                //Square

                // Define the safe margin based on the canvas size and expected diagonal length
                const maxDimension = 100;  // Maximum size for width or height
                const diagonal = Math.sqrt(2 * maxDimension * maxDimension);  // Maximum diagonal length
                const safeMargin = (canvasSize - diagonal) / 2;  // Maximum distance from center to canvas edge

                // Ensure the rectangle stays within bounds
                let width = Math.random() * (maxDimension - 30) + 30;
                let height = width;
                const x = Math.random() * (canvasSize - 2 * safeMargin - width) + safeMargin;
                const y = Math.random() * (canvasSize - 2 * safeMargin - height) + safeMargin;

                x_center = (x + width / 2) / canvasSize;
                y_center = (y + height / 2) / canvasSize;
                wid = width / canvasSize;
                hei = height / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

                // Center of the rectangle for rotation
                const centerX = x + width / 2;
                const centerY = y + height / 2;

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 3
                const bow = Math.random() * 2
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const rect_i = rc_input.rectangle(x, y, width, height, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgInput.appendChild(rect_i);

                    const rect_t = rc_target.rectangle(x, y, width, height, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgTarget.appendChild(rect_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const rect_i = rc_input.rectangle(x, y, width, height, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    rect_i.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    svgInput.appendChild(rect_i);

                    const rect_t = rc_target.rectangle(x, y, width, height, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    rect_t.setAttribute('transform', `rotate(${rotation}, ${centerX}, ${centerY})`);
                    rect_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(rect_t);
                }
            }
            else if (shape_id == 3){
                //Circle

                // Define the safe margin based on the canvas size and expected diagonal length
                const maxDiameter = 150; // Maximum diameter of the circle
                const safeMargin = (canvasSize - maxDiameter) / 2;

                // Randomly set circle properties
                const radius = Math.random() * (maxDiameter / 2 - 15) + 25; // Random radius from 15 to 50
                const x = Math.random() * (canvasSize - 2 * safeMargin - 2 * radius) + safeMargin + radius;
                const y = Math.random() * (canvasSize - 2 * safeMargin - 2 * radius) + safeMargin + radius;

                x_center = x / canvasSize;
                y_center = y / canvasSize;
                wid = hei = (radius * 2) / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 2.5
                const bow = Math.random() * 1.5
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const circle_i = rc_input.circle(x, y, radius, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(circle_i);

                    const circle_t = rc_target.circle(x, y, radius, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    svgTarget.appendChild(circle_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const circle_i = rc_input.circle(x, y, radius, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(circle_i);

                    const circle_t = rc_target.circle(x, y, radius, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    circle_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(circle_t);
                }
            }
            else if (shape_id == 4){
                //Ellipse

                const maxMajorAxis = 120; // Maximum length for the semi-major axis
                const maxMinorAxis = 80; // Maximum length for the semi-minor axis
                const minMinorAxis = 40; // Set a minimum for the semi-minor axis to prevent line-like appearances
                const safeMargin = (256 - maxMajorAxis) / 2; // Adjust safe margin

                const rx = Math.random() * (maxMajorAxis / 2 - 60) + 60;
                const ry = Math.random() * (maxMinorAxis / 2 - minMinorAxis) + minMinorAxis; // Ensure ry is not too small

                const x = safeMargin + rx + (Math.random() * (256 - 2 * (safeMargin + rx)));
                const y = safeMargin + ry + (Math.random() * (256 - 2 * (safeMargin + ry)));

                x_center = x / canvasSize;
                y_center = y / canvasSize;
                wid = (rx * 2) / canvasSize;
                hei = (ry * 2) / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const rotation = Math.random() * 360; // Random rotation from 0 to 360 degrees

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 2.5
                const bow = Math.random() * 1
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const ellipse_i = rc_input.ellipse(x, y, rx, ry, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    ellipse_i.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
                    svgInput.appendChild(ellipse_i);

                    const ellipse_t = rc_target.ellipse(x, y, rx, ry, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    ellipse_t.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
                    svgTarget.appendChild(ellipse_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const ellipse_i = rc_input.ellipse(x, y, rx, ry, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    ellipse_i.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
                    svgInput.appendChild(ellipse_i);

                    const ellipse_t = rc_target.ellipse(x, y, rx, ry, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    ellipse_t.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
                    ellipse_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(ellipse_t);
                }
            }
            else if (shape_id == 5){
                //Line

                const numLines = Math.floor(Math.random() * 7) + 1; 

                // Define the safe margin based on the canvas size and expected diagonal length
                for (let j = 0; j < numLines; j++) {
                    const x1 = Math.random() * 256;
                    const y1 = Math.random() * 256;
                    const x2 = Math.random() * 256;
                    const y2 = Math.random() * 256;

                    const stroke_width = Math.random() * 2 + 1
                    const roughy = Math.random() * 5
                    const bow = Math.random() * 3

                    // Add a white background
                    // Ensure the background is white by adding a white rectangle first
                    const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                    const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                    svgInput.insertBefore(background_input, svgInput.firstChild);
                    svgTarget.insertBefore(background_target, svgTarget.firstChild);

                    const line_i = rc_input.line(x1, y1, x2, y2, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(line_i);

                    const line_t = rc_target.line(x1, y1, x2, y2, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    svgTarget.appendChild(line_t);
                }
            }
            else if (shape_id == 6){
                //Star

                const spikes = Math.floor(Math.random() * 3) + 5;  // Random spikes from 5 to 7
                const outerRadius = 50;  // Reduced outer radius to ensure a smaller size
                const innerRadius = outerRadius / 2;  // Maintain a proportionate inner radius
                const rotation = Math.random() * 2 * Math.PI;  // Random rotation in radians

                // Calculate safe margins to ensure the star remains within boundaries
                const safeMargin = outerRadius + 20;  // Increased margin for safety
                const cx = Math.random() * (256 - 2 * safeMargin) + safeMargin;
                const cy = Math.random() * (256 - 2 * safeMargin) + safeMargin;

                const starPoints = generateStar(cx, cy, spikes, outerRadius, innerRadius, rotation);

                const minX = Math.min(...starPoints.map(p => p[0]));
                const maxX = Math.max(...starPoints.map(p => p[0]));
                const minY = Math.min(...starPoints.map(p => p[1]));
                const maxY = Math.max(...starPoints.map(p => p[1]));

                x_center = ((minX + maxX) / 2) / canvasSize;
                y_center = ((minY + maxY) / 2) / canvasSize;
                wid = (maxX - minX) / canvasSize;
                hei = (maxY - minY) / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 3
                const bow = Math.random() * 2
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const star_i = rc_input.polygon(starPoints, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(star_i);

                    const star_t = rc_target.polygon(starPoints, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    svgTarget.appendChild(star_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const star_i = rc_input.polygon(starPoints, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(star_i);

                    const star_t = rc_target.polygon(starPoints, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    star_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(star_t);
                }
            }
            else if (shape_id == 7){
                //Hexagon

                const radius = Math.random() * 40 + 15; // Random radius between 15 and 45
                const rotation = Math.random() * 2 * Math.PI; // Random rotation in radians

                // Central position with a safety calculation to ensure it fits within boundaries
                const maxExtent = radius * Math.sqrt(3);  // From center to any vertex
                const safeMargin = maxExtent + 5;  // A bit more than max extent from the center to edge
                const cx = Math.random() * (256 - 2 * safeMargin) + safeMargin;
                const cy = Math.random() * (256 - 2 * safeMargin) + safeMargin;

                const hexPoints = generateHexagon(cx, cy, radius, rotation);

                const minX = Math.min(...hexPoints.map(p => p[0]));
                const maxX = Math.max(...hexPoints.map(p => p[0]));
                const minY = Math.min(...hexPoints.map(p => p[1]));
                const maxY = Math.max(...hexPoints.map(p => p[1]));

                x_center = ((minX + maxX) / 2) / canvasSize;
                y_center = ((minY + maxY) / 2) / canvasSize;
                wid = (maxX - minX) / canvasSize;
                hei = (maxY - minY) / canvasSize;

                annotationsInput.push(`${shape_id - 1} ${x_center} ${y_center} ${wid} ${hei}`);

                const stroke_width = Math.random() * 2 + 1
                const roughy = Math.random() * 3
                const bow = Math.random() * 2
                const fill = Math.floor(Math.random() * (2 - 1 + 1) + 1);

                // Add a white background
                // Ensure the background is white by adding a white rectangle first
                const background_input = rc_input.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                const background_target = rc_target.rectangle(0, -300, 300, 800, {fill: 'white', fillStyle: 'solid', strokeWidth: 0, roughness: 0, stroke: 'none', bowing: 0});
                svgInput.insertBefore(background_input, svgInput.firstChild);
                svgTarget.insertBefore(background_target, svgTarget.firstChild);

                if (fill == 1){
                    // Draw the shapes
                    const hex_i = rc_input.polygon(hexPoints, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(hex_i);

                    const hex_t = rc_target.polygon(hexPoints, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    svgTarget.appendChild(hex_t);
                }
                else {
                    fill_color = getRandomColor();
                    // Draw the shapes
                    const hex_i = rc_input.polygon(hexPoints, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        bowing: bow, 
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(hex_i);

                    const hex_t = rc_target.polygon(hexPoints, {
                        fill: fill_color,
                        fillStyle: 'solid',
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: 0,
                        bowing: 0, 
                        disableMultiStroke: true
                    })
                    hex_t.setAttribute('opacity', .5)
                    svgTarget.appendChild(hex_t);
                }

            }
            else if (shape_id == 8){
                //Irregular

                const numCurves = Math.floor(Math.random() * 7) + 1; 

                for (let j = 0; j < numCurves; j++) {
                    const path = generateIrregularShape();
                    const roughy = Math.random() * 3
                    const stroke_width = Math.random() * 2 + 1
                        // Draw the shapes
                    const i = rc_input.path(path, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        disableMultiStroke: true
                    })
                    svgInput.appendChild(i);

                    const t = rc_target.path(path, {
                        stroke: 'black', 
                        strokeWidth: stroke_width, 
                        roughness: roughy,
                        disableMultiStroke: true
                    })
                    svgTarget.appendChild(t);
                }
            }
        }

        // Serialize SVGs
        const inputXml = xmlSerializer.serializeToString(svgInput);
        const targetXml = xmlSerializer.serializeToString(svgTarget);

        // Convert SVG to PNG and save
        sharp(Buffer.from(inputXml))
            .resize(256, 256)
            .toFile(`${dir}/input/mixed/mixed_${i}.png`, (err) => {
                if (err) console.error(`Error saving input image_${i}: ${err}`);
            });
        
        sharp(Buffer.from(targetXml))
            .resize(256, 256)
            .toFile(`${dir}/target/mixed/mixed_${i}.png`, (err) => {
                if (err) console.error(`Error saving target image_${i}: ${err}`);
            });

        const annotationFileName = `Path/to/Curvetopia/DataSetGeneration/labels/mixed_${i}.txt`;
        saveAnnotations(annotationFileName, annotationsInput.join('\n'));
    }
}

function saveAnnotations(fileName, content) {
    fs.writeFileSync(fileName, content, 'utf8');
}

// generateCircleDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateEllipseDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateRectangleDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateSquareDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateLineDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateStarDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateHexagonDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateIrregularDataset(10, 'Path/to/Curvetopia/DataSetGeneration/dataset');
// generateMixedDataset(50, 'Path/to/Curvetopia/DataSetGeneration/dataset');