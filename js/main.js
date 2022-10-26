
let capturedHighestPoint = 0 // Defining and initializing a variable to hold the top-team's amount of points for later use.
const teamsList = Object.keys(data.teams) // A list of all the teams key-names in the competition. 

function computeTeamPoints() { // Updates the data-object with each teams current amt of games played, amt of points, and goal difference.

    capturedHighestPoint = 0 // Making sure this variable is reset before starting the computation.

    for (let i = 0; i < teamsList.length; i++) { // For each team in an array of the object data.teams,
        const teamName = teamsList[i]           // get the key for each team in data.teams
        let team = data.teams[teamName]
        //
        data.teams[teamName].currentSeason = {
            ... data.teams[teamName].currentSeason,                                // Compute:
            g: team.currentSeason.w + team.currentSeason.d + team.currentSeason.l, // Games played so far
            pts: (team.currentSeason.w * 3) + (team.currentSeason.d),              // Points
            gd: team.currentSeason.gf - team.currentSeason.ga                      // Goal difference
        }
        if (team.currentSeason.pts > capturedHighestPoint) {                       // Finding out what the top points of the leader is, and save for defining i in computeTable()
            capturedHighestPoint = team.currentSeason.pts
        }
    }
}
computeTeamPoints()

function computeTable() { // Sorts and returns the table in the correct table order.
    
    let tableArr = []   // Define return-variable
    

    for (let i = capturedHighestPoint; i !== 0; i--) { // For every possible amt of points, starting at the leader's points,
        let samePointsArr = []
        for (let team of teamsList) {           // Iterate thru each team
            if (data.teams[team].currentSeason.pts === i ) { // If the team's points is equal to i,
                samePointsArr.push(team)                    // Push that team's name to the samePointsArr
            }
        }
        if (samePointsArr.length < 2) {                     // If there are less than 2 teams with i amt of points,
            tableArr.push(... samePointsArr)                // spread samePointsArr at the end of the return-variable
        } else {                                            // Else, if there are more than 1 team with the same amt of points, 
            tableArr.push(... sortTeamsWithSamePoints(samePointsArr))   // Pass these teams to the sortTeamsWithSamePoints-function, and spread the returned array at the end of the return-variable
        }
    }
    return tableArr     // Finally, return the finished table

}

let table = computeTable()

function sortTeamsWithSamePoints(samePointsArr) {   // If there are several teams with the same amt of points, we go thru a series of conditions to determine the order of these teams in the table.
    let finalArr = [... samePointsArr]  // Define return-variable, and initialize this array with the argument that was passed from computeTable()

    finalArr.sort(function(team1, team2) {
        if (data.teams[team1].currentSeason.gd > data.teams[team2].currentSeason.gd ) { // Find which team has a better goal difference.
            return -1
        } else if (data.teams[team1].currentSeason.gd < data.teams[team2].currentSeason.gd ) {
            return 1
        } else {                                                                        // If they have the same goal difference,
            if (data.teams[team1].currentSeason.gf > data.teams[team2].currentSeason.gf ) { // find which team has scored the most goals
                return -1
            } else if (data.teams[team1].currentSeason.gf < data.teams[team2].currentSeason.gf ) {
                return 1
            } else {                                                                    // If they have the same amt of scored goals, leave order as is.
                return 0
                }
            }
    }) 

    return finalArr         // Return the updated return-variable back to computeTable() to be spread in its return-variable
}

function renderTable(table) {       //Renders the computed table to the DOM

    let tableEl = document.querySelector('tbody') // Get the tablebody
    let updatedTable = ``                         // Define and initialize a return variable

    for (let i = 0; i < table.length; i++) {       //For each team in the computed table,
                                                // add the following to the return variable
        updatedTable += `                          
            <tr class="table-body-row" id="row${i + 1}"> 
                <td>${i + 1}</td>
                <td></td>
                <td>${data.teams[table[i]].name}</td>
                <td>${data.teams[table[i]].currentSeason.g}</td>
                <td>${data.teams[table[i]].currentSeason.w}</td>
                <td>${data.teams[table[i]].currentSeason.d}</td>
                <td>${data.teams[table[i]].currentSeason.l}</td>
                <td>${data.teams[table[i]].currentSeason.gf}</td>
                <td>${data.teams[table[i]].currentSeason.ga}</td>
                <td>${data.teams[table[i]].currentSeason.gd}</td>
                <td>${data.teams[table[i]].currentSeason.pts}</td>
            </tr>
        `
    }
    tableEl.innerHTML = updatedTable // Finally render the updated return-variable to the DOM
}

renderTable(table)
