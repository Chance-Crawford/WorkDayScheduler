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


// click on task, replaces with textarea
$(".row").on("click", "p", function() {
    // get current text of task area
    var text = $(this).text().trim();

    var color = "";

    if($(this).hasClass("past")){
        color = "#c3c3c3";
    }

    var textBox = $("<textarea>")
    .attr("type", "text")
    .addClass("form-control col-10")
    .val(text);

    // need to do this for some reason to get it to work on
    // text area or inputs.
    textBox.css("background", color);


    $(this).replaceWith(textBox);

    textBox.trigger("focus");

    // function to change back to p after the click off below
})

$(".row").on("blur", "textarea", function() {

    var newText = $(this).val().trim();

    // gets index of the row in relation to the other rows
    // within the "main" parent element.
    var index = $(this).closest(".row").index();

    tasks[index] = newText;


    var newPTask = $("<p>")
    .addClass("col-10 task-area")
    .text(newText);

    $(this).replaceWith(newPTask);
})



// When save button is clicked, save tasks
// to localStorage
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
    var currTime = moment().subtract(9, "hours");

    // this function runs through each element with the class
    // of hour in the DOM and provides an index of which 
    // element it is currently on
    $(".hour").each(function (i) {

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
        // past or the future
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




// events
loadTasks();
currDay();
checkTime();