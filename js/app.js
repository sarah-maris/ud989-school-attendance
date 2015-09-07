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

  studentNames: [ "Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda" ],

  studentData: function( names ) {
	  var studentsArray = [];


	  for (var n = 0; n < names.length; n++ ) {
		  var student = {};
		  student.name = names[ n ];
		  student.num = n + 1;
		  studentsArray.push( student );
	  }
	return studentsArray;
  },

  startDate: 1,

  endDate: 12

};

/*======= OCTOPUS =======*/
var octopus = {

	//Show table
	init: function() {
		view.addTable();
	},

	getClassAttendance: function () {
		return model.attendance;
	},

	getStudentRecord:  function( studentName ) {
		return model.attendance[ studentName ];
	},

	getStudents: model.studentData( model.studentNames ),

	getDays: {
		start: model.startDate,
		end: model.endDate
	},

	clickBox: function(e){
		var clickName = e.data.clickName;
		var clickDay = e.data.clickDay;
		var num = e.data.clickNum;
		var clickCheck = model.attendance[ clickName ][ clickDay ];
		var newAttendance = model.attendance;

	console.log ( clickName, clickDay, clickCheck );
				//console.log ( clickCheck, model.attendance[ clickName ][ clickDay ]);
		if ( clickCheck ) {
			newAttendance[ clickName ][ clickDay ] = false;
		} else {
			newAttendance[ clickName ][ clickDay ] = true;
		}
		localStorage.attendance = JSON.stringify(newAttendance);
		view.updateAbsences( clickName, num );
		
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

/*======= VIEW =======*/

var view = {

	//Show data table
	addTable: function() {
		//var attendanceList = octopus.getClassAttendance(); // Really needed?
		var students = octopus.getStudents;
		var start = octopus.getDays.start;
		var end = octopus.getDays.end;
		var trStart = '<tr class="student"><td class="name-col">'
		var boxStart = '<td class="attend-col"><input type="checkbox" id="'
		var checkedEnd ='" checked></td>';
		var uncheckedEnd = '" ></td>';
		var trEnd = '<td class="missed-col" id="missed-';
		//var stuNum = 1;
		var trAdd, boxID, name, stuNum, present;

		//Fill header row
		for (var j = start; j <= end; j ++ ) {
			$('#head-row .missed-col').before(' <th>' + j + '</th>');
		};

		//Add students/*
		//$.each( attendanceList, function( name, days ) {
		for (var n = 0; n < students.length; n++ ) {
			//Student name
			name = students[ n ].name;
			stuNum = students[ n ].num ;
	//	console.log(stuNum);
			stuRecord = octopus.getStudentRecord( name );
	//	console.log( name, stuNum, stuRecord );
			trAdd = trStart + name + '</td>';
			//Checkbox for each day
			for (var k = start - 1; k < end; k ++ ) {
				present = stuRecord[ k ];
				boxID = "box-" + stuNum + "-" + k;
				if ( present ) {
					trAdd += boxStart + boxID + checkedEnd;
				} else {
					trAdd += boxStart + boxID + uncheckedEnd;
				}
			};
			//Row end
			trAdd += trEnd + stuNum + '">' + octopus.countAbsences( name ) + '</td></tr>';
			$( '#student-data' ).append( trAdd );

			//Add click events
			for (var m = start - 1; m < end; m ++ ) {
				boxID = "#box-" + stuNum + "-" + m;
				$(document).on('click', boxID, { clickName: name, clickDay: m, clickNum: stuNum }, octopus.clickBox );
			};
			stuNum ++;
		};
	},
	
	updateAbsences: function ( name, num ) {
		var missing = octopus.countAbsences( name );
		$('#missed-' + num ).html( missing );
	}
}

octopus.init();
/*
$(function() {

  $allMissed = $('tbody .missed-col'); //NOT NEEDED FOR FINAL
  $allCheckboxes = $('tbody input');  // NOT NEEDED FOR FINAL

    // Count a student's missed days  <-- MOVED TO OCTOPUS
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

    // Check boxes, based on attendace records  <-- MOVED to VIEW
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
}());*/