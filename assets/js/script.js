// tasks to be stringified, put into local storage,
// and reloaded

var tasks = [];


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



// loads the task descriptions back from local storage
function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    if(!tasks) {
        tasks = [];
    }

    // loop through the array that was stored in local storage
    for(var i = 0; i < tasks.length; i++){
        // if the current index is not falsy and is an actual word
        // or value. use the current index to also find the 
        // corresponding
        // p element that I set up using a custom data attribute.
        if(tasks[i]){
            $("p[data-row='" + i + "']").text(tasks[i]);
        }

    }

}


// click on task p element, replaces with textarea
$(".row").on("click", ".task-area", function() {

    // the custom data attribute needs to travel to
    // the new textarea element
    var dataAttr = $(this).data("row");

    // get current text of task area
    var text = $(this).text().trim();

    var color = "";

    if($(this).hasClass("past")){
        color = "#c3c3c3";
    }
    else if($(this).hasClass("present")){
        color = "#ff6961";
    }
    else {
        color = "#77dd77";
    }

    var textBox = $("<textarea>")
    .attr("type", "text")
    // sets data attribute so we can pass it back to the new
    // p in the next function below.
    .attr("data-row", dataAttr)
    .addClass("form-control col-10")
    .val(text);


    // need to do this for some reason to get it to work on
    // text area or inputs.
    textBox.css("background", color);


    $(this).replaceWith(textBox);

    textBox.trigger("focus");

    // function to change back to p after the click off below
})

// textarea is dynamically generated, so we need to use 
// event delegation. This checks for textareas that are within a 
// row, whether they have been created yet or not.
$(".row").on("blur", "textarea", function() {

    // the custom data attibute we passed in the textarea
    // in the last function
    // is now going to get passed into the new p
    var dataAttr = $(this).data("row");

    var newText = $(this).val().trim();

    // gets index of the row in relation to the other rows
    // within the "main" parent element.
    var index = $(this).closest(".row").index();

    tasks[index] = newText;


    var newPTask = $("<p>")
    .addClass("col-10 task-area")
    // here is where we set it again with the same value
    .attr("data-row", dataAttr)
    .text(newText);

    $(this).replaceWith(newPTask);

    // check time checks to see what color to make the
    // p element based on the time of the day.
    // before, present, after current time.
    // we call it after the new p is made so that the 
    // color will be set back to the way it was.
    // check time uses the p element's custom data attribute
    // to figure out which row it is in and which p to change.
    checkTime();

})



// When save button is clicked, save tasks
// to localStorage
// save only happens when button is clicked.
$(".saveBtn").on("click", saveTasks);



// time based functions

function currDay() {
    var date = moment().format("MMM Do YYYY")

    $("#currentDay").text("Today is: " + date);
}


// checks the time difference between current time
// and time slots to decide what bg color to give each section
function checkTime() {
    // gets current time
    var currTime = moment();

    // this function runs through each element with the class
    // of hour in the DOM and provides an index of which 
    // element it is currently on
    $(".hour").each(function (i) {

        // task p in same row as hour element, found by index
        // which we put in custom data attribute
        // removes current task's bg color so it can
        // re add the relevant color based on time
        // everytime an update happens and this function
        // runs.
        $("p[data-row='" + i + "']").removeClass("past");
        $("p[data-row='" + i + "']").removeClass("present");
        $("p[data-row='" + i + "']").removeClass("future");
        
        time = "";

        // This is for all the AM timeslots
        if(i < 3){
            time = $(this).text().trim().replace("AM", " AM");
            
        }
        else {
            time = $(this).text().trim().replace("PM", " PM");
        }
        
        // formats into time object
        // Allows for a moment object in the format of 6 AM 5 PM, etc.
        // to be made and used.
        var compare = moment(time, "HH A");
        // Had to make these both 2 separate objects or else
        // it just rewries the original "compare" variable above.
        // so i couldn't do "compare.add(1, hours)"
        var addComp = moment(time, "HH A").add(1, "hours");
        
        // since current time is exact, it rarely ever becomes
        // flatly 9:00 or 6:00 etc. so I check first to see if
        // the current time is in between 2 of the time slots.
        // then after it checks if there are timeslots in the 
        // past or the future.

        // both of these variables are moment objects, they
        // must be moment objects in order to use moment
        // methods like isBetween() etc. Thats why you cant turn the
        // variables into strings with something like
        // moment().format()
        if(currTime.isBetween(compare, addComp)){
            // changes bg color
            $("p[data-row='" + i + "']").addClass("present");
        }
        else if(currTime.isAfter(compare)){
            $("p[data-row='" + i + "']").addClass("past");
        }
        else {
            $("p[data-row='" + i + "']").addClass("future");
        }
    })

}


// set interval updates

// every 10 minutes the time will be checked to update
// the task p elements and the date at the top of the screen
// in the header
setInterval(function() {
    checkTime();
    currDay();
}, 600000);



// events
// on refresh these functions will run
loadTasks();
currDay();
checkTime();