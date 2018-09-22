function getDataFromApi(searchTerm, callback) {
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

function showResults(data) {
  console.log(data.Similar.Results);
}

getDataFromApi("stargate sg1", showResults);