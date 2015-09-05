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
  endDate: 12,
  days: function() {
	  var dayArray = [];
	  for (var i = this.startDate; i <= this.endDate; i++) {
		  dayArray.push( i );
	  };
	  return dayArray;
  },
  allMissed: $('tbody .missed-col'),
  allCheckboxes: $('tbody input')
  //TODO:  create obj for students using array of names and dates
};
//model.days();
//console.log(model.attendance);

/*======= OCTOPUS =======*/
var octopus = {
	// TODO: move init, count and update functions in here
	// Get student record from model

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

	//count absences
	countAbsences: function ( studentName ) {
		var record = this.getStudentRecord( studentName );
		var absences = 0;
		for (var j = model.startDate; j <= model.endDate; j ++ ) {
			if ( !record[ j ] ) {
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
	//console.log(student);
		//	for (var j = model.startDate; j <= model.endDate; j ++ ) {
		//		if ( student [])
		//	}



//octopus.countM();
/*======= VIEW =======*/

var view = {
	// TODO: use js to build page based on data instead of hard code
	// TODO: update local storage
	// TODO: update days missed on chart

	//set up table
	addTable: function() {
		var attendanceList = octopus.getClassAttendance();
		var start = octopus.getDays.start;
		var end = octopus.getDays.end;
		var trStart = '<tr class="student"><td class="name-col">'
		var trBox = '<td class="attend-col"><input type="checkbox"></td>';
		var trEnd = '<td class="missed-col">';
		var trAdd;
		//Fill header row
		for (var j = start; j <= end; j ++ ) {
			$('#head-row .missed-col').before(' <th>' + j + '</th>');
		};
		//Add students
		$.each( attendanceList, function( name ) {
			//Student name
			trAdd = trStart + name + '</td>';
			//Checkbox for each day
			for (var k = start; k <= end; k ++ ) {
				trAdd += trBox;
			};
			//Row end
			trAdd += trEnd + octopus.countAbsences( name ) + '</td></tr>';
			$( '#student-data' ).append( trAdd );
		});

	}
}

octopus.init();

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
