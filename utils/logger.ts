import { relative } from "node:path";

const { log } = console;

["debug", "log", "warn", "error", "table", "dir"].forEach((methodName) => {
	// @ts-ignore
	const originalLoggingMethod = console[methodName];

	// @ts-ignore
	console[methodName] = (...args: unknown[]) => {
		const originalPrepareStackTrace = Error.prepareStackTrace;

		Error.prepareStackTrace = (_, stack) => stack;

		// Casting here because we change the value of Error.prepareStackTrace above:
		const callee = (new Error().stack as unknown as NodeJS.CallSite[])[1];

		if (!callee) return;

		Error.prepareStackTrace = originalPrepareStackTrace;

		const relativeFileName = relative(
			process.cwd(),
			callee.getFileName() ?? "<unknown file name>",
		)
			.replace(process.cwd(), "")
			.replace("file:/", "");

		const label = `${relativeFileName}:${callee.getLineNumber()}`;

		log("\x1b[90m%s\x1b[0m", label);

		originalLoggingMethod(...args);
	};
});
