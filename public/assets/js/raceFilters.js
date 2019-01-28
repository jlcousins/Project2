// JS FOR ALL RACES HTML PAGE, TABLE FILTERS WILL GO HERE IF WE GET TO IT
// WAIT FOR HTML LOAD BEFORE PERFORMING ANY JS
$(document).ready(function() {
  // GET ALL RACES WHEN PAGE LOADS
  getAllRaces()

  $(document).on('click', '.delete-race', deleteRace)
  $(document).on('click', '.race-modal-link', getOneRace)

  // LISTENER TO CHECK IF USER CHANGES DROP DOWN FILTER
  $('#category').change(function() {
    // IF USER CHANGES FILTER, RUN CORRESPONDING FUNCTION
    if ( $(this).val() == 'all' ) {
      getAllRaces()
    } else if ( $(this).val() == 'run' ) {
      getRunRaces()
    } else if ( $(this).val() == 'bike' ) {
      getBikeRaces()
    } else if ( $(this).val() == 'obstacle' ) {
      getObstacleRaces()
    }
  })  

  function getAllRaces() {
    // console.log(`you clicked get all races`)
    $.get('/api/races', function(data) {
      // CLEAR TABLE OF CURRENT DATA
      clearCards()
      // console.log(data)
      // TAKE DATA AND RENDER ROWS OF INFORMATION
      createRaceCards(data)
    })
  }

  function getRunRaces() {
    // console.log(`you clicked get run races`)
    $.get('/api/races/run', function(data) {
      // CLEAR TABLE OF CURRENT DATA
      clearCards()
      // TAKE DATA AND RENDER ROWS
      createRaceCards(data)
    })
  }

  function getBikeRaces() {
    // console.log(`you clicked get bike races`)
    $.get('/api/races/bike', function(data) {
      // CLEAR TABLE OF CURRENT DATA
      clearCards()
      // TAKE DATA AND RENDER ROWS
      createRaceCards(data)
    })
  }

  function getObstacleRaces() {
    // console.log(`you clicked get obstacle races`)
    $.get('/api/races/obstacle', function(data) {
      // CLEAR TABLE OF CURRENT DATA
      clearCards()
      // TAKE DATA AND RENDER ROWS
      createRaceCards(data)
    })
  }

  function getOneRace() {
    // SET ID TO THE CLICKED ELEMENT'S DATA ID
    let id = $(this).attr('data-id')
    $.get('/api/races/individual/' + id, function(data) {
      // CLEAR ANYTHING IN THE MODAL TEXT
      clearModal()
      // CONVERT DATA TO AN OBJECT
      let dataObj = data[0]
      // PASS THE OBJECT INTO RENDER FUNCTION FOR MODAL DISPLAY
      renderModal(dataObj)
    })
  }

  function deleteRace() {
    let id = $(this).attr('data-id')
    // console.log(id)
    $.ajax({
      method: 'DELETE',
      url: '/api/races/' + id
    }).then(function() {
      getAllRaces()
    })
  }

  // FUNCTION TO DYNAMICALLY INSERT THE HTML FOR RACE CARDS
  function createRaceCards(data) {
    if (data.length < 1) {
      let noResults = `<h1 class="justify-content-center">Oops! Looks like there are no races here</h1>`
      $('.card-deck').append(noResults)
    } else {
      // LOOP THROUGH DATA AND RENDER HTML
      for ( let i = 0; i < data.length; i++ ) {
        let id = data[i].id
        let name = data[i].raceName
        let date = data[i].date
        let address = data[i].street + '<br>' + data[i].city + ', ' + data[i].state + ' ' + data[i].zip
        let raceType = ''
        if ( data[i].category == 'run' ) {
          raceType = 'Running'
        } else if ( data[i].category == 'bike' ) {
          raceType = 'Cycling'
        } else if ( data[i].category == 'obstacle') {
          raceType = 'Obstacle'
        }

        let modalLink = $('<a>')
        modalLink.attr('href', '#')
        modalLink.attr('data-toggle', 'modal')
        modalLink.attr('data-target', '#info-modal')
        modalLink.attr('data-id', id)
        modalLink.addClass('no-link-deco race-modal-link')
        let card = $('<div>').addClass('card race-card').attr('data-id', id)
        let img = '<img class="card-img-top d-block mb-0" src="../assets/img/onyourmarklogo_coral.svg" alt="Cupid">'
        let cardBody = $('<div>').addClass('card-body mt-1 py-0')
        let title = $('<h5>').addClass('card-title text-center my-0 no-link-deco').text(name)
        let cardText = $('<p>').addClass('card-text text-center mt-0 mb-2')
        cardText.append('<small class="text-muted text-center">' + raceType + ' Event</small>')
        let cardDate = $('<p>').addClass('text-center my-2').text(date)
        let cardAddress = $('<p>').addClass('text-center mb-2 no-link-deco').html(address)
        let footer = $('<div>').addClass('card-footer p-1')
        let footerText = $('<p>').addClass('text-center mb-0')
        let deleteBtn = $('<p>').addClass('btn btn-sm btn-outline-secondary btn-block delete-race mb-0')
        deleteBtn.text('Delete This Race')
        deleteBtn.attr('data-id', id)

        card.append(modalLink)
        modalLink.append(img)
        modalLink.append(cardBody)
        cardBody.append(title)
        cardBody.append(cardText)
        cardBody.append(cardDate)
        cardBody.append(cardAddress)
        card.append(footer)
        footer.append(footerText)
        footerText.append(deleteBtn)
        $('.card-deck').append(card)
      }
    }
  }

  function renderModal(data) {
    // console.log(data)
    // console.log(data.category)
    // GRAB AND SET EACH HTML ELEMENT IN THE MODAL TO THE INFO
    // THAT CORRESPONDS TO THE RACE THE USER CLICKS
    let modalTitle = $('.race-title-modal')
    modalTitle.text(data.raceName)
    let modalOrganizer = $('.organizer-modal')
    modalOrganizer.text('Organized by: ' + data.firstName + ' ' + data.lastName)
    let modalAddress = $('.address-modal')
    modalAddress.html(data.street + '<br>' + data.city + ', ' + data.state + ' ' + data.zip)
    let modalDate = $('.date-modal')
    modalDate.text(data.date)
    let modalEmail = $('.email-link-modal')
    modalEmail.text(data.email)
    let modalParticipant = $('.participant-modal')
    let emailLink = $('.email-link-modal')
    emailLink.attr('href', 'mailto:'+data.email)
    modalParticipant.text(data.participantCap + ' Max Participants')
    let modalPhone = $('.phone-modal')
    modalPhone.text(data.phoneNumber)
    let modalLength = $('.length-modal')
    modalLength.text(data.raceLength + 'km')
    let modalDesc = $('.description-modal')
    modalDesc.text(data.description)
    let modalLink = $('.race-title-modal')
    modalLink.attr('href', data.url)
  }
  
  function clearCards() {
    $('.card-deck').empty()
  }

  function clearModal() {
    // CLEAR ALL ELEMENTS IN MODAL
    let modalTitle = $('.race-title-modal')
    modalTitle.text('')
    let modalOrganizer = $('.organizer-modal')
    modalOrganizer.text('')
    let modalAddress = $('.address-modal')
    modalAddress.text('')
    let modalDate = $('.date-modal')
    modalDate.text('')
    let modalEmail = $('.email-link-modal')
    modalEmail.text('')
    let modalParticipant = $('.participant-modal')
    modalParticipant.text('')
    let modalPhone = $('.phone-modal')
    modalPhone.text('')
    let modalLength = $('.length-modal')
    modalLength.text('')
    let modalDesc = $('.description-modal')
    modalDesc.text('')
  }

  // *******************************************************
  //                CAROUSEL JAVASCRIPT
  // *******************************************************
  // CAROUSEL CODE
  var slideIndex = 0;
  carousel();

  function carousel() {
    var i;
    var x = document.getElementsByClassName("sportslide");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) {
      slideIndex = 1
    }
    x[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 4000); // Change image every 4 seconds
  }
})