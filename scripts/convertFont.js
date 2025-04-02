const opentype = require("opentype.js");
const fs = require("fs");
const path = require("path");

// Get the font path from node_modules
const woffFontPath = path.resolve(
  __dirname,
  "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"
);
const woffBuffer = fs.readFileSync(woffFontPath);

// Convert WOFF to OpenType format
function woffToOpenType(buffer) {
  // Simple conversion - in production you'd want to use a proper WOFF to OTF converter
  const signature = buffer.toString("ascii", 0, 4);
  if (signature !== "wOFF") {
    throw new Error("Not a valid WOFF file");
  }

  // Extract the original OpenType font data
  // WOFF header is 44 bytes, then comes the actual font data
  return buffer.slice(44);
}

// Create a Three.js compatible font JSON structure
function createThreeFont(font) {
  const glyphs = {};

  // Process all available characters
  for (let charCode = 32; charCode <= 126; charCode++) {
    const char = String.fromCharCode(charCode);
    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(0, 0, 72);

    if (path) {
      const shapePaths = [];
      let currentPath = [];

      path.commands.forEach((cmd) => {
        switch (cmd.type) {
          case "M":
            if (currentPath.length) shapePaths.push(currentPath);
            currentPath = [`M ${cmd.x.toFixed(2)} ${cmd.y.toFixed(2)}`];
            break;
          case "L":
            currentPath.push(`L ${cmd.x.toFixed(2)} ${cmd.y.toFixed(2)}`);
            break;
          case "C":
            currentPath.push(
              `C ${cmd.x1.toFixed(2)} ${cmd.y1.toFixed(2)} ${cmd.x2.toFixed(
                2
              )} ${cmd.y2.toFixed(2)} ${cmd.x.toFixed(2)} ${cmd.y.toFixed(2)}`
            );
            break;
          case "Q":
            currentPath.push(
              `Q ${cmd.x1.toFixed(2)} ${cmd.y1.toFixed(2)} ${cmd.x.toFixed(
                2
              )} ${cmd.y.toFixed(2)}`
            );
            break;
          case "Z":
            currentPath.push("Z");
            shapePaths.push(currentPath);
            currentPath = [];
            break;
        }
      });

      if (currentPath.length) shapePaths.push(currentPath);

      glyphs[charCode] = {
        ha: Math.round(glyph.advanceWidth),
        x_min: Math.round(glyph.xMin || 0),
        x_max: Math.round(glyph.xMax || 0),
        o: shapePaths.map((path) => path.join(" ")),
      };
    }
  }

  return {
    glyphs,
    familyName: font.names.fontFamily.en || "JetBrains Mono",
    ascender: Math.round(font.ascender),
    descender: Math.round(font.descender),
    underlinePosition: Math.round(font.tables.post.underlinePosition),
    underlineThickness: Math.round(font.tables.post.underlineThickness),
    boundingBox: {
      yMin: Math.round(font.tables.head.yMin),
      yMax: Math.round(font.tables.head.yMax),
      xMin: Math.round(font.tables.head.xMin),
      xMax: Math.round(font.tables.head.xMax),
    },
    resolution: 1000,
    original_font_information: font.tables.name,
  };
}

async function convertFont() {
  try {
    // Convert WOFF to OpenType
    const otfBuffer = woffToOpenType(woffBuffer);

    // Load the font using opentype.js
    const font = opentype.parse(otfBuffer);

    // Convert to Three.js format
    const threeFont = createThreeFont(font);

    // Save the converted font
    const outputPath = path.resolve(
      __dirname,
      "../public/fonts/JetBrainsMono-Regular.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(threeFont, null, 2));
    console.log("Font converted successfully!");
  } catch (error) {
    console.error("Error converting font:", error);
  }
}

convertFont();
