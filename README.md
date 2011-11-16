# libnoise.js

A (mostly) direct port of C++ [libnoise](http://libnoise.sourceforge.net/index.html) for CommonJS/Node.js

Examples:

== Perlin Noise ==

    var Perlin = require( 'libnoise.js/module/generator/perlin' );
    var perlin = new Perlin(); 
 
    // get a perlin noise value for the given coordinates  
    var noiseValue = perlin.getValue( 0.25, 0.46, 0.12 );
