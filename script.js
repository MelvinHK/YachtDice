var isTitleScreen = true;
var rerolls = 3;

const dice = document.getElementById("rolled-dice");
const rerollsText = document.getElementById("rerolls");

const diceRollSounds = [new Audio("sounds/diceRoll.mp3"), new Audio("sounds/diceRoll2.mp3"), new Audio("sounds/diceRoll3.mp3")];

for (let die of dice.children)
    die.addEventListener("click", (e) => {
        e.target.classList.toggle("hold");
    });

function rollDice() {
    if (rerolls == 0)
        return;

    if (isTitleScreen) {
        dice.style.display = "flex";
        rerollsText.style.display = "initial";
        document.getElementById("title-screen").style.display = "none";
        isTitleScreen = false;
    }

    for (let die of dice.children)
        if (!die.classList.contains("hold")) {
            const randomDieNumber = Math.floor(Math.random() * 6) + 1;
            die.value = randomDieNumber;
            die.style.backgroundImage = `url("dice/${randomDieNumber}.svg")`;
        }

    rerollsText.innerText = `Rerolls left: ${--rerolls}`;
}

function getDiceNumbers() {
    const result = [];
    for (let die of dice.children)
        result.push(Number(die.value));
    return result;
}

function calculateBasicCategories() {
    ["aces", "deuces", "threes", "fours", "fives", "sixes"].forEach((name, index) => {
        var result = 0;
        getDiceNumbers().forEach((value) => {
            if (value == index + 1)
                result += value;
        });
        document.getElementById(name).innerText = result;
    });
}

function calculateChoice() {
    var result = 0;
    getDiceNumbers().forEach((value) => result += value);
    document.getElementById("choice").innerText = result;
}

function countOccurence(n) {
    var result = 0;
    getDiceNumbers().forEach((value) => {
        if (value == n)
            result++;
    });
    return result;
}

function calculateFourOfKind() {
    var diceArray = getDiceNumbers();
    var diceSet = new Set(diceArray);
    var isFourOfKind = false;
    var result = 0;

    if (diceSet.size == 2)
        diceSet.forEach((value) => {
            if (countOccurence(value) == 4) {
                isFourOfKind = true;
                result += value * 4;
            }
            else
                result += value;
        });

    document.getElementById("fourOfKind").innerText = isFourOfKind ? result : (diceSet.size == 1) ? diceArray[0] * 5 : 0;
}

function calculateFullHouse() {
    var diceSet = new Set(getDiceNumbers());
    var isFullHouse = false;
    var result = 0;

    if (diceSet.size == 2)
        diceSet.forEach((value) => {
            if (countOccurence(value) == 3) {
                isFullHouse = true;
                result += value * 3;
            }
            else
                result += value * 2;
        });

    document.getElementById("fullHouse").innerText = isFullHouse ? result : 0;
}

function calculateStraights() {
    var sortedDice = getDiceNumbers().sort();
    var straightCount = 0;

    sortedDice.forEach((value, index) => {
        var difference = sortedDice[index + 1] - value;
        if (difference == 1)
            straightCount++;
        else if (difference >= 2)
            straightCount--;
    });

    document.getElementById("smallStraight").innerText = (straightCount >= 3) ? 15 : 0;
    document.getElementById("largeStraight").innerText = (straightCount == 4) ? 30 : 0;
}

function calculateYacht() {
    var diceSet = new Set(getDiceNumbers());
    document.getElementById("yacht").innerText = (diceSet.size == 1) ? 50 : 0;
}

document.getElementById("roll").addEventListener("click", (e) => {
    if (rerolls != 0) {
        diceRollSounds[Math.floor(Math.random() * 3)].play();
        e.target.classList.add("shake");
        setTimeout(() => e.target.classList.remove("shake"), 620);
    }

    rollDice();
    calculateBasicCategories();
    calculateChoice();
    calculateFourOfKind();
    calculateFullHouse();
    calculateStraights();
    calculateYacht();
});