window.onload = function() {
  let canvas;
  let canvasWidth = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let snakee;

  init();

  function init() {
    canvas = document.createElement("canvas"); // création du canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas); // ajout du canvas au body
    snakee = new snake([
      [6, 4],
      [5, 4],
      [4, 4]
    ]); // création du serpent - serpents de trois blocks dont les valeurs sont les positions x et y des blocks
    ctx = canvas.getContext("2d");

    refreshCanvas();
  }

  function refreshCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    snakee.advance();
    snakee.draw();
    setTimeout(refreshCanvas, delay);
  }

  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  function snake(body) {
    this.body = body;

    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };

    this.advance = function() {
      let nextPosition = this.body[0].slice(); //recupère la position de la tête du serpent en x
      nextPosition[0] += 1; //change sa coordonnée en x + 1
      this.body.unshift(nextPosition); //rajoute cette nouvelle coordonnée au tableau de position (donc 4 blocks)
      this.body.pop(); // supprime le dernier block du corps du serpent (retour à 3 blocks), le serpent à avancer d'un block en x
    };
  }
};
