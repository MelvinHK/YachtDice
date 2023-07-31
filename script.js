var isTitleScreen = true;
var rerolls = 3;
var turn = 1;
var isNewTurn = false;

var scores = {
    aces: 0,
    deuces: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    choice: 0,
    fourOfKind: 0,
    fullHouse: 0,
    smallStraight: 0,
    largeStraight: 0,
    yacht: 0
};

var subtotal = 0;
var total = 0;

const dice = document.getElementById("rolled-dice");

const rollButton = document.getElementById("roll");
const rerollsText = document.getElementById("rerolls");

const scoresGrid = document.getElementById("scores");
const scoreCategories = document.getElementsByClassName("row-wrapper");
const bonus = document.getElementById("bonus");

const heading = document.getElementById("title-screen");
const turnsText = document.getElementById("turns");

const diceRollSounds = [new Audio("sounds/diceRoll.mp3"), new Audio("sounds/diceRoll2.mp3"), new Audio("sounds/diceRoll3.mp3")];

for (let die of dice.children)
    die.addEventListener("click", (e) => {
        e.target.classList.toggle("hold");
    });

function rollDice() {
    for (let die of dice.children)
        if (!die.classList.contains("hold")) {
            const randomDieNumber = Math.floor(Math.random() * 6) + 1;
            die.value = randomDieNumber;
            die.firstChild.src = `dice/${randomDieNumber}.svg`;
        }

    rerollsText.innerText = `Rerolls left: ${--rerolls}`;
}

function getDiceNumbers() {
    const result = [];
    for (let die of dice.children)
        result.push(Number(die.value));
    return result;
}

function updateScore(categoryName, result) {
    if (scores[categoryName] == "saved")
        return;
    scores[categoryName] = result;
    document.getElementById(categoryName).innerText = result;
}

function calculateBasicCategories() {
    ["aces", "deuces", "threes", "fours", "fives", "sixes"].forEach((name, index) => {
        var result = 0;
        getDiceNumbers().forEach((value) => {
            if (value == index + 1)
                result += value;
        });
        updateScore(name, result);
    });
}

function calculateChoice() {
    var result = 0;
    getDiceNumbers().forEach((value) => result += value);
    updateScore("choice", result);
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

    // Add score if fourOfKind or yacht.
    updateScore("fourOfKind", isFourOfKind ? result : (diceSet.size == 1) ? diceArray[0] * 5 : 0);
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
    updateScore("fullHouse", isFullHouse ? result : 0);
}

function calculateStraights() {
    var sortedDice = getDiceNumbers().sort();

    // 3 = smallStraight, 4 = largeStraight
    for (let i = 3; i < 5; i++) {
        var straightCount = 0;

        for (let j = 0; j < sortedDice.length; j++) {
            var difference = sortedDice[j + 1] - sortedDice[j];
            if (difference == 1) {
                straightCount++;
                if (straightCount == i)
                    break;
            }
            else if (difference != 0)
                straightCount = 0;
        }

        if (i == 3)
            updateScore("smallStraight", (straightCount == 3) ? 15 : 0);
        else
            updateScore("largeStraight", (straightCount == 4) ? 30 : 0);
    }
}

function calculateYacht() {
    var diceSet = new Set(getDiceNumbers());
    updateScore("yacht", (diceSet.size == 1) ? 50 : 0);
}

function toggleScoresPointerEvents() {
    Array.from(scoreCategories).forEach((category) =>
        category.style.pointerEvents = (category.style.pointerEvents == "all") ? "none" : "all"
    );
}

document.getElementById("roll").addEventListener("click", (e) => {
    if (rerolls == 0)
        return;

    if (isTitleScreen || isNewTurn) {
        rerollsText.style.visibility = "visible";
        toggleScoresPointerEvents();

        if (isTitleScreen) {
            dice.style.display = "flex";
            heading.style.display = "none";
            turnsText.style.display = "initial";
            isTitleScreen = false;
        }

        if (isNewTurn) {
            dice.classList.remove("dice-disabled");
            rollButton.innerText = "Roll";
            isNewTurn = false;
        }
    }

    diceRollSounds[Math.floor(Math.random() * 3)].play();
    e.target.classList.add("shake");
    setTimeout(() => e.target.classList.remove("shake"), 620); // Timeout matches shake animation length.

    rollDice();
    calculateBasicCategories();
    calculateChoice();
    calculateFourOfKind();
    calculateFullHouse();
    calculateStraights();
    calculateYacht();
});

// Score saving events.
Array.from(scoreCategories).forEach((category, index) => {
    category.addEventListener("click", () => {
        category.classList.add("score-saved");

        var categoryName = Object.keys(scores)[index];
        if (isNewTurn || scores[categoryName] == "saved")
            return;

        if (index < 6) {
            document.getElementById("subtotal").innerText = subtotal += scores[categoryName];
            if (subtotal >= 63) {
                total += 35;
                bonus.innerText = "35";
                bonus.style.color = "red";
            }
        }
        document.getElementById("total").innerText = total += scores[categoryName];

        scores[categoryName] = "saved"; // Mark as saved AFTER its value is added to total.
        toggleScoresPointerEvents();

        rerolls = 3;
        rerollsText.style.visibility = "hidden";

        dice.classList.add("dice-disabled");
        for (let die of dice.children)
            die.classList.remove("hold");

        isNewTurn = true;
        turnsText.innerText = `Turn ${++turn}/12`;
        if (turn > 12) {
            dice.style.display = "none";
            turnsText.style.display = "none";
            rollButton.innerText = total;
            rollButton.style.pointerEvents = "none";
            heading.style.display = "initial";
            heading.firstElementChild.innerText = "Final Score:";
        }
        else
            rollButton.innerText = "New Roll";
    });
});