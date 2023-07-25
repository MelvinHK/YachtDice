var isInitialLoad = true;

const dice = document.getElementById("rolled-dice").children;
for (let die of dice) {
    die.addEventListener("click", (e) => e.target.classList.toggle("hold"));
}

document.getElementById("roll").onclick = rollDice;

function rollDice() {
    if (isInitialLoad) {
        document.getElementById("rolled-dice").style.display = "flex";
        document.getElementById("rerolls").style.display = "initial";
        document.getElementById("title-screen").style.display = "none";
        isInitialLoad = false;
    }

    for (let die of dice) {
        if (!die.classList.contains("hold")) {
            const getRandomNumber = Math.floor(Math.random() * 6) + 1;
            die.style.backgroundImage = `url("dice/${getRandomNumber}.svg")`;
        }
    }
}

function getRolledDice() {
    const result = [];

    for (let die of dice) {
        const spliced = getComputedStyle(die).backgroundImage.split('/');
        result.push(spliced[spliced.length - 1][0]);
    }

    return result;
}