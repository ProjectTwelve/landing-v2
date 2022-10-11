const shaders =  {
    verterxShader: 'attribute float alpha;\n\nvarying float vAlpha;\n\nvoid main() {\n\nvAlpha = alpha;\n\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\ngl_PointSize = 8.0;\n\ngl_Position = projectionMatrix * mvPosition;\n\n}',
    fragmentShader: 'uniform vec3 color;\n\nvarying float vAlpha;\n\nvoid main() {\n\n    gl_FragColor = vec4( color, vAlpha );\n\n}',
};

export default shaders;