window.onload = function() {
  let canvas;
  let canvasWidth = 900;
  let canvasHeight = 600;
  let snakee;
  let ctx;
  let blockSize = 30;
  let delay = 100;
  let pinkLadie;
  let widthInBlocks = canvasWidth / blockSize;
  let heightInBlocks = canvasHeight / blockSize;

  init();

  function init() {
    canvas = document.createElement("canvas"); // création du canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas); // ajout du canvas au body
    snakee = new snake(
      [
        // recupère le protype snake et prend en paramère "body" le tableau avec les coord des blocks
        [6, 4],
        [5, 4],
        [4, 4]
      ],
      "down"
    ); // création du serpent (= objet) - serpents de trois blocks dont les valeurs sont les positions x et y des blocks et la direction
    pinkLadie = new apple([10, 10]);
    ctx = canvas.getContext("2d");

    refreshCanvas();
  }

  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      //condition : si il y a collision game over sinon tu executes les actions de refreshCanvas
      //GAME OVER
    } else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight); //delet du contenu du canvas en partant des coord 0, 0 sur hauteur / largeur du canvas.
      snakee.draw(); //appel de la methode draw définit dans l'objet snakee (dont le prototype est snake)
      pinkLadie.draw();
      setTimeout(refreshCanvas, delay); //applique la function refreshCanvas toutes les 100 millisecondes.
    }
  }

  function drawBlock(ctx, position) {
    let x = position[0] * blockSize; //prend premiere coord dans la première valeur de position (ici body[i]) et la mult par "30"
    let y = position[1] * blockSize; // idem pour coord y
    ctx.fillRect(x, y, blockSize, blockSize); // ajout du dessin dans le canvas. Ici un block avec coord x / y sur 30x30 grace à .fillRect
  }

  function snake(body, direction) {
    //création du prototype du serpent avec deux paramètres
    this.body = body; //nouveau constructor : prop body dont la valeur sera le paramètre body (ici un array)
    this.direction = direction; // nouveau constructor : prop direction dont la valeur sera le paramètre direction

    this.draw = function() {
      //nouvelle méthode : rendre visuel le serpent (blocks rouge)
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]); //appel de la function drawBlock qui prend en paramètre le context et la position dans l'array body
      }
      ctx.restore();
    };

    this.advance = function() {
      //nouvelle méthode : déplacer snake d'un block en changeant ses coordonnées
      let nextPosition = this.body[0].slice(); //copie avec .slice la position de la tête du serpent (premier block)

      switch (this.direction) {
        case "right":
          nextPosition[0] += 1;
          break;
        case "left":
          nextPosition[0] -= 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        default:
          throw "Invalid direction"; //par defaut applique la function throw qui prend en compte une erreur et affiche un message.
      }
      this.body.unshift(nextPosition); //rajoute cette nouvelle coordonnée au tableau de position (donc 4 blocks)
      this.body.pop(); // supprime le dernier block du corps du serpent (retour à 3 blocks), le serpent à avancer d'un block en x
    };

    this.setDirection = function(newDirection) {
      //nouvelle méthode : modifications des coordonnées selon la touche utilisée
      let allowedDirections;

      switch (this.direction) {
        case "right": // si direction = right ou left alors on crée un tableau avec string up et down
        case "left":
          allowedDirections = ["up", "down"];
          break;
        case "up": // si direction = up ou down alors on crée un tableau avec string left et right
        case "down":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "Invalid direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        //si la valeur de newDirection est trouvée dans allowedDirections alors il
        this.direction = newDirection; //renverra son index. Si celui-ci est supérieur à moins -1 (càd qu'il existe) alors..
      }
    };

    this.checkCollision = function() {
      let wallCollision = false;
      let snakeCollision = false;
      let headOfSnake = this.body[0]; //recupère la tête du serpent (premier block du array)
      let restOfSnake = this.body.slice(1); //recupère le reste des valeurs du array sauf la première grace à .slice(1) et en fait un autre array [[xblock2, yblock2],[xblock3, yblock3]]
      let headX = headOfSnake[0]; //recupère la coord x du premier block (=tête)
      let headY = headOfSnake[1]; // idem pour coord y
      let minX = 0;
      let minY = 0;
      let maxX = widthInBlocks - 1;
      let maxY = heightInBlocks - 1;
      let horizontalCollision = headX < minX || headX > maxX;
      let verticalCollision = headY < minY || headY > maxY;

      if (horizontalCollision || verticalCollision) {
        //test la collision avec les murs
        wallCollision = true;
      }
      for (let i = 0; i < restOfSnake.length; i++) {
        //test la collision avec le corps du serpent
        if (headX === restOfSnake[i][0] && headY === restOfSnake[i][1]) {
          snakeCollision = true;
        }
      }

      return wallCollision || snakeCollision; //renvoi un booleen en resultat des tests de collisions
    };
  }

  function apple(position) {
    // création du protype de la pomme avec un paramètre
    this.position = position;

    this.draw = function() {
      ctx.save(); //permet d'enregistrer le canvas existant notamment avec le serpent dessiné en rouge.
      ctx.fillStyle = "#33cc33";
      let radius = blockSize / 2; //permet de récupérer le rayon du cercle
      let x = position[0] * blockSize + radius; // recupère le point x et y du centre du cercle afin de le dessiner
      let y = position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true); //dessine le cercle grace à .arc(). 0 ou Math.PI * 0 = angle de départ - Math.PI * 2 = angle de fin (Math.PI * 0.5 vaut 1/4 de cercle)
      ctx.fill(); //donne la couleur de remplissage définie dans .fillstyle
      ctx.restore();
    };
  }

  document.onkeydown = function handleKeyDown(event) {
    //prend en paramètre l'évènnement (ici appuyer sur une touche)
    let key = event.keyCode; //récupération sur l'évènnement du code de la touche utilisée
    let newDirection;
    switch (key) {
      case 37: // code 37 = flèche de gauche
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      default:
        return; //dans ce cas permet d'arrêter la function
    }

    snakee.setDirection(newDirection); //on applique newDirection à la méthode setDirection  afin que la nouvelle direction soit évaluer et
  };
};
