(function (Scratch) {
    'use strict';

    class TimeConverterExtension {
        getInfo() {
            return {
                id: 'timeConverterExtension',
                name: 'TIME CONVERTER',
                blocks: [
                    {
                        opcode: 'convertTime',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'convert UTC time [UTC] to local time',
                        arguments: {
                            UTC: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '2026-01-12T02:00Z'
                            }
                        }
                    }
                ]
            };
        }

        convertTime(args) {
            const raw = String(args.UTC).trim();

            // If invalid, return empty
            const date = new Date(raw);
            if (isNaN(date.getTime())) return '';

            // Convert to user's local time
            const options = {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short'
            };

            try {
                return date.toLocaleTimeString([], options);
            } catch {
                return '';
            }
        }
    }

    Scratch.extensions.register(new TimeConverterExtension());
})(Scratch);
