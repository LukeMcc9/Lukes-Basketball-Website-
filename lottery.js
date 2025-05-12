document.addEventListener("DOMContentLoaded", () => {
  const teams = [
    "Dan", "Mikey", "Kwet", "Jim", "Scott", "Hadi",
    "Ray", "Luke", "Shane", "Coleman", "Amit", "Dan (via Chris)"
  ];

  const fixedPicks = [
    { team: "Dan (via Chris)", pick: 12 },
    { team: "Amit", pick: 11 }
  ];

  const drawPool = teams.filter(team =>
    !fixedPicks.map(fp => fp.team).includes(team)
  );

  const teamColors = {
    "Dan": "#e74c3c",
    "Mikey": "#3498db",
    "Kwet": "#2ecc71",
    "Jim": "#f1c40f",
    "Scott": "#9b59b6",
    "Hadi": "#1abc9c",
    "Ray": "#e67e22",
    "Luke": "#34495e",
    "Shane": "#d35400",
    "Coleman": "#16a085",
    "Amit": "#7f8c8d",
    "Dan (via Chris)": "#c0392b"
  };

  const machine = document.getElementById("ball-machine");
  const bigReveal = document.getElementById("big-reveal");
  const startButton = document.getElementById("start-button");
  const drawButton = document.getElementById("draw-button");
  const resetButton = document.getElementById("reset-button");
  const woahButton = document.getElementById("woah-button");
  const woahSound = document.getElementById("woah-sound");
  const resultsList = document.getElementById("results-list");

  let draftOrder = [];
  let currentPickIndex = 0;
  let balls = {};
  let picksToReveal = [];

  startButton.addEventListener("click", () => {
    startButton.disabled = true;
    drawButton.disabled = false;
    resetButton.disabled = false;
    resultsList.innerHTML = "";
    machine.innerHTML = "";
    bigReveal.style.display = "none";

    const drawn = generateDraftOrder();
    draftOrder = [
      ...fixedPicks,
      ...drawn.map((team, i) => ({ team, pick: 10 - i }))
    ];
    picksToReveal = [...draftOrder];

    drawn.forEach((team) => {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.textContent = team;
      const id = getBallId(team);
      ball.id = id;

      const size = 50 + Math.random() * 40; // simplified proportional size
      ball.style.width = `${size}px`;
      ball.style.height = `${size}px`;
      ball.style.backgroundColor = teamColors[team];

      const x = Math.random() * 90;
      const y = Math.random() * 70;
      const dx = (Math.random() - 0.5) * 2.4;
      const dy = (Math.random() - 0.5) * 2.4;
      balls[team] = { el: ball, x, y, dx, dy };

      machine.appendChild(ball);
    });

    animateBalls();
  });

  drawButton.addEventListener("click", () => {
    if (currentPickIndex >= picksToReveal.length) return;

    const { team, pick } = picksToReveal[currentPickIndex];
    const id = getBallId(team);
    const ball = document.getElementById(id);
    if (ball) {
      ball.remove();
      delete balls[team];
    }

    const safeTeam = CSS.escape(team);
    const cell = document.querySelector(`td[data-team="${safeTeam}"][data-pick="${pick}"]`);
    if (cell) {
      cell.style.backgroundColor = teamColors[team] || "#333";
      cell.style.color = "#fff";
      cell.style.fontWeight = "bold";
    }

    bigReveal.textContent = `Pick ${pick}: ${team}`;
    bigReveal.style.display = "block";

    setTimeout(() => {
      bigReveal.style.display = "none";
      resultsList.innerHTML += `<li>Pick ${pick}: ${team}</li>`;
    }, 2000);

    currentPickIndex++;
    if (currentPickIndex >= picksToReveal.length) {
      drawButton.disabled = true;
    }
  });

  resetButton.addEventListener("click", () => {
    location.reload();
  });

  woahButton.addEventListener("click", () => {
    woahSound.currentTime = 0;
    woahSound.play();
  });

  function animateBalls() {
    function update() {
      Object.values(balls).forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x < 0 || ball.x > 90) ball.dx *= -1;
        if (ball.y < 0 || ball.y > 70) ball.dy *= -1;

        ball.el.style.left = `${ball.x}%`;
        ball.el.style.top = `${ball.y}%`;
      });
      requestAnimationFrame(update);
    }
    update();
  }

  function generateDraftOrder() {
    const pool = [...drawPool];
    const result = [];

    for (let i = 0; i < 10; i++) {
      const weights = pool.map(() => 1);
      const chosen = weightedRandom(pool, weights);
      result.push(chosen);
      pool.splice(pool.indexOf(chosen), 1);
    }

    return result;
  }

  function weightedRandom(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (rand < sum) return items[i];
    }
    return items[items.length - 1];
  }

  function getBallId(team) {
    return `ball-${team.replace(/\W/g, "")}`;
  }
});
