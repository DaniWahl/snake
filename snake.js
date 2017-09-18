
// definiere die Anzahl Spielfelder in Kolonnen und Zeilen
const COLS=40;   
const ROWS=40;
// definiere die Grösse eines Spielfeldes in Anzahl Pixel
const FIELD_SIZE=15;

// globale Variablen für Schlange und Futter
var sizzle;
var food;


// setup() wird von P5 einmal am Start des Programms ausgeführt 
function setup() {
    
    // erstelle das Spielfeld
    createCanvas(COLS*FIELD_SIZE, ROWS*FIELD_SIZE);
    
    // erstelle die Objekte für Schlange und Futter
    sizzle = new Snake();
    food = new Food();

    // setze die Geschwindigkeit auf 10 Bilder pro Sekunde
    frameRate(10);
}


// draw() wird von P5 nach setup() in einer Schleife immer wieder aufgerufen
// und bildet den Spielablauf
function draw() {
    background(50);             // zeichne den Hintergrund der Canvas
    sizzle.drawSegments();      // zeichne alle Segmente der Schlange
    sizzle.move();              // berechne die nächste Position der Schlange
    sizzle.eat();               // prüfe ob die Schlange Futter gefunden hat
    sizzle.checkEnd();          // prüfe ob das Spiel geendet werden soll 
    food.draw();                // zeichne das Futter
}


// Event Handler für Keyboard Tasten
// wird ausgeführt wenn eine Keyboard Taste gedückt wird und steuert die
// Schlange in eine entsprechende Richtung
function keyPressed() {
    
    if (keyCode === 37) {
        sizzle.setDirection("LEFT");
    }
    
    if (keyCode===38) {
        sizzle.setDirection("UP");
    }
    
    if (keyCode===39) {
        sizzle.setDirection("RIGHT");
    }
    if (keyCode===40) {
        sizzle.setDirection("DOWN");
    }
}


// Klasse Snake
class Snake {
    
    // Konstruktor - wird ausgeführt wenn ein neues Objekt erstellt wird
    constructor() { 
        this.direction = "RIGHT";   // Schlange soll in Richting rechts los laufen
        this.head = new Segment(COLS/2, ROWS/2);  // neues Segment für den Schlangenkopf in der Mitte der Canvas
        this.tail = [];  // ein leeres Array für die Schwanz Segmente
        
        // erstelle ein neues Segment links vom Kopf und füge es dem Array hinzu
        var ts1 = new Segment(this.head.col-1, this.head.row);
        this.tail.push(ts1);
    }
    
    // zeichet alle Segmente der Schlange
    drawSegments() {
        this.head.draw();
        
        for(var i=0; i<this.tail.length; i++) {
            this.tail[i].draw();
        }
    }
    
    // berechnet die neue Position aller Segmente
    move() {
        
        // neue Position für alle Schwanz Segmente (ausser das vorderste Segment)
        for(var i=this.tail.length-1; i>0; i--) {
            // aktuelles Segment bekommt Position vom Segment davor
            this.tail[i].col = this.tail[i-1].col;
            this.tail[i].row = this.tail[i-1].row;
        }
        
        // neue Position für das vorderste Segment - bekommt die Position vom Kopf
        this.tail[0].col = this.head.col;
        this.tail[0].row = this.head.row;
        
        // neue Position vom Kopf abhängig vom der gesetzten Richtung 
        if (this.direction === "RIGHT") {
            this.head.col++;
        }
        
        if (this.direction === "LEFT") {
            this.head.col--;
        }
        
        if (this.direction === "DOWN") {
            this.head.row++;
        }
        
        if (this.direction === "UP") {
            this.head.row--;
        }
        
    }
    
    // setze die neue Richtung
    setDirection(newDirection) {
        this.direction = newDirection;
    }
    
    // prüfe ob wir Futter gefunden haben
    eat() {
        if ( this.head.isEqual(food) ) {
            // Futter gefunden! neues Futter erstellen und Schlange wachsen lassen
            food = new Food();
            this.grow();
        }
    }
    
    // erstellt ein neues Segment und fügt dieses dem Array tail hinzu
    grow() {
        var segm = new Segment();
        this.tail.push( segm );
    }
    
    // überprüfe ob das Spiel beendet wird
    checkEnd() {
        var end = false;
        
        // ist Schlangenkopf rechts aus der Canvas?
        if (this.head.col > COLS) {
            end = true;
        }
        
        // ist Schlangenkopf links aus der Canvas?
        if (this.head.col < 0) {
            end = true;
        }
        
        // ist Schlangenkopf unten aus der Canvas?
        if (this.head.row > ROWS) {
            end = true;
        }
        
        // ist Schlangenkopf oben aus der Canvas?
        if (this.head.row < 0) {
            end = true;
        }
        
        // ist Schlangenkopf auf einem Schwanzsegment?
        for(var i=0; i<this.tail.length; i++) {
            if ( this.tail[i].isEqual(this.head) ) {
                end = true;
            }
        }
        
        
        if ( end ) {
            // eines der oben geprüften Situationen ist eingetreten,
            // stoppe die Loop und somit das Spiel.
            noLoop();
        }
    }
}


// Klasse Segment
class Segment {
        
    // Konstruktor - wird ausgeführt wenn ein neues Objekt erstellt wird
    constructor(col, row) {
        this.col = col;         
        this.row = row;
        this.size = FIELD_SIZE;
        this.color = color(255);   
    }
    
    // zeichne ein Quadrat an der Position von col und row
    draw() {
        fill(this.color);
        rect(this.col*this.size, this.row*this.size, this.size, this.size);
    }
    
    // prüfe ob die Position mit der Position von einem anderen Segment übereinstimmt
    isEqual(otherSegment) {
        
        if (this.col === otherSegment.col && this.row === otherSegment.row) {
            return true;
        } else {
            return false;
        }
    }
}


// Klasse Food welche Segment erweitert
class Food extends Segment {
    
    // Konstruktor - wird ausgeführt wenn ein neues Objekt erstellt wird
    constructor() {
        super();  // führt den Konstruktor der Super Klass (Segment) aus
        
        // setze col und row auf eine zufällige Position
        this.col = floor(random(0,COLS));  
        this.row = floor(random(0,ROWS));
        
        this.color = color(200,50,50);     // setze die Farbe auf Rot
    }
}