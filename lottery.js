const teams = [
  "Dan",            // 1
  "Mikey",          // 2
  "Kwet",           // 3
  "Jim",            // 4
  "Scott",          // 5
  "Hadi",           // 6
  "Ray",            // 7
  "Luke",           // 8
  "Shane",          // 9
  "Coleman",        // 10
  "Amit",           // 11
  "Dan (via Chris)" // 12
];

const odds = {
  "Dan":            [12.0, 11.8, 11.5, 11.2, 10.9, 10.4, 9.9, 9.0, 7.8, 5.5],
  "Mikey":          [12.0, 11.8, 11.5, 11.2, 10.9, 10.4, 9.9, 9.0, 7.8, 5.5],
  "Kwet":           [12.0, 11.8, 11.5, 11.2, 10.9, 10.4, 9.9, 9.0, 7.8, 5.5],
  "Jim":            [12.0, 11.8, 11.5, 11.2, 10.9, 10.4, 9.9, 9.0, 7.8, 5.5],
  "Scott":          [10.0, 10.1, 10.1, 10.2, 10.3, 10.3, 10.3, 10.3, 10.0, 8.5],
  "Hadi":           [10.0, 10.1, 10.1, 10.2, 10.3, 10.3, 10.3, 10.3, 10.0, 8.5],
  "Ray":            [10.0, 10.1, 10.1, 10.2, 10.3, 10.3, 10.3, 10.3, 10.0, 8.5],
  "Luke":           [10.0, 10.1, 10.1, 10.2, 10.3, 10.3, 10.3, 10.3, 10.0, 8.5],
  "Shane":          [6.0, 6.3, 6.7, 7.2, 7.8, 8.5, 9.6, 11.4, 14.4, 22.1],
  "Coleman":        [6.0, 6.3, 6.7, 7.2, 7.8, 8.5, 9.6, 11.4, 14.4, 22.1],
  "Amit":           [],
  "Dan (via Chris)": []
};

document.getElementById("start-button").addEventListener("click", runLottery);

function runLottery() {
  const raceContainer = document.getElementById("race-container");
  const results = document.getElementById("results");
  raceContainer.innerHTML = "";
  results.innerHTML = "";

  const draftOrder = getDraftOrder();

  draftOrder.forEach((team, i) => {
    const row = document.createElement("div");
    row.className = "race-row";

    const horse = document.createElement("div");
    horse.className = "horse";
    horse.id = `horse-${i}`;
    horse.innerText = team.charAt(0);

    const track = document.createElement("div");
    track.className = "track";

    row.appendChild(horse);
    row.appendChild(track);
    raceContainer.appendChild(row);

    setTimeout(() => {
      horse.style.marginLeft = `${(10 - i) * 10}%`;
    }, i * 1000);
  });

  setTimeout(() => {
    results.innerHTML = `<strong>Final Draft Order:</strong><br>${draftOrder.join(" → ")}`;
  }, draftOrder.length * 1000 + 500);
}

function getDraftOrder() {
  const remainingTeams = [...teams];
  const pickedTeams = [];

  for (let pick = 0; pick < 10; pick++) {
    const weights = remainingTeams.map(team => odds[team]?.[pick] || 0);
    const selected = weightedRandom(remainingTeams, weights);
    pickedTeams.push(selected);
    remainingTeams.splice(remainingTeams.indexOf(selected), 1);
  }

  // Remaining 2 teams go to picks 11 and 12
  return [...pickedTeams, ...remainingTeams];
}

function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;
  let sum = 0;

  for (let i = 0; i < items.length; i++) {
    sum += weights[i];
    if (rand < sum) return items[i];
  }
}
