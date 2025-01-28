// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
// validate the input data

function validateData(course, assignmentGroup) {
  if (course.id !== assignmentGroup.course_id) {
    throw new Error (` Invalid data: Assignment Group ${assignmentGroup.id} doesn't belong to Course ${course.id}`);
  }

  assignmentGroup.assignments.forEach((assignment) => {
    if (assignment.points_possible <= 0 || typeof assignment.points_possible !== "number") {
        throw new Error(`Invalid data: Assignment ${assignment.id} has invalid points_possible .`);
    }
});
}


// filtering assignments based on the due date

function getDueAssignments(assignments) {
  const today = new Date().toISOString(); // grabbing current date using ISO format
  return assignments.filter((assignment) =>  {
    const dueDate = new Date(assignment.due_at);
    return dueDate <= new Date(); // Include only assignments that are due today or in the past
});
}


// Processing learner submissions

function processSubmissions(assignmentGroup, submissions) {
  const results = {};

  submissions.forEach((submission) => {
    const assignment = assignmentGroup.assignments.find((a) => a.id === submission.assignment_id);
    // ignore submissions for assignments that are not part of the group
    if (!assignment) return;

    // skip assignments that are not yet due
    const dueDate = new Date(assignment.due_at);
      if (dueDate > new Date()) {
          console.log(`Skipping future assignment: ${assignment.name}`);
          return;
      }

    //Penalty for submitting late
    const submissionDate = new Date(submission.submission.submitted_at);
    let score = submission.submission.score;
    
    //Apply 10% penalty if it's a late submission
    if (submissionDate > dueDate) {
      score -= 0.1 * score;
    }

    // Grouping results by learner ID
    if (!results[submission.learner_id]) {
      results[submission.learner_id] = {
        id: submission.learner_id,
        avg: 0,
        totalPoints: 0,
        totalPossiblePoints: 0,
      };
    }

    // Update total score and percentage
    const learner = results[submission.learner_id];
    const percentage = score / assignment.points_possible;
    learner[assignment.id] = percentage; // storing the percentage for the assignment
    learner.totalPoints += score; // updating total score
    learner.totalPossiblePoints += assignment.points_possible; // updating total possible points
  });

  // Calculate weighted average for each leaner
  Object.values(results).forEach((learner) => {
    learner.avg = learner.totalPoints / learner.totalPossiblePoints;
    delete learner.totalPoints;
    delete learner.totalPossiblePoints;
  });

  return Object.values(results);
}



  // function getLearnerData(course, ag, submissions) {
      // here, we would process this data to achieve the desired result.
    
  // }
  
  // const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  // console.log(result);


//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

//   return result;
  