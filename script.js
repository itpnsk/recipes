const submitForm = document.getElementById("submitForm");
const submitButton = document.getElementById("submitButton");
const inpText = document.getElementById("title");
const resultsInfo = document.getElementById("resultsInfo");
const resultsList = document.getElementById("resultsList");
const singleMealDetails = document.getElementById("singleMealDetails");

function searchMeal(e) {
    e.preventDefault();
    console.log("getData()");
    fetch(`http://www.themealdb.com/api/json/v1/1/search.php?s=${inpText.value}`)
    .then(res => res.json())
    .then(data => {
        // console.log(data.meals);
        // if (data.hasOwnProperty("meals")) {
        if (data.meals != null) {
            resultsInfo.innerHTML = `<h3>Found ${data.meals.length} results for term <i>${inpText.value}</i></h3>`;
            getMeals(data);
        } else {
            resultsInfo.innerHTML = `<h3>No results found for term ${inpText.value}</h3>`;
        }
        inpText.value = "";
    })
}

function searchMealID(mealID) {
    fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
       console.log(data.meals[0]);
       getIngerientsList(data.meals[0]);
       singleMeal2DOM(data.meals[0]);
    //    getIngerientsList(data.meals[0]);
    });
}

function getIngerientsList(meal) {
    let c=1;
    while (c<=20) {
        if (meal["strIngredient"+c]) {
            ingerientsList[meal["strIngredient"+c]] = meal["strMeasure"+c];
        }
        c++;
    }
    console.log(ingerientsList);
    return ingerientsList;
}

function singleMeal2DOM(meal) {
    singleMealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img id="singleMealIMG" src="${meal.strMealThumb}" />
    <h2>Ingerdientes</h2>
    <ul>
        ${Object.keys(ingerientsList).map((key) => {
            return "<ul>" + key +" - " + ingerientsList[key] + "</ul>";
        }).join("")}
    </ul>
    <h2>Instructions</h2>
    <p id="singleMealInstructions">${meal.strInstructions}</p>
    `;
}

function getMeals(data) {
    const res = data.meals.map((meal)=>{
        return `<div data-id=${meal.idMeal} class="meals"><img src="${meal.strMealThumb}"><div class="nameWrapper"><h4>${meal.strMeal}</h4></div></div>`;
    });
    resultsList.innerHTML = res.join("");
    setEventListeners();
}

function setEventListeners() {
    let elementsArray = document.querySelectorAll(".meals");
    console.log(elementsArray);

    elementsArray.forEach((element)=>{
        element.addEventListener("click", (e)=>{
            console.log(e.currentTarget.getAttribute("data-id"));
            searchMealID(e.currentTarget.getAttribute("data-id"));
        })
    })
}

let ingerientsList = {};

submitForm.addEventListener("submit", searchMeal);