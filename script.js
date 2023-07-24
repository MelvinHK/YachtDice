var isInitialLoad = true;

function rollDice() {
    if (isInitialLoad) {
        document.getElementById("rolled-dice").style.display = "flex";
        document.getElementById("rerolls").style.display = "initial";
        document.getElementById("title-screen").style.display = "none";
        isInitialLoad = false;
    }

    const dice = document.getElementById("rolled-dice").children;

    for (let die of dice) {
        const getRandomNumber = Math.floor(Math.random() * 6) + 1;
        die.style.backgroundImage = `url("dice/${getRandomNumber}.svg")`;
    }
}

function getRolledDice() {
    const dice = document.getElementById("rolled-dice").children;
    const result = [];

    for (let die of dice) {
        const spliced = getComputedStyle(die).backgroundImage.split('/');
        result.push(spliced[spliced.length - 1][0]);
    }

    return result;
}

document.getElementById("roll").onclick = rollDice;