export default function sketch(p){
    let canvas;
    let dice;
    let font;
    let degreesX = 0;
    let degreesY = 0;
    let degreesZ = 0;
    let rateXRoll = 0;
    let rateYRoll = 0;
    let rateZRoll = 0;
    let paused = false;
    let debug = false;
    let diceFaceValue = 0;
    let location = p.createVector(0,0);
    let velocity = p.createVector(0,0);
    let speedModifier = 0;

    p.preload = () => {
        dice = p.loadModel('./assets/chessex_d6.stl', true);
        font = p.loadFont('./assets/Roboto-Regular.ttf');
    }

    p.setup = () => {
        canvas = p.createCanvas(500, 500, p.WEBGL);
        p.angleMode(p.DEGREES);
        p.textFont(font);
        p.textSize(11);
        p.textAlign(p.LEFT, p.BOTTOM);
    }

    p.draw = () => {
        p.background(0);
        p.pointLight(255, 255, 255, -250, -250, 150);
        p.pointLight(255, 255, 255, 250, 250, 100);

        p.ambientLight(100,100,100);

        setXRotationDegrees(rateXRoll);
        setYRotationDegrees(rateYRoll);
        setZRotationDegrees(rateZRoll);

        p.stroke("white");
        p.fill("white");
        if (debug) {
            printDebugText();
        } else {
            let textXStart = p.width/3;
            let textY = p.height/3;
            p.textSize(30);
            p.text(diceFaceValue, textXStart,textY);
        }

        p.push();

        // no deceleration when already stopped
        if ((velocity.x != 0) && (velocity.y != 0)) {

            velocity.x = velocity.x * 0.992;
            velocity.y = velocity.y * 0.992;
            rateXRoll = rateXRoll * 0.992;
            rateYRoll = rateYRoll * 0.992;
            rateZRoll = rateZRoll * 0.992;

            // when near stopped, just stop
            if ((Math.abs(velocity.x) < 2) || (Math.abs(velocity.y) < 2)) {
                velocity.x = 0;
                velocity.y = 0;
                rateXRoll = 0;
                rateYRoll = 0;
                rateZRoll = 0;
                snapToFace();
            }


            // my location can by -250 to +250. But my location is the center of an ~90px object
            // so I want to bounce when I'm less than -160 or when i'm greater than +160
            // I also don't know why I have to set location to min/max, but the location vector
            // was 'escaping' the boundaries and getting 'stuck' boucing on the same axis again and again.
            // I think this may be a corner bounce on 1 axis that puts the location out of bounds on the other axis
            if (location.x < -160) {
                velocity.x = (velocity.x * -1);
                location.x = -160;
            }
            if (location.x > 160) {
                velocity.x = (velocity.x * -1);
                location.x = 160;
            }
            if (location.y < -160) {
                velocity.y = (velocity.x * -1);
                location.y = -160;
            }
            if (location.y > 160) {
                velocity.y = (velocity.x * -1);
                location.y = 160;
            }

        }
        location.add(velocity);

        p.translate(location);


        p.rotateX(degreesX);
        p.rotateY(degreesY);
        p.rotateZ(degreesZ);
        p.ambientMaterial(250);
        p.noStroke();
        p.scale(0.4);
        p.model(dice);

        p.pop();


    }

    function setXRotationDegrees(rateXRoll){
        let newDegreesX = degreesX + rateXRoll;
        if (newDegreesX > 360) {
            degreesX = newDegreesX - 360;
        } else {
            degreesX = newDegreesX;
        }
    }

    function setYRotationDegrees(rateYRoll){
        let newDegreesY = degreesY + rateYRoll;
        if (newDegreesY > 360) {
            degreesY = newDegreesY - 360;
        } else {
            degreesY = newDegreesY;
        }
    }

    function setZRotationDegrees(rateZRoll){
        let newDegreesZ = degreesZ + rateZRoll;
        if (newDegreesZ > 360) {
            degreesZ = newDegreesZ - 360;
        } else {
            degreesZ = newDegreesZ;
        }
    }

    p.keyPressed = () => {
        if (p.keyCode === 32 && !paused) {
            p.noLoop();
            paused = true;
        } else {
            p.loop();
            paused = false;
        }
    }

    p.mousePressed = () => {
        // I've finished a roll and am clicking for a new role
        if ((velocity.x === 0 && velocity.y === 0) && (location.x != 0) && (location.y != 0)) {
            location.x = 0;
            location.y = 0;
        }
        // set the x/y/z rotationRate between 0 & 10;
        rateXRoll = 10 * p.random();
        rateYRoll = 10 * p.random();
        rateZRoll = 2 * p.random();

        // the larger the distance from the dice, the faster the base velocity
        let mouseVector = p.createVector(p.mouseX, p.mouseY);
        speedModifier = location.dist(mouseVector)/50;

        velocity.x = (p.random( 1,4) * speedModifier);
        velocity.y = (p.random( 1,4) * speedModifier);

    }

    function snapToFace(){
        // get absolute values of each axis rotation
        let absoluteX = Math.abs(degreesX);
        let absoluteY = Math.abs(degreesY);
        let absoluteZ = Math.abs(degreesZ);
        let x0 = Math.abs(0 - absoluteX);
        let x90 = Math.abs(90 - absoluteX);
        let x180 = Math.abs(180 - absoluteX);
        let x270 = Math.abs(270 - absoluteX);
        let x360 = Math.abs(360 - absoluteX);
        switch(Math.min(x0, x90,x180,x270,x360)) {
            case x0:
                degreesX = 0;
                break;
            case x90:
                degreesX = 90;
                break;
            case x180:
                degreesX = 180;
                break;
            case x270:
                degreesX = 270;
                break;
            case x360:
                degreesX = 0;
                break;
            default:
                break;
        }

        let y0 = Math.abs(0 - absoluteY);
        let y90 = Math.abs(90 - absoluteY);
        let y180 = Math.abs(180 - absoluteY);
        let y270 = Math.abs(270 - absoluteY);
        let y360 = Math.abs(360 - absoluteY);
        switch(Math.min(y0,y90,y180,y270,y360)) {
            case y0:
                degreesY = 0;
                break;
            case y90:
                degreesY = 90;
                break;
            case y180:
                degreesY = 180;
                break;
            case y270:
                degreesY = 270;
                break;
            case y360:
                degreesY = 0;
                break;
            default:
                break;
        }

        let z0 = Math.abs(0 - absoluteZ);
        let z90 = Math.abs(90 - absoluteZ);
        let z180 = Math.abs(180 - absoluteZ);
        let z270 = Math.abs(270 - absoluteZ);
        let z360 = Math.abs(360 - absoluteZ);
        switch(Math.min(z0,z90,z180,z270,z360)) {
            case z0:
                degreesZ = 0;
                break;
            case z90:
                degreesZ = 90;
                break;
            case z180:
                degreesZ = 180;
                break;
            case z270:
                degreesZ = 270;
                break;
            case z360:
                degreesZ = 0;
                break;
            default:
                break;
        }
        rateXRoll = 0;
        rateYRoll = 0;
        rateZRoll = 0;
        diceFaceValue = getDiceValue(getDegreesX() + "," + getDegreesY() + "," + getDegreesZ());
    }

    function getDiceValue(xyzDegreeString){

        let diceNumber = 0;
        for (var i=0; i < dicearray.length; i++) {
            if (dicearray[i][0] === xyzDegreeString ) {
                return dicearray[i][1];
            }
        }
        return diceNumber;
    }

    function printDebugText() {
        let textXStart = p.width - 350;
        p.text("dice Value: " + diceFaceValue, textXStart,-200);
        p.text("degreesX: " + degreesX.toFixed(), textXStart,-185);
        p.text("degreesY: " + degreesY.toFixed(), textXStart,-170);
        p.text("degreesZ: " + degreesZ.toFixed(), textXStart,-155);
        p.text("rateXRoll: " + rateXRoll.toFixed(), textXStart,-140);
        p.text("rateYRoll: " + rateYRoll.toFixed(), textXStart,-125);
        p.text("rateZRoll: " + rateZRoll.toFixed(), textXStart,-110);
        p.text("mouseX: " + p.mouseX, textXStart,-95);
        p.text("mouseY: " + p.mouseY, textXStart,-80);
        p.text("location x: " + location.x.toFixed(), textXStart,-65);
        p.text("location y: " + location.y.toFixed(), textXStart,-50);
        p.text("velocity x: " + velocity.x.toFixed(), textXStart,-35);
        p.text("velocity y: " + velocity.y.toFixed(), textXStart,-20);
        p.text("heading: " + location.heading().toFixed(), textXStart,-5);
        p.text("speedModifier: " + speedModifier.toFixed(), textXStart,10);
    }

    function getDegreesX(){
        if (degreesX === 360) {
            return 0;
        } else {
            return degreesX;
        }
    }

    function getDegreesY(){
        if (degreesY === 360) {
            return 0;
        } else {
            return degreesY;
        }
    }


    function getDegreesZ(){
        if (degreesZ === 360) {
            return 0;
        } else {
            return degreesZ;
        }
    }


    // for the array to work, the initial state should be:
    //  1 facing 'towards' the viewer
    //  2 facing 'up'
    //  4 facing 'right'
    let dicearray =
        [["0,0,0",1],
            ["0,0,90",1],
            ["0,0,180",1],
            ["0,0,270",1],
            ["180,180,0",1],
            ["180,180,90",1],
            ["180,180,180",1],
            ["180,180,270",1],

            ["0,90,90",2],
            ["0,270,270",2],
            ["90,0,0",2],
            ["90,90,0",2],
            ["90,180,0",2],
            ["90,270,0",2],
            ["180,90,270",2],
            ["180,270,90",2],
            ["270,90,180",2],
            ["270,0,180",2],
            ["270,180,180",2],
            ["270,270,180",2],

            ["0,90,0",3],
            ["0,270,180",3], // verified at 3
            ["90,0,270",3], // verified at 3
            ["90,270,270",3], // changed from 4 to 3
            ["90,180,270",3], // moved from 4 to 3
            ["90,90,270",3], // moved from 4 to 3
            ["180,90,180",3], //changed from 4 to 3, verified at 3
            ["180,270,0",3], // verified at 3
            ["270,90,90",3], // verified at 3
            ["270,0,90",3], // changed from 4 to 3
            ["270,180,90",3], // verified at 3
            ["270,270,90",3], // verified at 3

            ["0,90,180",4], //changed from 3 to 4
            ["0,270,0",4], // change from 3 to 4
            ["90,0,90",4], // verified at 4
            ["90,90,90",4], // verified at 4
            ["90,180,90",4], // verified at 4
            ["90,270,90",4], // verified at 4
            ["180,90,0",4], // change from 3 to 4, verified
            ["180,270,180",4], // verified at 4
            ["270,90,270",4], // verified at 4
            ["270,180,270",4], // verified at 4
            ["270,270,270",4], // changed from 3 to 4
            ["270,0,270",4], // moved from 3 or 4



            ["0,90,270",5],
            ["0,270,90",5],
            ["90,0,180",5],
            ["90,90,180",5],
            ["90,180,180",5],
            ["90,270,180",5],
            ["180,90,90",5],
            ["180,270,270",5],
            ["270,0,0",5],
            ["270,90,0",5],
            ["270,180,0",5],
            ["270,270,0",5],

            ["0,180,0",6],
            ["0,180,90",6],
            ["0,180,180",6],
            ["0,180,270",6],
            ["180,0,0",6],
            ["180,0,90",6],
            ["180,0,180",6],
            ["180,0,270",6]
            ]

}