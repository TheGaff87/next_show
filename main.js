function getDataFromTasteDive(searchTerm, callback) {
  const settings = {
    url: "https://tastedive.com/api/similar",
    data: {
      q: searchTerm,
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

function displaySearched(query) {
    if (query.Type !== "unknown") {
        $(".results").append(`<p class="js-searched"><h3>If you like <a href="${query.wUrl}" target="_blank">${query.Name}</a>, you might also like these 20 shows:</h3></p>`)
    } else {
        $(".results").append(`<p class="js-not-found"><h3>Sorry, I couldn't find that show. Please try again.</h3></p>`)
    }
}

function displaySimilar(query) {
    for (i = 0; i < query.length; i++) {
        $(".results").append(`
        <div class="${i}">
            <button class="${i}" type="button">${query[i].Name}</button>
            <article class="${i} hidden">
                <p class="col-6">${query[i].wTeaser}<br>
                <a href="${query[i].wUrl}">Read more</a></p>
                <iframe width="500" height="315" class="col-6" src="https://www.youtube.com/embed/${query[i].yID}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </article>
        </div>`)
    }
}

function displayResults(data) {
    const searchedTerm = data.Similar.Info[0];
    const resultsList = data.Similar.Results;
    displaySearched(searchedTerm);
    displaySimilar(resultsList);
    $(".results").on("click", "button", function (event) {
        const num = $(this).attr("class");
        $("article").css("display", "none");
        $("article." + num).css("display", "block");
    })
}

function handleSubmit() {
    $(".submit").click(function(event) {
        event.preventDefault();
        const response = $(".response").val();
        $(".response").val("");
        $(".results").html("");
        $(".results").prop('hidden', false)
        getDataFromTasteDive(response, displayResults);
    })
}

function handleApp() {
    handleSubmit();
}

$(handleApp);