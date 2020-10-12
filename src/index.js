import p5 from 'p5';
import sketch from './sketch.js';

const containerElement = document.getElementById('diceroller-container');
new p5(sketch, containerElement);
