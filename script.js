var isTitleScreen = true;
var rerollsLeft = 3;

const dice = document.getElementById("rolled-dice");
const rerollsLeftText = document.getElementById("rerolls");

for (let die of dice.children)
    die.addEventListener("click", (e) => e.target.classList.toggle("hold"));

function rollDice() {
    if (rerollsLeft == 0)
        return;
    if (isTitleScreen) {
        dice.style.display = "flex";
        rerollsLeftText.style.display = "initial";
        document.getElementById("title-screen").style.display = "none";
        isTitleScreen = false;
    }

    for (let die of dice.children)
        if (!die.classList.contains("hold")) {
            const getRandomNumber = Math.floor(Math.random() * 6) + 1;
            die.style.backgroundImage = `url("dice/${getRandomNumber}.svg")`;
        }
    rerollsLeft--;
    rerollsLeftText.innerText = `Rerolls left: ${rerollsLeft}`;
}

function calculateCategories() {
    return;
}

document.getElementById("roll").addEventListener("click", () => { rollDice(); calculateCategories(); });

function getRolledDice() {
    const result = [];

    for (let die of dice.children) {
        const spliced = getComputedStyle(die).backgroundImage.split('/');
        result.push(spliced[spliced.length - 1][0]);
    }

    return result;
}