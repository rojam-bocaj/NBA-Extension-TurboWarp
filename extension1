// Original date of creation:
// 2026/01/11
// FULL CREDIT TO @rojam-bocaj FOR FULL CODE

(function (Scratch) {
    'use strict';

    // Shared global variables accessible by NBA Extension 2
    if (!Scratch.vm.runtime.nbaShared) {
        Scratch.vm.runtime.nbaShared = {
            SCOREBOARD: null,
            SUMMARY: null
        };
    }

    class NBAExtension1 {
        getInfo() {
            return {
                id: 'nbaExtension1',
                name: 'NBA EXTENSION 1',
                blocks: [
                    // -------- SCOREBOARD FETCH --------
                    {
                        opcode: 'fetchScoreboard',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'fetch NBA scoreboard for date [DATE]',
                        arguments: {
                            DATE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '20260111'
                            }
                        }
                    },
                    {
                        opcode: 'getMatchups',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game matchups'
                    },
                    {
                        opcode: 'getScores',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game scores'
                    },
                    {
                        opcode: 'getStates',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game states'
                    },
                    {
                        opcode: 'getTipoffTimes',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'tipoff times'
                    },
                    {
                        opcode: 'getEventIDs',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'event IDs'
                    },

                    // -------- SUMMARY FETCH --------
                    {
                        opcode: 'fetchSummary',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'fetch NBA game summary for event ID [EVENT]',
                        arguments: {
                            EVENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '401585567'
                            }
                        }
                    },

                    // -------- BASIC GAME STATE --------
                    {
                        opcode: 'getGameQuarter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game quarter'
                    },
                    {
                        opcode: 'getGameClock',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game clock'
                    },
                    {
                        opcode: 'getGameStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'game status'
                    }
                ]
            };
        }

        // ========== FETCHERS ==========

        async fetchScoreboard(args) {
            const date = String(args.DATE).trim();
            // ESPN NBA scoreboard
            const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${date}`;

            try {
                const response = await fetch(url);
                const json = await response.json();
                Scratch.vm.runtime.nbaShared.SCOREBOARD = json;
            } catch (e) {
                Scratch.vm.runtime.nbaShared.SCOREBOARD = null;
            }
        }

        async fetchSummary(args) {
            const eventId = String(args.EVENT).trim();
            // ESPN NBA game summary
            const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;

            try {
                const response = await fetch(url);
                const json = await response.json();
                Scratch.vm.runtime.nbaShared.SUMMARY = json;
            } catch (e) {
                Scratch.vm.runtime.nbaShared.SUMMARY = null;
            }
        }

        // ========== SAFE ACCESS HELPERS ==========

        get scoreboard() {
            return Scratch.vm.runtime.nbaShared.SCOREBOARD || {};
        }

        get summary() {
            return Scratch.vm.runtime.nbaShared.SUMMARY || {};
        }

        safeScoreboardEvents() {
            const ev = this.scoreboard.events;
            return Array.isArray(ev) ? ev : [];
        }

        // ========== SCOREBOARD REPORTERS ==========

        getMatchups() {
            return this.safeScoreboardEvents().map(e => {
                try {
                    const comps = e.competitions[0].competitors;
                    const home = comps.find(c => c.homeAway === 'home');
                    const away = comps.find(c => c.homeAway === 'away');
                    const homeName = home.team.shortDisplayName;
                    const awayName = away.team.shortDisplayName;
                    return `${awayName} @ ${homeName}`;
                } catch {
                    return 'Unknown matchup';
                }
            });
        }

        getScores() {
            return this.safeScoreboardEvents().map(e => {
                try {
                    const comps = e.competitions[0].competitors;
                    const home = comps.find(c => c.homeAway === 'home');
                    const away = comps.find(c => c.homeAway === 'away');
                    const homeScore = home.score;
                    const awayScore = away.score;
                    return `${awayScore} - ${homeScore}`;
                } catch {
                    return '';
                }
            });
        }

        getStates() {
            return this.safeScoreboardEvents().map(e => {
                try {
                    return e.status.type.state; // 'pre', 'in', 'post'
                } catch {
                    return '';
                }
            });
        }

        getTipoffTimes() {
            return this.safeScoreboardEvents().map(e => e.date || '');
        }

        getEventIDs() {
            return this.safeScoreboardEvents().map(e => e.id || '');
        }

        // ========== GAME STATE REPORTERS (FROM SUMMARY) ==========

        getGameQuarter() {
            try {
                const comp = this.summary.header.competitions[0];
                const period = comp.status.period;
                if (period === 1) return '1ST QUARTER';
                if (period === 2) return '2ND QUARTER';
                if (period === 3) return '3RD QUARTER';
                if (period === 4) return '4TH QUARTER';
                if (period === 5) return 'OVERTIME';
                return `PERIOD ${period}`;
            } catch {
                return '';
            }
        }

        getGameClock() {
            try {
                const comp = this.summary.header.competitions[0];
                return comp.status.displayClock || '';
            } catch {
                return '';
            }
        }

        getGameStatus() {
            try {
                const comp = this.summary.header.competitions[0];
                return comp.status.type.state || '';
            } catch {
                return '';
            }
        }
    }

    Scratch.extensions.register(new NBAExtension1());
})(Scratch);
