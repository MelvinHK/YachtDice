var isTitleScreen = true;
var rerolls = 3;
var currentDiceNumbers = [];

const dice = document.getElementById("rolled-dice");
const rerollsText = document.getElementById("rerolls");

for (let die of dice.children)
    die.addEventListener("click", (e) => e.target.classList.toggle("hold"));

function rollDice() {
    if (rerolls == 0)
        return;

    if (isTitleScreen) {
        dice.style.display = "flex";
        rerollsText.style.display = "initial";
        document.getElementById("title-screen").style.display = "none";
        isTitleScreen = false;
    } else
        currentDiceNumbers = [];

    for (let die of dice.children)
        if (!die.classList.contains("hold")) {
            const getRandomNumber = Math.floor(Math.random() * 6) + 1;
            currentDiceNumbers.push(getRandomNumber);
            die.style.backgroundImage = `url("dice/${getRandomNumber}.svg")`;
        }

    rerolls--;
    rerollsText.innerText = `Rerolls left: ${rerolls}`;
}

function calculateBasicCategories() {
    ["aces", "deuces", "threes", "fours", "fives", "sixes"].forEach((name, index) => {
        var result = 0;
        currentDiceNumbers.forEach((value) => {
            if (value == index + 1)
                result += value;
        });
        document.getElementById(name).innerText = result;
    });
}

document.getElementById("roll").addEventListener("click", () => {
    rollDice();
    calculateBasicCategories();
});