/*======== Revised attendance function =========*/
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var attendance = {};
		var names = [ "Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda" ];

        for (var n = 0; n < names.length ; n ++ ){
            var name = names[ n ];
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        }

        localStorage.attendance = JSON.stringify(attendance);

    }
}());

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
		var name = e.data.name;
		var day = e.data.day;
		var num = e.data.num;
		var present = model.attendance[ name ][ day ];
		var newAttendance = model.attendance;

		if ( present ) {
			newAttendance[ name ][ day ] = false;
		} else {
			newAttendance[ name ][ day ] = true;
		}
		localStorage.attendance = JSON.stringify(newAttendance);
		view.updateAbsences( name, num );

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
		var students = octopus.getStudents;
		var start = octopus.getDays.start;
		var end = octopus.getDays.end;
		var trStart = '<tr class="student"><td class="name-col">';
		var boxStart = '<td class="attend-col"><input type="checkbox" id="';
		var checkedEnd ='" checked></td>';
		var uncheckedEnd = '" ></td>';
		var trEnd = '<td class="missed-col" id="missed-';
		var trAdd, boxID, name, num, present;

		//Fill header row
		for (var j = start; j <= end; j ++ ) {
			$('#head-row .missed-col').before(' <th>' + j + '</th>');
		}

		//Add students and attendance data /*
		for (var n = 0; n < students.length; n++ ) {
			//Get student name and number
			name = students[ n ].name;
			num = n + 1 ;
			stuRecord = octopus.getStudentRecord( name );

			//Start row with student name
			trAdd = trStart + name + '</td>';

			//Checkbox for each day - checked if present
			for (var k = start - 1; k < end; k ++ ) {
				present = stuRecord[ k ];
				boxID = "box-" + num + "-" + k;
				if ( present ) {
					trAdd += boxStart + boxID + checkedEnd;
				} else {
					trAdd += boxStart + boxID + uncheckedEnd;
				}
			}

			//End row with count of days absent
			trAdd += trEnd + num + '">' + octopus.countAbsences( name ) + '</td></tr>';
			$( '#student-data' ).append( trAdd );

			//Add click events to each box
			for (var day = start - 1; day < end; day ++ ) {
				boxID = "#box-" + num + "-" + day;
				$(document).on('click', boxID, { name: name, day: day, num: num }, octopus.clickBox );
			}
		}
	},

	updateAbsences: function ( name, num ) {
		var missing = octopus.countAbsences( name );
		$('#missed-' + num ).html( missing );
	}
};

octopus.init();