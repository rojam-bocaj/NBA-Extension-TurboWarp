(function (Scratch) {
    'use strict';

    class NBAExtension2 {
        getInfo() {
            return {
                id: 'nbaExtension2',
                name: 'NBA EXTENSION 2',
                blocks: [
                    // -------- TEAM STATS --------
                    { opcode: 'getFGPercent', blockType: Scratch.BlockType.REPORTER, text: 'field goal %' },
                    { opcode: 'getThreePercent', blockType: Scratch.BlockType.REPORTER, text: 'three point %' },
                    { opcode: 'getFTPercent', blockType: Scratch.BlockType.REPORTER, text: 'free throw %' },
                    { opcode: 'getRebounds', blockType: Scratch.BlockType.REPORTER, text: 'rebounds' },
                    { opcode: 'getAssists', blockType: Scratch.BlockType.REPORTER, text: 'assists' },
                    { opcode: 'getTurnovers', blockType: Scratch.BlockType.REPORTER, text: 'turnovers' },
                    { opcode: 'getPoints', blockType: Scratch.BlockType.REPORTER, text: 'points' }, // POINTS REPORTER BLOCK DOES NOT WORK PROPERLY

                    // -------- GAME INFO --------
                    { opcode: 'getVenue', blockType: Scratch.BlockType.REPORTER, text: 'venue' },
                    { opcode: 'getAttendance', blockType: Scratch.BlockType.REPORTER, text: 'attendance' },
                    { opcode: 'getOfficials', blockType: Scratch.BlockType.REPORTER, text: 'officials' },

                    // -------- SCORING PLAYS --------
                    { opcode: 'getScoringPlaysStructured', blockType: Scratch.BlockType.REPORTER, text: 'scoring plays structured' } // SCORING PLAYS REPORTER BLOCK DOES NOT WORK PROPERLY
                ]
            };
        }

        // -------- SHARED DATA ACCESS --------
        get summary() {
            return Scratch.vm.runtime.nbaShared?.SUMMARY || {};
        }

        // -------- TEAM STATS HELPER --------
        getTeamStatList(matchFn) {
            const teams = this.summary?.boxscore?.teams;
            if (!Array.isArray(teams)) return [];

            return teams.map(team => {
                const name = team.team?.shortDisplayName || 'Team';
                const stats = team.statistics || [];
                const stat = stats.find(matchFn);
                const value = stat?.displayValue ?? '?';
                return `${name}: ${value}`;
            });
        }

        // -------- CORRECTED TEAM STATS --------
        getFGPercent() {
            return this.getTeamStatList(s =>
                s.name === 'fieldGoalPct' ||
                s.abbreviation === 'FG%'
            );
        }

        getThreePercent() {
            return this.getTeamStatList(s =>
                s.name === 'threePointPct' ||
                s.abbreviation === '3P%'
            );
        }

        getFTPercent() {
            return this.getTeamStatList(s =>
                s.name === 'freeThrowPct' ||
                s.abbreviation === 'FT%'
            );
        }

        getRebounds() {
            return this.getTeamStatList(s =>
                s.name === 'rebounds' ||
                s.abbreviation === 'REB'
            );
        }

        getAssists() {
            return this.getTeamStatList(s =>
                s.name === 'assists' ||
                s.abbreviation === 'AST'
            );
        }

        getTurnovers() {
            return this.getTeamStatList(s =>
                s.name === 'turnovers' ||
                s.abbreviation === 'TO'
            );
        }

        // -------- CORRECTED POINTS REPORTER --------
        getPoints() {
            const comp = this.summary?.header?.competitions?.[0];
            if (!comp || !Array.isArray(comp.competitors)) return [];

            return comp.competitors.map(team => {
                const name = team.team?.shortDisplayName || 'Team';
                const score = team.score ?? '?';
                return `${name}: ${score}`;
            });
        }

        // -------- GAME INFO --------
        getVenue() {
            const v = this.summary?.gameInfo?.venue;
            if (!v) return '';
            const name = v.fullName || v.name || '';
            const city = v.address?.city || '';
            const state = v.address?.state || '';
            return city || state ? `${name} (${city}${city && state ? ', ' : ''}${state})` : name;
        }

        getAttendance() {
            const a = this.summary?.gameInfo?.attendance;
            return a ? `Attendance: ${a}` : '';
        }

        getOfficials() {
            const o = this.summary?.gameInfo?.officials;
            if (!Array.isArray(o)) return [];
            return o.map(ref => {
                const name = ref.displayName || 'Official';
                const pos = ref.position || ref.positionName || '';
                return pos ? `${name} (${pos})` : name;
            });
        }

        // -------- SCORING PLAYS --------
        periodToLabel(p) {
            if (p === 1) return '1ST QUARTER';
            if (p === 2) return '2ND QUARTER';
            if (p === 3) return '3RD QUARTER';
            if (p === 4) return '4TH QUARTER';
            return `OT ${p - 4}`;
        }

        getScoringPlaysStructured() {
            const plays = this.summary?.scoringPlays;
            if (!Array.isArray(plays)) return [];

            const out = [];

            for (const p of plays) {
                const quarter = this.periodToLabel(p.period);
                const clock = p.clock || '';
                const team = p.team?.shortDisplayName || 'Team';
                const base = p.text || p.description || '';

                // Players with jersey numbers
                const players = [];
                if (Array.isArray(p.participants)) {
                    for (const part of p.participants) {
                        const a = part.athlete;
                        if (!a) continue;
                        const name = a.displayName || a.shortName;
                        const jersey = a.jersey ? ` #${a.jersey}` : '';
                        players.push(name + jersey);
                    }
                }

                let playerText = '';
                if (players.length === 1) playerText = players[0];
                else if (players.length === 2) playerText = `${players[0]} to ${players[1]}`;
                else if (players.length > 2) playerText = players.join(', ');

                const desc = playerText
                    ? `${team}: ${base} (${playerText})`
                    : `${team}: ${base}`;

                out.push([quarter, clock, desc]);
            }

            return out;
        }
    }

    Scratch.extensions.register(new NBAExtension2());
})(Scratch);
