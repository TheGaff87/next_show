/* using global variables sparingly to store data that needs to be available for multiple functions */
let tasteDiveResults;
let response;

function getDataFromTasteDive(searchTerm, callback) {
    const settings = {
        url: "https://tastedive.com/api/similar",
        data: {
            q: "show:" + searchTerm,
            k: "320256-test-VZMF4T55",
            type: "shows",
            info: 1
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

function getDataFromUTelly(searchTerm, callback) {
    const settings = {
        url: "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup",
        data: {
            country: "us",
            term: searchTerm
        },
        headers: {
            "X-Mashape-Key": "bhHt3a0Z4kmshbCmYdWKvoFI8Fa7p1Hx1PujsnNrszpNIQ2xUK",
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

function displaySearched(array, name) {
    if (name.Type !== "unknown" && array.Results.length > 0) {
        $(".results").append(`<p class="js-searched"><h3>If you like <a href="${name.wUrl}" target="_blank">${name.Name}</a>, you might also like these ${array.Results.length} shows:</h3></p>`)
    } else {
        $(".results").append(`<p class="js-not-found"><h3>Sorry, I couldn't find <span class="js-response-term">${response}</span>. Please try again.</h3></p>`)
    }
}

function displaySimilar(query) {
    for (i = 0; i < query.length; i++) {
        $(".results").append(`
        <div class="${i} js-results-div" data-featherlight="#mylightbox${i}">
            <button class="${i} js-result-button" type="button">${query[i].Name}</button>
            <article class="${i} hidden col-12" id="mylightbox${i}">
                <p class="js-wiki col-6">${query[i].wTeaser}<br><br>
                <a href="${query[i].wUrl}" target="_blank">Read more about ${query[i].Name} on Wikipedia</a></p>
                <iframe width="500" height="315" class="col-6" src="https://www.youtube.com/embed/${query[i].yID}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </article>
        </div>`)
    }
}

/* intermediate function to ensure second API call executes after data from first API call has been received */
function dataHandler(data) {
    tasteDiveResults = data.Similar.Results;
    displayResults(data);
    processResults(tasteDiveResults);
}

function processResults(data) {
    for (i = 0; i < tasteDiveResults.length; i++) {
        getDataFromUTelly(data[i].Name, displayWhereWatch);
    }
}

function displayShowImg(data) {
    const correctButton = $("button").filter(function() {
        return $(this).text() === data.term
    });
    const correctDiv = correctButton.parent();
    let showImg = $(`<img class="js-show-img">`);
    if (data.results.length > 0) {
        const photoUrl = data.results[0].picture;
        showImg.attr("src", photoUrl);
        showImg.attr("alt", data.term);
    } else {
        showImg.attr("src", "sorry.jpg");
        showImg.attr("alt", "sorry not found");
    }
    $(correctDiv).append(showImg);
}

function displayWhereWatch(data) {
    displayShowImg(data);
    const correctEl = $("button:contains('" + data.term + "')").parent().children("article");
    const watchText = `<p class="js-where-watch col-12">Watch this show on: </p>`;
    const currentItem = data.results[0].locations;
    if (currentItem != undefined) {
        $(correctEl).append(watchText);
    }
    const itunes = "itunes.png";
    const amazonPrime = "amazon_prime.jpg";
    const amazonInstant = "amazon_instant.png"
    const netflix = "netflix.png";
    for (i = 0; i < currentItem.length; i++) {
        let img = $(`<img class="js-watch">`);
        if (currentItem[i].display_name === "iTunes") {
            img.attr("src", itunes);
            img.attr("alt", "iTunes logo");
        } else if (currentItem[i].display_name === "Amazon Prime") {
            img.attr("src", amazonPrime);
            img.attr("alt", "Amazon Prime logo")
        } else if (currentItem[i].display_name === "Netflix") {
            img.attr("src", netflix);
            img.attr("alt", "Netflix logo");
        } else {
            img.attr("src", amazonInstant);
            img.attr("alt", "Amazon Instant Video logo");
        }
        correctEl.children(".js-where-watch").append(`<a href="${currentItem[i].url}" target="_blank" class="${currentItem[i].name}"></a>`)
        correctEl.children(".js-where-watch").children("." + currentItem[i].name).append(img);
    }
}

function displayResults(data) {
    const searchedArray = data.Similar;
    const searchedTerm = data.Similar.Info[0];
    const resultsList = data.Similar.Results;
    displaySearched(searchedArray, searchedTerm);
    displaySimilar(resultsList);
}

function handleSubmit() {
    $(".submit").click(function (event) {
        event.preventDefault();
        response = $(".response").val();
        $(".response").val("");
        $(".results").html("");
        $(".results").prop('hidden', false);
        if (response.length > 0) {
            getDataFromTasteDive(response, dataHandler);
        } else {
            $(".results").append(`<p class="js-required">Please enter a TV show.</p>`);
        }
    })
}

function handleApp() {
    handleSubmit();
}

$(handleApp);