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

  students: [ "Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda" ],

  startDate: 1,

  endDate: 12

};


/*======= OCTOPUS =======*/
var octopus = {
	// TODO: add click function for check boxes
	// TODO: update local storage for checks
	// TODO: update days missed on chart

	//Set things up
	init: function() {
		localStorage.clear(); //REMOVE THIS FOR FINAL
		test();
		view.addTable();
	},

	getClassAttendance: function () {
		return model.attendance;
	},

	getStudentRecord:  function( studentName ) {
		return model.attendance[ studentName ];
	},

	getDays: {
		start: model.startDate,
		end: model.endDate
	},

	//Count absences
	countAbsences: function ( studentName ) {
		var record = this.getStudentRecord( studentName );
		var absences = 0;
		for (var j = model.startDate; j <= model.endDate; j ++ ) {
			if ( !record[ j - 1 ] ) {
					absences ++;
			}
		} return absences;
	}
};

test = function() {
for (var i = 0; i < model.students.length; i++){
	var studentName = model.students[ i ];
	var fred = octopus.countAbsences(studentName);
	console.log( studentName, octopus.getStudentRecord(studentName), fred);
};
};

/*======= VIEW =======*/

var view = {

	//Set up table
	addTable: function() {
		var attendanceList = octopus.getClassAttendance();
		var start = octopus.getDays.start;
		var end = octopus.getDays.end;
		var trStart = '<tr class="student"><td class="name-col">'
		var trBoxChecked = '<td class="attend-col"><input type="checkbox" checked="true"></td>';
		var trBoxUnchecked = '<td class="attend-col"><input type="checkbox" ></td>';
		var trEnd = '<td class="missed-col">';
		var trAdd;
		//Fill header row
		for (var j = start; j <= end; j ++ ) {
			$('#head-row .missed-col').before(' <th>' + j + '</th>');
		};
		//Add students
		$.each( attendanceList, function( name, days ) {
			//Student name
			trAdd = trStart + name + '</td>';
			//Checkbox for each day
			for (var k = start; k <= end; k ++ ) {
				if ( days[ k - 1 ]) {
					trAdd += trBoxChecked;
				} else {
					trAdd += trBoxUnchecked;
				}
			};
			//Row end
			trAdd += trEnd + octopus.countAbsences( name ) + '</td></tr>';
			$( '#student-data' ).append( trAdd );
		});

	}
}

octopus.init();

$(function() {

  $allMissed = $('tbody .missed-col'); //NOT NEEDED FOR FINAL
  $allCheckboxes = $('tbody input');  // NOT NEEDED FOR FINAL

    // Count a student's missed days  <-- MOVE TO OCTOPUS
    function countMissing() {
       $allMissed.each(function() {
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
    $allCheckboxes.on('click', function() {
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