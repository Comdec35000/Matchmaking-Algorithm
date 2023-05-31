//data pool
const data = require('./data/players.json');

const fs = require('fs');

// config
const teamCount = 5;
const exportResult = false;
const exportPath = './out/teams.json';
const priviledgeEquity = true; //true : privileges equality but increases party split probability


console.log(dispatch(data));

function dispatch(data) {
    const playerCount = data.map(party => party.members.length).reduce((accumulator, a) => accumulator + a);
    const averragePlayerInTeams = playerCount / teamCount;

    console.log(`\x1b[32mLe nombre total de participant est de \x1b[34m${playerCount}\x1b[32m joueurs.\x1b[0m`);
    if(averragePlayerInTeams < 1) {
        return console.log("\x1b[33mLe nombre de joueur est inferieur au nombre d'équipes, vérifiez la validité de vos données.\x1b[0m");
    } else {
        console.log(`\x1b[32mChaque équipe contiendra \x1b[34m${averragePlayerInTeams}\x1b[32m joueurs en moyenne.\x1b[0m`);
    }

    const wheightedPool = data.map(party => {
        party.weight = weightParty(party);
        return party;
    });
    const sortedPool = wheightedPool.sort(sortPool);

    const teams = createTeams(sortedPool, averragePlayerInTeams);

    if(exportResult) exportTeamData(teams);
    return teams;
}

function weightParty(party) {
    if(party.members.length <= 0) return 0;

    return party.members
        .map(p => p.build_weight)
        .reduce((accumulator, a) => accumulator + a);
}

function sortPool(t1, t2) {
    const sizediff = t2.members.length - t1.members.length;
    const weightDiff = t2.weight - t1.weight;

    if(priviledgeEquity) return weightDiff;
    return sizediff === 0 ? weightDiff : sizediff;
}

function createTeams(pool, averragePlayerInTeams) {
    const teams = new Array(teamCount).fill(null).map(a => []);

    let i = 0;
    let increase = true;
    while(pool.length > 0) {

        if(teams[i].length === 0) {
            teams[i].push(pool.shift());
        }

        if(teams[i].map(party => party.members.length).reduce((accumulator, a) => accumulator + a) < Math.ceil(averragePlayerInTeams)) {
            const party = pool.shift();
            const partySize = party.members.length;
            const teamSize = teams[i]
                .map(p => p.members.length)
                .reduce((accumulator, a) => accumulator + a);


            //Splits the party in half if adding it to the team overflows it
            const difference = (partySize + teamSize) - Math.floor(averragePlayerInTeams);
            if(difference > 0) {
                const members = party.members.splice(partySize - difference, partySize+1);
                const newParty = { members }

                party.weight = weightParty(party);
                newParty.weight = weightParty(newParty);

                pool.unshift(newParty);
            }
            teams[i].push(party);
        }


        if(i <= 0) increase = true;
        if (i >= teamCount-1) increase = false;

        i = increase ? i+1 : i-1;
    }
    return teams.map(genStat)
}

function genStat(team, id) {
    return {
        id : id,
        playerCount : team.map(party => party.members.length).reduce((accumulator, a) => accumulator + a),
        weight : team.map(party => party.weight).reduce((accumulator, a) => accumulator + a),
        players : team.map(party => party.members).flat()
    }
}

function exportTeamData(teams) {
    const json = JSON.stringify(teams, null, 2);
    fs.writeFileSync(exportPath, json);
}
