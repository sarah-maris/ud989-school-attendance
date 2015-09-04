/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */

/*======= MODEL =======*/

var model = {
  attendance: JSON.parse(localStorage.attendance),
  allMissed: $('tbody .missed-col'),
  allCheckboxes: $('tbody input')
  //TODO:  create obj for students using array of names and dates
};

/*======= OCTOPUS =======*/
var octopus = {
	// TODO: move init, count and update functions in here
}

/*======= VIEW =======*/

var view = {
	// TODO: use js to build page based on data instead of hard code
	// TODO: update local storage
	// TODO: update days missed on chart
}

$(function() {

    /*var attendance = JSON.parse(model.attendanceRecord),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');*/

    // Count a student's missed days  <-- MOVE TO OCTOPUS
    function countMissing() {
        model.allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records  <-- MOVE to VIEW
    $.each(model.attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage  <-- MOVE TO OCTOPUS
    model.allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        model.attendance = JSON.stringify(newAttendance); //<-- MOVE TO OCTOPUS
    });

    countMissing();
}());
